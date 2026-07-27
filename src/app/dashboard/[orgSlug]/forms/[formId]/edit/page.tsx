import { BuilderLayout } from "@/components/builder/builder-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SaveFormButton } from "@/components/builder/save-form-button";
import { getUserOrganizations } from "@/actions/organizations";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { FormBuilderHydrator } from "@/components/builder/form-builder-hydrator";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ orgSlug: string; formId: string }>;
}) {
  const { orgSlug, formId } = await params;
  const orgs = await getUserOrganizations() as any[];
  const org = orgs.find((o: any) => o.slug === orgSlug);

  if (!org) {
    redirect("/dashboard");
  }

  const supabase = await createClient();

  // Fetch the form with its sections and fields
  const { data: form, error } = await supabase
    .from("forms")
    .select(`
      title, 
      description,
      sections (
        id,
        title,
        description,
        order_index,
        fields (
          id,
          type,
          label,
          placeholder,
          required,
          options,
          order_index
        )
      )
    `)
    .eq("id", formId)
    .single();

  if (error || !form) {
    notFound();
  }

  // Transform data to match FormSection[] format expected by Zustand
  const mappedSections = (form.sections || [])
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map((section: any) => ({
      id: section.id,
      title: section.title,
      description: section.description || "",
      fields: (section.fields || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((field: any) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || "",
          required: field.required,
          options: field.options || [],
        }))
    }));

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <FormBuilderHydrator 
        formTitle={form.title} 
        formDescription={form.description || ""} 
        sections={mappedSections} 
      />

      {/* Builder Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${orgSlug}/forms`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Edit Form</h2>
            <p className="text-sm text-muted-foreground">
              {org.name} Organization
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* We pass formId so the button knows to update instead of create */}
          <SaveFormButton orgSlug={orgSlug} formId={formId} />
        </div>
      </div>

      {/* Main Drag and Drop Interface */}
      <div className="flex-1 min-h-0">
        <BuilderLayout />
      </div>
    </div>
  );
}
