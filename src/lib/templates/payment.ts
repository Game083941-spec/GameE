interface PaymentTemplateProps {
  amount: number;
  transactionId: string;
  tournamentName: string;
  teamName: string;
}

export const getPaymentTemplate = ({
  amount,
  transactionId,
  tournamentName,
  teamName,
}: PaymentTemplateProps) => `
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
    .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
    .footer { padding: 24px; text-align: center; font-size: 14px; color: #94a3b8; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GameFormHub</h1>
    </div>
    <div class="content">
      <h2 style="color: #10b981; margin-top: 0; text-align: center;">Payment Successful!</h2>
      
      <div class="amount">₹${amount}</div>
      
      <p style="text-align: center;">Your payment for <strong>${tournamentName}</strong> was processed successfully.</p>
      
      <div class="details">
        <div class="row"><span class="label">Transaction ID</span><span class="value" style="font-family: monospace;">${transactionId}</span></div>
        <div class="row"><span class="label">Team Name</span><span class="value">${teamName}</span></div>
        <div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString()}</span></div>
      </div>
      
    </div>
    <div class="footer">
      <p>This is an automated receipt from GameFormHub. Please keep it for your records.</p>
    </div>
  </div>
</body>
</html>
`;
