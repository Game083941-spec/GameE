interface RegistrationTemplateProps {
  playerName: string;
  teamName: string;
  tournamentName: string;
  registrationId: string;
  date: string;
  paymentStatus: string;
}

export const getRegistrationTemplate = ({
  playerName,
  teamName,
  tournamentName,
  registrationId,
  date,
  paymentStatus,
}: RegistrationTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px; }
    .container { max-w-md: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #000000; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 32px; color: #3f3f46; line-height: 1.6; }
    .details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .label { font-weight: 500; color: #64748b; }
    .value { font-weight: 600; color: #0f172a; text-align: right; }
    .footer { padding: 24px; text-align: center; font-size: 14px; color: #94a3b8; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GameFormHub</h1>
    </div>
    <div class="content">
      <h2 style="color: #10b981; margin-top: 0;">Registration Successful! 🎉</h2>
      <p>Hi ${playerName},</p>
      <p>You have successfully registered for <strong>${tournamentName}</strong>.</p>
      
      <div class="details">
        <div class="row"><span class="label">Registration ID</span><span class="value">${registrationId}</span></div>
        <div class="row"><span class="label">Team Name</span><span class="value">${teamName}</span></div>
        <div class="row"><span class="label">Tournament</span><span class="value">${tournamentName}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
        <div class="row"><span class="label">Payment Status</span><span class="value" style="color: ${paymentStatus.toLowerCase() === 'paid' ? '#10b981' : '#f59e0b'};">${paymentStatus}</span></div>
      </div>
      
      <p>Good luck in the tournament!</p>
    </div>
    <div class="footer">
      <p>This is an automated email from GameFormHub. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
