"use server";

import { sendEmail } from "@/lib/email";
import { getPaymentTemplate } from "@/lib/templates/payment";
import { getRegistrationTemplate } from "@/lib/templates/registration";
import { getOTPTemplate } from "@/lib/templates/otp";
import { getVerificationTemplate } from "@/lib/templates/verification";
import { getPasswordResetTemplate } from "@/lib/templates/password-reset";

export async function sendPaymentConfirmationEmail(
  userEmail: string,
  formTitle: string,
  amount: number,
  paymentId: string,
  teamName: string = "N/A"
) {
  return await sendEmail({
    to: userEmail,
    subject: `Payment Successful - ${formTitle}`,
    html: getPaymentTemplate({
      amount,
      transactionId: paymentId,
      tournamentName: formTitle,
      teamName,
    }),
  });
}

export async function sendRegistrationEmail(
  userEmail: string,
  playerName: string,
  teamName: string,
  tournamentName: string,
  registrationId: string,
  paymentStatus: string
) {
  return await sendEmail({
    to: userEmail,
    subject: "Registration Successful 🎉",
    html: getRegistrationTemplate({
      playerName,
      teamName,
      tournamentName,
      registrationId,
      date: new Date().toLocaleDateString(),
      paymentStatus,
    }),
  });
}

export async function sendOTPEmail(userEmail: string, otp: string) {
  return await sendEmail({
    to: userEmail,
    subject: "Your Verification Code",
    html: getOTPTemplate({ otp }),
  });
}

export async function sendVerificationEmail(userEmail: string, verificationLink: string) {
  return await sendEmail({
    to: userEmail,
    subject: "Verify your email address",
    html: getVerificationTemplate({ verificationLink }),
  });
}

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
  return await sendEmail({
    to: userEmail,
    subject: "Reset your password",
    html: getPasswordResetTemplate({ resetLink }),
  });
}

export async function broadcastToTeams(emails: string[], subject: string, message: string) {
  // We send individual emails or use bcc to avoid exposing all emails to everyone.
  // Using individual emails in a loop (Promise.all) is safer for simple setups.
  
  if (!emails || emails.length === 0) return { error: "No recipients provided" };

  try {
    const emailPromises = emails.map(email => 
      sendEmail({
        to: email,
        subject: subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0;">ESportHub Message</h2>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9; border: 1px solid #eeeeee;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #888888;">
              This is a broadcast message from the tournament organizer via ESportHub.
            </div>
          </div>
        `
      })
    );

    await Promise.all(emailPromises);
    return { success: true, count: emails.length };
  } catch (error: any) {
    console.error("Broadcast failed:", error);
    return { error: "Failed to send broadcast emails" };
  }
}
