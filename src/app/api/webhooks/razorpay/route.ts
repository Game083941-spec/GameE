import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Missing secret or signature" }, { status: 400 });
    }

    // Verify the webhook signature to ensure it came from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // Handle payment successful capture
    if (event.event === "payment.captured" || event.event === "payment.authorized") {
      const paymentData = event.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;
      const razorpayPaymentId = paymentData.id;
      
      const adminSupabase = createAdminClient();
      
      // Look up if we already have this payment record
      const { data: existingPayment } = await adminSupabase
        .from("payments")
        .select("submission_id, status")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      if (existingPayment?.submission_id) {
        // If payment isn't marked SUCCESS yet, update it
        if (existingPayment.status !== "SUCCESS") {
          await adminSupabase
            .from("submissions")
            .update({ payment_status: "SUCCESS", payment_id: razorpayPaymentId })
            .eq("id", existingPayment.submission_id);
            
          await adminSupabase
            .from("payments")
            .update({ 
              status: "SUCCESS",
              razorpay_payment_id: razorpayPaymentId
            })
            .eq("razorpay_order_id", razorpayOrderId);
        }
      }
    }

    // Handle payment failed
    if (event.event === "payment.failed") {
      const paymentData = event.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;
      
      const adminSupabase = createAdminClient();
      
      await adminSupabase
        .from("payments")
        .update({ status: "FAILED" })
        .eq("razorpay_order_id", razorpayOrderId);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
