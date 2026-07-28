"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submitForm } from "@/actions/submissions";
import { createRazorpayOrder, verifyPayment } from "@/actions/payment";
import { sendPaymentConfirmationEmail, sendRegistrationEmail } from "@/actions/email";
import { Loader2, CheckCircle2, CreditCard } from "lucide-react";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface FormRendererProps {
  form: any;
  sections: any[];
  fields: any[];
  orgName: string;
}

export function FormRenderer({ form, sections, fields, orgName }: FormRendererProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Group fields by section
  const fieldsBySection = sections.map(section => ({
    ...section,
    fields: fields.filter(f => f.section_id === section.id && f.type !== "IMAGE").sort((a, b) => a.order_index - b.order_index)
  })).sort((a, b) => a.order_index - b.order_index);

  const handleInputChange = (fieldId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate required fields
    for (const field of fields) {
      if (field.required && !responses[field.id]) {
        setError(`Please fill out all required fields. (${field.label} is missing)`);
        setIsSubmitting(false);
        return;
      }
    }

    // Check if there is a payment field
    const paymentField = fields.find(f => f.type === "PAYMENT");
    const amount = paymentField ? parseInt(paymentField.options?.[0]?.value || "0") : 0;
    const paymentRequired = amount > 0;

    const result = await submitForm(form.id, responses, paymentRequired);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    if (paymentRequired) {
      if (amount > 0) {
        // 1. Create Razorpay Order
        const orderRes = await createRazorpayOrder(amount);
        if (orderRes.error) {
          setError(orderRes.error);
          setIsSubmitting(false);
          return;
        }

        // 2. Open Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: "INR",
          name: orgName,
          description: form.title,
          order_id: orderRes.orderId,
          handler: async function (response: any) {
            setIsProcessing(true);
            // 3. Verify Payment
            const verifyRes = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              result.submissionId,
              amount
            );

            if (verifyRes.error) {
              setError(verifyRes.error);
              setIsSubmitting(false);
              setIsProcessing(false);
              return;
            }

            // 4. Send Confirmation Email (Find email field if it exists)
            const emailField = fields.find(f => f.type === "EMAIL");
            
            if (emailField && responses[emailField.id]) {
              const teamNameField = fields.find((f: any) => f.label.toLowerCase().includes("team"));
              const teamName = teamNameField ? responses[teamNameField.id] : "N/A";
              const playerNameField = fields.find((f: any) => f.type === "TEXT" && f.label.toLowerCase().includes("name"));
              const playerName = playerNameField ? responses[playerNameField.id] : "Player";

              try {
                await sendPaymentConfirmationEmail(
                  responses[emailField.id],
                  form.title,
                  amount,
                  response.razorpay_payment_id,
                  teamName
                );

                await sendRegistrationEmail(
                  responses[emailField.id],
                  playerName,
                  teamName,
                  form.title,
                  result.submissionId,
                  "Paid"
                );
              } catch (e) {
                console.error("Failed to send emails:", e);
              }
            }

            setIsSuccess(true);
            setIsSubmitting(false);
            router.push(`/f/${form.id}/success`);
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#10b981"
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: 'Pay with UPI (GPay, PhonePe, Paytm)',
                  instruments: [
                    {
                      method: 'upi'
                    }
                  ]
                },
                other: {
                  name: 'Other Payment Modes',
                  instruments: [
                    { method: 'card' },
                    { method: 'netbanking' },
                    { method: 'wallet' },
                    { method: 'paylater' }
                  ]
                }
              },
              sequence: ['block.upi', 'block.other'],
              preferences: {
                show_default_blocks: false
              }
            }
          }
        };

        try {
          if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            throw new Error("Razorpay API key is missing. Please configure it in your dashboard.");
          }
          if (!(window as any).Razorpay) {
            throw new Error("Payment gateway is still loading or was blocked by an ad-blocker. Please disable ad-blockers and try again.");
          }
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (response: any) {
            setError(response.error.description || "Payment failed");
            setIsSubmitting(false);
            setIsProcessing(false);
          });
          rzp.open();
        } catch (err: any) {
          setError(err.message || "Failed to initialize payment gateway. Please try again.");
          setIsSubmitting(false);
        }
        return; // Don't set success state yet, wait for callback
      }
    }

    // If no payment required
    const emailField = fields.find(f => f.type === "EMAIL");
    if (emailField && responses[emailField.id]) {
      const teamNameField = fields.find((f: any) => f.label.toLowerCase().includes("team"));
      const teamName = teamNameField ? responses[teamNameField.id] : "N/A";
      const playerNameField = fields.find((f: any) => f.type === "TEXT" && f.label.toLowerCase().includes("name"));
      const playerName = playerNameField ? responses[playerNameField.id] : "Player";

      try {
        await sendRegistrationEmail(
          responses[emailField.id],
          playerName,
          teamName,
          form.title,
          result.submissionId,
          "Free / Not Required"
        );
      } catch (e) {
        console.error("Failed to send registration email:", e);
      }
    }

    setIsSuccess(true);
    setIsSubmitting(false);
    router.push(`/f/${form.id}/success`);
  };

  if (isSuccess || isProcessing) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-12 shadow-lg border-primary/20">
        <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isProcessing ? "Processing Payment..." : "Redirecting..."}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Please wait while we process your submission. Do not close or refresh this page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-primary">
      <CardHeader className="pb-8 border-b bg-muted/30">
        <CardTitle className="text-3xl font-bold tracking-tight">{form.title}</CardTitle>
        {form.description && (
          <CardDescription className="text-base mt-2">{form.description}</CardDescription>
        )}
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-8 space-y-12">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm font-medium p-4 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {fieldsBySection.map((section) => (
            <div key={section.id} className="space-y-6">
              {section.title && section.title !== "Untitled Section" && (
                <div className="border-b pb-2">
                  <h3 className="text-xl font-semibold tracking-tight">{section.title}</h3>
                  {section.description && <p className="text-muted-foreground text-sm">{section.description}</p>}
                </div>
              )}
              
              <div className="space-y-8">
                {section.fields.map((field: any) => (
                  <div key={field.id} className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    
                    {field.type === "TEXT" || field.type === "EMAIL" || field.type === "NUMBER" || field.type === "BGMI_UID" ? (
                      <Input
                        type={field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : "text"}
                        placeholder={field.placeholder || "Your answer"}
                        required={field.required}
                        value={responses[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-12 text-base transition-colors focus-visible:ring-primary"
                      />
                    ) : field.type === "PAYMENT" ? (
                      <div className="h-12 flex items-center px-4 bg-muted/30 border rounded-md text-lg font-semibold text-primary">
                        ₹ {field.options?.[0]?.value || "0"}
                      </div>
                    ) : (
                       <Input
                        type="text"
                        placeholder="Fallback for unsupported field"
                        disabled
                        className="h-12 bg-muted/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="pt-8 pb-8 bg-muted/10 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            Powered by <strong className="text-foreground">ESportHub</strong>
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting} className="font-semibold px-8 shadow-md w-full sm:w-auto order-1 sm:order-2">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : fields.some(f => f.type === "PAYMENT") ? (
              "Submit & Pay"
            ) : (
              "Submit Form"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
    </>
  );
}
