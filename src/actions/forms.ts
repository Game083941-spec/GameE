"use server";

import { createClient } from "@/lib/supabase/server";
import { FormSection } from "@/lib/store/form-builder";
import { revalidatePath } from "next/cache";

export async function saveForm(
  orgSlug: string,
  title: string,
  description: string,
  sections: FormSection[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // 1. Get the organization ID from the slug
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (orgError || !orgData) {
    return { error: "Organization not found" };
  }

  const orgId = orgData.id;

  // 2. Insert or update the form metadata
  // For simplicity in this iteration, we create a new form every time or update if slug matches.
  // Real app: We'd use a form ID. We'll generate a slug based on title + random.
  const formSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  // Find if there's any IMAGE field to use as the form's banner_url
  let bannerUrl = null;
  for (const section of sections) {
    const imageField = section.fields.find(f => f.type === "IMAGE" && f.options?.[0]?.value);
    if (imageField) {
      bannerUrl = imageField.options![0].value;
      break;
    }
  }

  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      organization_id: orgId,
      title,
      slug: formSlug,
      description,
      banner_url: bannerUrl,
      is_published: true,
    })
    .select("id")
    .single();

  if (formError || !formData) {
    return { error: formError?.message || "Failed to create form" };
  }

  const formId = formData.id;

  // 3. Insert sections and fields
  for (let sIndex = 0; sIndex < sections.length; sIndex++) {
    const section = sections[sIndex];
    
    const { data: sectionData, error: sectionError } = await supabase
      .from("sections")
      .insert({
        form_id: formId,
        title: section.title,
        description: section.description,
        order_index: sIndex,
      })
      .select("id")
      .single();

    if (sectionError || !sectionData) {
      console.error("Section Error:", sectionError);
      continue;
    }

    // 4. Insert fields for this section
    if (section.fields.length > 0) {
      const fieldsToInsert = section.fields.map((field, fIndex) => ({
        section_id: sectionData.id,
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || null,
        required: field.required,
        options: field.options || [],
        order_index: fIndex,
      }));

      const { error: fieldsError } = await supabase
        .from("fields")
        .insert(fieldsToInsert);

      if (fieldsError) {
        console.error("Fields Error:", fieldsError);
      }
    }
  }

  revalidatePath(`/dashboard/${orgSlug}/forms`);
  return { success: true, formSlug };
}
