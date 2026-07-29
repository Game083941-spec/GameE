"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateTag, unstable_cache } from "next/cache";

export async function submitForm(formId: string, responses: Record<string, any>, paymentRequired: boolean = false) {
  const supabase = await createClient();

  const { data: formData, error: formError } = await supabase
    .from("forms")
    .select(`
      settings,
      submissions(count)
    `)
    .eq("id", formId)
    .single();

  if (formError || !formData) {
    return { error: "Form not found or could not verify limits." };
  }

  const limit = formData.settings?.limit;
  const currentCount = formData.submissions?.[0]?.count || 0;

  if (limit && currentCount >= limit) {
    return { error: "This form has reached its maximum number of submissions and is now closed." };
  }

  const { data: formSections } = await supabase
    .from("sections")
    .select("id")
    .eq("form_id", formId);

  let formFields: any[] = [];
  if (formSections && formSections.length > 0) {
    const sectionIds = formSections.map(s => s.id);
    const { data: fieldsData } = await supabase
      .from("fields")
      .select("id, label")
      .in("section_id", sectionIds);
    formFields = fieldsData || [];
  } else {
    formFields = null as any;
  }

  const humanReadableResponses: Record<string, any> = {};
  let team_name = "";
  let contact_email = "";
  let contact_phone = "";
  let in_game_name = "";
  let discord_tag = "";

  if (formFields) {
    for (const [key, val] of Object.entries(responses)) {
      const field = formFields.find(f => f.id === key);
      const label = field ? field.label : key;
      humanReadableResponses[label] = val;

      const lower = label.toLowerCase();
      if ((lower.includes("team") || lower.includes("name")) && !team_name) team_name = String(val);
      else if (lower.includes("email") && !contact_email) contact_email = String(val);
      else if ((lower.includes("phone") || lower.includes("number")) && !contact_phone) contact_phone = String(val);
      else if ((lower.includes("game") || lower.includes("ign")) && !in_game_name) in_game_name = String(val);
      else if (lower.includes("discord") && !discord_tag) discord_tag = String(val);
    }
  } else {
    Object.assign(humanReadableResponses, responses);
  }

  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      payment_status: paymentRequired ? "PENDING" : "NOT_REQUIRED",
      team_name,
      contact_email,
      contact_phone,
      in_game_name,
      discord_tag,
      responses: humanReadableResponses,
    })
    .select("id")
    .single();

  if (submissionError || !submissionData) {
    return { error: submissionError?.message || "Failed to create submission" };
  }

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
    }
  }

  if (!paymentRequired) {
    const { insertTeamFromSubmission } = await import("./teams");
    await insertTeamFromSubmission(submissionData.id);
  }

  // Insert into analytics_users directly to capture all responses safely
  const { error: analyticsError } = await supabase
    .from("analytics_users")
    .insert({
      original_form_id: formId,
      responses: humanReadableResponses,
    });
    
  if (analyticsError) {
    console.error("Analytics Error:", analyticsError);
  }

  revalidateTag("form-submissions", "default");
  revalidateTag("org-teams-v3", "default");

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

  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select("*, submission_answers(field_id, value)")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (subError) {
    console.error("Error fetching submissions:", subError);
    return [];
  }

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
