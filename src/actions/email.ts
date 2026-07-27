"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPaymentConfirmationEmail(
  userEmail: string,
  formTitle: string,
  amount: number,
  paymentId: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "GameFormHub <noreply@gameformhub.com>", // You'll need to verify this domain in Resend
      to: [userEmail],
      subject: `Payment Successful - ${formTitle}`,
      html: `
        <div style="font-family: sans-serif; max-w-md: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #10b981;">Payment Successful!</h2>
          <p>Thank you for submitting <strong>${formTitle}</strong>.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Receipt Details</h3>
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
            <p><strong>Transaction ID:</strong> ${paymentId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated no-reply email from GameFormHub. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { error: "Internal error while sending email" };
  }
}
