interface PasswordResetTemplateProps {
  resetLink: string;
}

export const getPasswordResetTemplate = ({ resetLink }: PasswordResetTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px; }
    .container { max-w-md: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #000000; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 32px; color: #3f3f46; line-height: 1.6; text-align: center; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 24px 0; }
    .btn:hover { background-color: #334155; }
    .footer { padding: 24px; text-align: center; font-size: 14px; color: #94a3b8; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ESportHub</h1>
    </div>
    <div class="content">
      <h2 style="color: #0f172a; margin-top: 0;">Reset your password</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one.</p>
      
      <a href="${resetLink}" class="btn" style="color: #ffffff;">Reset Password</a>
      
      <p style="font-size: 14px; color: #64748b; margin-top: 24px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #64748b; word-break: break-all;">${resetLink}</p>
    </div>
    <div class="footer">
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
  </div>
</body>
</html>
`;
