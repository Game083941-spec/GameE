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
