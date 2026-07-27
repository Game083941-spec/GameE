"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateTag, unstable_cache } from "next/cache";

export async function submitForm(formId: string, responses: Record<string, any>, paymentRequired: boolean = false) {
  const supabase = await createClient();

  // 1. Create the base submission record
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      payment_status: paymentRequired ? "PENDING" : "NOT_REQUIRED",
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
      console.error("Answers Error:", answersError);
      // Don't fail the whole submission if answers fail, but log it
    }
  }

  // 3. If no payment required, insert into teams immediately
  if (!paymentRequired) {
    const { insertTeamFromSubmission } = await import("./teams");
    await insertTeamFromSubmission(submissionData.id);
  }

  revalidateTag("form-submissions", "default");
  revalidateTag("org-teams", "default");
  
  return { success: true, submissionId: submissionData.id };
}

const getCachedSubmissions = unstable_cache(
  async (formId: string) => {
    const supabase = createAdminClient();

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(`
        id,
        created_at,
        payment_status,
        submission_answers (
          id,
          field_id,
          value,
          field:fields(
            label,
            type
          )
        )
      `)
      .eq("form_id", formId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      return [];
    }

    return submissions;
  },
  ["form-submissions"],
  { tags: ["form-submissions"] }
);

export async function getSubmissions(formId: string) {
  return await getCachedSubmissions(formId);
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
