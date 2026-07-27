"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitForm(formId: string, responses: Record<string, any>) {
  const supabase = await createClient();

  // 1. Create the base submission record
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      // We don't insert responses here anymore, we use submission_answers table
    })
    .select("id")
    .single();

  if (submissionError || !submissionData) {
    return { error: submissionError?.message || "Failed to create submission" };
  }

  // 2. Insert the answers for each field
  const answersToInsert = Object.entries(responses).map(([fieldId, value]) => ({
    submission_id: submissionData.id,
    field_id: fieldId,
    value: value !== null && value !== undefined ? String(value) : "",
  }));

  if (answersToInsert.length > 0) {
    const { error: answersError } = await supabase
      .from("submission_answers")
      .insert(answersToInsert);

    if (answersError) {
      console.error("Failed to insert answers:", answersError);
      return { error: "Failed to save form answers" };
    }
  }

  return { success: true, submissionId: submissionData.id };
}

export async function getFormSubmissions(formId: string) {
  const supabase = await createClient();

  // RLS will ensure they can only view it if they are an org member
  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select("*, submission_answers(field_id, value)")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (subError) {
    console.error("Error fetching submissions:", subError);
    return [];
  }

  // Reconstruct the responses object for frontend compatibility
  return submissions.map(sub => {
    const responses: Record<string, any> = {};
    if (sub.submission_answers) {
      sub.submission_answers.forEach((answer: any) => {
        responses[answer.field_id] = answer.value;
      });
    }
    return {
      ...sub,
      responses
    };
  });
}
