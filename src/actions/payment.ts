"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number) {
  try {
    const options = {
      amount: amount * 100, // Razorpay amount is in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return { error: error.message || "Failed to create order" };
  }
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  submissionId: string,
  amount: number
) {
  try {
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return { error: "Payment verification failed (invalid signature)" };
    }

    const adminSupabase = createAdminClient();

    // 1. Insert into payments table
    const { error: paymentError } = await adminSupabase.from("payments").insert({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      submission_id: submissionId,
      amount,
      status: "SUCCESS"
    });

    if (paymentError) throw paymentError;

    // 2. Update submission payment_status
    const { error: updateError } = await adminSupabase
      .from("submissions")
      .update({ payment_status: "SUCCESS", payment_id: razorpayPaymentId })
      .eq("id", submissionId);

    if (updateError) throw updateError;

    // 3. Insert into teams table physically
    const { insertTeamFromSubmission } = await import("./teams");
    await insertTeamFromSubmission(submissionId);

    // 4. Invalidate cache
    const { revalidateTag } = await import("next/cache");
    revalidateTag("form-submissions", {});
    revalidateTag("org-teams", {});

    return { success: true };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return { error: error.message || "Payment verification failed" };
  }
}

export async function getOrganizationPayments(orgSlug: string) {
  const supabase = await createClient();

  // Get org ID
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (!orgData) return [];

  // Fetch payments joined with submissions and forms
  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      status,
      created_at,
      razorpay_payment_id,
      submission:submissions (
        id,
        form:forms (
          id,
          title,
          organization_id
        )
      )
    `)
    .eq("status", "SUCCESS")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  // Filter payments where the submission's form belongs to this org
  // (PostgREST filtering on joined tables can be tricky, so we filter in memory or use inner joins if properly typed. Memory filter is fine for MVP)
  return payments.filter((p: any) => p.submission?.form?.organization_id === orgData.id);
}
