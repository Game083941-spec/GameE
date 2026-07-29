"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateTag, unstable_cache } from "next/cache";

export async function insertTeamFromSubmission(submissionId: string) {
  const adminSupabase = createAdminClient();

  const { data: subData } = await adminSupabase
    .from("submissions")
    .select(`*, form:forms(organization_id, title)`)
    .eq("id", submissionId)
    .single();

  if (!subData) return;

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

  const { error: insertError } = await adminSupabase
    .from("teams")
    .insert({
      organization_id: subData.form.organization_id,
      name: teamName,
      contact_email: contactEmail || contact,
      contact_phone: "",
      source: "FORM_SUBMISSION",
      submission_id: submissionId,
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

    const { data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", orgSlug)
      .single();

    if (!orgData) return [];

    const teamsList: any[] = [];

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

export async function getEligibleNotificationTeams(orgSlug: string) {
  const supabase = createAdminClient();

  const { data: orgData } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (!orgData) return [];

  const teamsList: any[] = [];

  const { data: allTeams } = await supabase
    .from("teams")
    .select(`
      id, name, contact_email, contact_phone, source, created_at, submission_id,
      submissions (
        payment_status,
        form:forms (
          is_published
        )
      )
    `)
    .eq("organization_id", orgData.id)
    .order("created_at", { ascending: false });

  if (allTeams) {
    allTeams.forEach((t: any) => {
      // Logic for filtering teams
      let isEligible = false;
      
      if (t.source === "MANUAL") {
        isEligible = true; // Manual teams are always included
      } else if (t.source === "FORM_SUBMISSION") {
        const sub = Array.isArray(t.submissions) ? t.submissions[0] : t.submissions;
        if (sub) {
          const isPaid = sub.payment_status === "SUCCESS" || sub.payment_status === "NOT_REQUIRED";
          const form = Array.isArray(sub.form) ? sub.form[0] : sub.form;
          const isActive = form && form.is_published === true;
          if (isPaid && isActive) {
            isEligible = true;
          }
        } else {
          // If no submission_id linked (old data before fix), we can't reliably know, 
          // but we'll include them by default to not break old records unless strict is needed.
          // The user wants strictly "only whose data show payment is done", so we should exclude them
          // if they lack submission data, but we'll provide a backfill script.
        }
      }

      if (isEligible) {
        teamsList.push({
          id: t.id,
          teamName: t.name,
          contact: t.contact_email || t.contact_phone || "No Contact",
          contactEmail: t.contact_email,
          formName: t.source === "MANUAL" ? "Manual Entry" : "Form Submission",
          date: new Date(t.created_at).toLocaleDateString(),
          source: t.source
        });
      }
    });
  }

  return teamsList;
}

export async function bulkAddManualTeams(orgSlug: string, teamsData: { name: string, email: string, phone: string }[]) {
  const supabase = await createClient();

  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (orgError || !orgData) {
    return { error: "Organization not found" };
  }

  const teamsToInsert = teamsData.map(team => ({
    organization_id: orgData.id,
    name: team.name || "Unknown Team",
    contact_email: team.email || "",
    contact_phone: team.phone || "",
    source: "MANUAL",
  }));

  const { error: insertError } = await supabase
    .from("teams")
    .insert(teamsToInsert);

  if (insertError) {
    console.error("Error bulk adding teams:", insertError);
    return { error: "Failed to bulk add teams" };
  }

  revalidateTag("org-teams-v3", "default");
  return { success: true, count: teamsToInsert.length };
}
