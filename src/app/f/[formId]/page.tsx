import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FormRenderer } from "@/components/form-renderer";
import { Metadata } from "next";

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
    title: `${form.title} - GameFormHub`,
    description: form.description || "A public form on GameFormHub.",
  };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const supabase = await createClient();

  // Fetch Form and Organization Name
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select(`
      *,
      organization:organizations(name)
    `)
    .eq("id", formId)
    .single();

  if (formError || !form) {
    console.error(formError);
    notFound();
  }

  // Fetch Sections
  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("form_id", formId)
    .order("order_index");

  if (sectionsError) {
    console.error(sectionsError);
    notFound();
  }

  // Fetch Fields (since sections exist, we can just get all fields for these sections)
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
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <FormRenderer 
        form={form} 
        sections={sections} 
        fields={fields} 
        orgName={form.organization?.name || "this organization"} 
      />
    </div>
  );
}
