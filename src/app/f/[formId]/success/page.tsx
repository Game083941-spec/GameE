import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FormSuccessPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();

  const { data: form, error } = await supabase
    .from("forms")
    .select(`
      title,
      settings,
      organization:organizations(name)
    `)
    .eq("id", formId)
    .single();

  if (error || !form) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 flex flex-col justify-center items-center">
      <Card className="w-full max-w-2xl mx-auto mt-12 shadow-lg border-primary/20">
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Submission Received!</h2>
          <p className="text-muted-foreground text-xl max-w-lg">
            Thank you for filling out <strong>{form.title}</strong>. Your response has been securely recorded by {form.organization?.[0]?.name || (form.organization as any)?.name || "the organization"}.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-lg mt-4 text-left">
            <p className="text-foreground font-medium mb-2">
              Your ID and pass will be provided on your email.
            </p>
            <p className="text-sm text-muted-foreground">
              For any issues, please contact this mail:{" "}
              <a
                href={`mailto:${form.settings?.contactEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.SMTP_USER || "support@esporthub.com"}`}
                className="text-primary hover:underline font-medium"
              >
                {form.settings?.contactEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.SMTP_USER || "support@esporthub.com"}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
