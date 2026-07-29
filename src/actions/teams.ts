"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateTag, unstable_cache } from "next/cache";

export async function insertTeamFromSubmission(submissionId: string) {
  const adminSupabase = createAdminClient();

  // 1. Fetch submission and form details
  const { data: subData } = await adminSupabase
    .from("submissions")
    .select(`*, form:forms(organization_id, title)`)
    .eq("id", submissionId)
    .single();

  if (!subData) return;

  // 2. Fetch answers with field labels and types
  const { data: answers } = await adminSupabase
    .from("submission_answers")
    .select(`value, field:fields(label, type)`)
    .eq("submission_id", submissionId);

  let teamName = "Unknown Team";
  let contact = "";
  let contactEmail = "";

  if (answers) {
    answers.forEach((ans: any) => {
      const label = ans.field?.label?.toLowerCase() || "";
      if (label.includes("team")) {
        teamName = ans.value;
      }
      if (ans.field?.type === "EMAIL" || label.includes("email")) {
        contactEmail = ans.value;
      }
      if (label.includes("name") && !label.includes("team")) {
        contact = ans.value;
      }
    });
  }

  if (teamName === "Unknown Team" && contact !== "") {
    teamName = contact;
  } else if (teamName === "Unknown Team") {
    teamName = "Individual Registration";
  }

  // 3. Insert into teams table
  const { error: insertError } = await adminSupabase
    .from("teams")
    .insert({
      organization_id: subData.form.organization_id,
      name: teamName,
      contact_email: contactEmail || contact,
      contact_phone: "",
      source: "FORM_SUBMISSION",
    });

  if (insertError) {
    console.error("Error inserting team from submission:", insertError);
  }
}

export async function addManualTeam(
  orgSlug: string,
  teamName: string,
  contactEmail: string,
  contactPhone: string
) {
  const supabase = await createClient();

  // Get org ID
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (orgError || !orgData) {
    return { error: "Organization not found" };
  }

  const { error: insertError } = await supabase
    .from("teams")
    .insert({
      organization_id: orgData.id,
      name: teamName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      source: "MANUAL",
    });

  if (insertError) {
    console.error("Error adding manual team:", insertError);
    return { error: "Failed to add team" };
  }

  revalidateTag("org-teams-v3", "default");
  return { success: true };
}

const getCachedOrgTeams = unstable_cache(
  async (orgSlug: string) => {
    const supabase = createAdminClient();

    // Get org ID
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", orgSlug)
      .single();

    if (!orgData) return [];

    const teamsList: any[] = [];

    // Fetch ALL Teams from teams table
    const { data: allTeams } = await supabase
      .from("teams")
      .select("id, name, contact_email, contact_phone, source, created_at")
      .eq("organization_id", orgData.id)
      .order("created_at", { ascending: false });

    if (allTeams) {
      allTeams.forEach(t => {
        teamsList.push({
          id: t.id,
          teamName: t.name,
          contact: t.contact_email || t.contact_phone || "No Contact",
          contactEmail: t.contact_email,
          formName: t.source === "MANUAL" ? "Manual Entry" : "Form Submission",
          date: new Date(t.created_at).toLocaleDateString(),
          source: t.source
        });
      });
    }

    return teamsList;
  },
  ["org-teams-cache-v3"], 
  { tags: ["org-teams-v3"] }
);

export async function getOrgTeams(orgSlug: string) {
  return await getCachedOrgTeams(orgSlug);
}
