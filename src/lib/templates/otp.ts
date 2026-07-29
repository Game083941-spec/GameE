interface OTPTemplateProps {
  otp: string;
}

export const getOTPTemplate = ({ otp }: OTPTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px; }
    .container { max-w-md: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #000000; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 32px; color: #3f3f46; line-height: 1.6; text-align: center; }
    .otp-box { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px dashed #cbd5e1; font-size: 36px; font-weight: 800; letter-spacing: 4px; color: #0f172a; }
    .footer { padding: 24px; text-align: center; font-size: 14px; color: #94a3b8; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ESportHub</h1>
    </div>
    <div class="content">
      <h2 style="color: #0f172a; margin-top: 0;">Verification Code</h2>
      <p>Use the following code to complete your verification process. This code will expire in <strong>5 minutes</strong>.</p>

      <div class="otp-box">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #64748b;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>This is an automated email from ESportHub. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
