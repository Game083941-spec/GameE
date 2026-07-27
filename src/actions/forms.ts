"use server";

import { createClient } from "@/lib/supabase/server";
import { FormSection } from "@/lib/store/form-builder";
import { revalidatePath } from "next/cache";

export async function saveForm(
  orgSlug: string,
  title: string,
  description: string,
  sections: FormSection[],
  formId?: string
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

  let currentFormId = formId;

  // Find if there's any IMAGE field to use as the form's banner_url
  let bannerUrl = null;
  for (const section of sections) {
    const imageField = section.fields.find(f => f.type === "IMAGE" && f.options?.[0]?.value);
    if (imageField) {
      bannerUrl = imageField.options![0].value;
      break;
    }
  }

  if (formId) {
    // Update existing form
    const { error: updateError } = await supabase
      .from("forms")
      .update({
        title,
        description,
        banner_url: bannerUrl,
      })
      .eq("id", formId);

    if (updateError) {
      return { error: updateError.message || "Failed to update form" };
    }
    
    // Clear old sections and fields to replace them
    // Relying on CASCADE DELETE if sections are deleted, fields should be deleted.
    await supabase.from("sections").delete().eq("form_id", formId);
    
  } else {
    // Create new form
    const formSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
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
    currentFormId = formData.id;
  }

  // 3. Insert sections and fields
  for (let sIndex = 0; sIndex < sections.length; sIndex++) {
    const section = sections[sIndex];
    
    const { data: sectionData, error: sectionError } = await supabase
      .from("sections")
      .insert({
        form_id: currentFormId,
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
  return { success: true };
}

export async function deleteForm(orgSlug: string, formId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("forms")
    .delete()
    .eq("id", formId);

  if (error) {
    return { error: error.message || "Failed to delete form" };
  }

  revalidatePath(`/dashboard/${orgSlug}/forms`);
  return { success: true };
}
