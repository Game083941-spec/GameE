"use client";

import { useState, useEffect } from "react";
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
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('autofill_email');
      const savedPhone = localStorage.getItem('autofill_phone');
      
      if (savedEmail || savedPhone) {
        const initialResponses: Record<string, string> = {};
        fields.forEach(f => {
          if (f.type === 'EMAIL' && savedEmail) {
            initialResponses[f.id] = savedEmail;
          } else if ((f.type === 'PHONE' || f.type === 'NUMBER' || f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('number') || f.label.toLowerCase().includes('whatsapp')) && savedPhone) {
            initialResponses[f.id] = savedPhone;
          }
        });
        
        if (Object.keys(initialResponses).length > 0) {
          setResponses(prev => ({ ...prev, ...initialResponses }));
        }
      }
    } catch (e) {}
  }, [fields]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

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
    try {
      const emailField = fields.find(f => f.type === 'EMAIL');
      if (emailField && responses[emailField.id]) {
        localStorage.setItem('autofill_email', responses[emailField.id]);
      }
      const phoneField = fields.find(f => f.type === 'PHONE' || f.type === 'NUMBER' || f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('number') || f.label.toLowerCase().includes('whatsapp'));
      if (phoneField && responses[phoneField.id]) {
        localStorage.setItem('autofill_phone', responses[phoneField.id]);
      }
    } catch (e) {}


    for (const field of fields) {
      if (field.required && !responses[field.id]) {
        setError(`Please fill out all required fields. (${field.label} is missing)`);
        setIsSubmitting(false);
        return;
      }
    }

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
        const orderRes = await createRazorpayOrder(amount);
        if (orderRes.error) {
          setError(orderRes.error);
          setIsSubmitting(false);
          return;
        }

        if (orderRes.mock) {
          setIsProcessing(true);
          const verifyRes = await verifyPayment(
            orderRes.orderId,
            `mock_payment_${Date.now()}`,
            "mock_signature",
            result.submissionId,
            amount
          );

          if (verifyRes.error) {
             setError(verifyRes.error);
             setIsSubmitting(false); setIsProcessing(false);
             return;
          }

          setIsSuccess(true);
          setIsSubmitting(false);
          router.push(`/f/${form.id}/success`);
          return;
        }

        // Redirect to the provided Razorpay Payment Link
        window.location.href = process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://rzp.io/rzp/KCK7aEGK";
        return;
      }
    }

    const emailField = fields.find(f => f.type === "EMAIL");
    if (emailField && responses[emailField.id]) {
      const teamNameField = fields.find((f: any) => f.label.toLowerCase().includes("team"));
      const teamName = teamNameField ? responses[teamNameField.id] : "N/A";
      const playerNameField = fields.find((f: any) => f.type === "TEXT" && f.label.toLowerCase().includes("name"));
      const playerName = playerNameField ? responses[playerNameField.id] : "Player";

      try {
        sendRegistrationEmail(
          responses[emailField.id],
          playerName,
          teamName,
          form.title,
          result.submissionId,
          "Free / Not Required"
        ).catch(e => console.error("Failed to send free registration email:", e));
      } catch (e) {
        console.error("Failed to trigger registration email:", e);
      }
    }

    setIsProcessing(false);
    setIsSuccess(true);
    setIsSubmitting(false);
    router.push(`/f/${form.id}/success`);
  };

  if (isSuccess || isProcessing) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-12 shadow-lg border-primary/20 overflow-hidden">
        <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center relative">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

          <div className="relative">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              {isSuccess ? <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in duration-300" /> : <CreditCard className="h-8 w-8 text-primary animate-pulse" />}
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight z-10 animate-in fade-in slide-in-from-bottom-2">
            {isSuccess ? "Redirecting..." : "Processing Payment..."}
          </h2>

          <p className="text-muted-foreground text-lg max-w-md mt-4 z-10">
            {isSuccess
              ? "Payment verified! Taking you to the receipt..."
              : "Please wait while we securely process your transaction. Do not close or refresh this page."}
          </p>

          {isProcessing && !isSuccess && (
            <div className="mt-8 w-full max-w-xs space-y-2 z-10">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
              </div>
              <div className="text-xs text-muted-foreground flex justify-between animate-pulse">
                <span>Connecting to secure gateway</span>
                <span>Encrypting...</span>
              </div>
            </div>
          )}
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
