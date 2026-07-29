"use client";

interface PaymentButtonProps {
  text?: string;
  className?: string;
}

export function PaymentButton({ text = "Pay Now", className = "" }: PaymentButtonProps) {
  const paymentLink = "https://rzp.io/rzp/KCK7aEGK";

  return (
    <a 
      href={paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${className}`}
    >
      {text}
    </a>
  );
}
