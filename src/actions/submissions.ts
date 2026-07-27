"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitForm(formId: string, responses: Record<string, any>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      responses,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message || "Failed to submit form" };
  }

  return { success: true, submissionId: data.id };
}

export async function getFormSubmissions(formId: string) {
  const supabase = await createClient();

  // RLS will ensure they can only view it if they are an org member
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data;
}
