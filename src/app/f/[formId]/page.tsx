import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FormRenderer } from "@/components/form-renderer";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ formId: string }> }): Promise<Metadata> {
  const { formId } = await params;
  const supabase = await createClient();

  const { data: form } = await supabase
    .from("forms")
    .select("title, description")
    .eq("id", formId)
    .single();

  if (!form) {
    return {
      title: "Form Not Found",
    };
  }

  return {
    title: `${form.title} - ESportHub`,
    description: form.description || "A public form on ESportHub.",
  };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();

  const { data: form, error: formError } = await supabase
    .from("forms")
    .select(`
      *,
      organization:organizations(name),
      submissions(count)
    `)
    .eq("id", formId)
    .single();

  if (formError || !form) {
    console.error(formError);
    notFound();
  }

  const submissionsCount = form.submissions?.[0]?.count || 0;
  const limit = form.settings?.limit;

  if (limit && submissionsCount >= limit) {
    return (
      <div
        className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative"
        style={form.banner_url ? {
          backgroundImage: `url(${form.banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        } : undefined}
      >
        {form.banner_url && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-none" />
        )}
        <Card className="relative z-10 w-full max-w-lg shadow-2xl border-t-4 border-t-primary bg-card/95 backdrop-blur">
          <CardContent className="pt-16 pb-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 ring-8 ring-primary/5">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Event Closed</h2>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                The slots are full, please try the next slot.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("form_id", formId)
    .order("order_index");

  if (sectionsError) {
    console.error(sectionsError);
    notFound();
  }

  const sectionIds = sections.map((s: any) => s.id);

  let fields: any[] = [];
  if (sectionIds.length > 0) {
    const { data: fieldsData, error: fieldsError } = await supabase
      .from("fields")
      .select("*")
      .in("section_id", sectionIds)
      .order("order_index");

    if (fieldsError) {
      console.error(fieldsError);
    } else {
      fields = fieldsData || [];
    }
  }

  return (
    <div
      className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative"
      style={form.banner_url ? {
        backgroundImage: `url(${form.banner_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : undefined}
    >
      {form.banner_url && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-none" />
      )}
      <div className="relative z-10 w-full">
      <FormRenderer
        form={form}
        sections={sections}
        fields={fields}
        orgName={form.organization?.name || "this organization"}
      />
      </div>
    </div>
  );
}
