"use server";

import { createClient } from "@/lib/supabase/server";

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

  return { success: true };
}

export async function getOrgTeams(orgSlug: string) {
  const supabase = await createClient();

  // Get org ID
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (!orgData) return [];

  const teamsList: any[] = [];

  // 1. Fetch Manual Teams from teams table
  const { data: manualTeams } = await supabase
    .from("teams")
    .select("*")
    .eq("organization_id", orgData.id)
    .order("created_at", { ascending: false });

  if (manualTeams) {
    manualTeams.forEach(t => {
      teamsList.push({
        id: t.id,
        teamName: t.name,
        contact: t.contact_email || t.contact_phone || "No Contact",
        contactEmail: t.contact_email,
        formName: "Manual Entry",
        date: new Date(t.created_at).toLocaleDateString(),
        source: "MANUAL"
      });
    });
  }

  // 2. Fetch Form Submissions (Dynamic Teams)
  const { data: forms } = await supabase
    .from("forms")
    .select("id, title")
    .eq("organization_id", orgData.id);

  if (forms && forms.length > 0) {
    const formIds = forms.map(f => f.id);
    
    const { data: submissions } = await supabase
      .from("submissions")
      .select(`
        id,
        created_at,
        form_id,
        payment_status,
        submission_answers(
          field:fields(label),
          value
        )
      `)
      .in("form_id", formIds)
      .in("payment_status", ["SUCCESS", "NOT_REQUIRED"])
      .order("created_at", { ascending: false });

    if (submissions) {
      submissions.forEach(sub => {
        let teamName = "Unknown Team";
        let contact = "";
        let contactEmail = "";
        
        sub.submission_answers?.forEach((ans: any) => {
          const label = ans.field?.label?.toLowerCase() || "";
          if (label.includes("team")) {
            teamName = ans.value;
          }
          if (label.includes("email")) {
            contactEmail = ans.value;
          }
          if (label.includes("name") && !label.includes("team")) {
            contact = ans.value;
          }
        });

        const formName = forms.find(f => f.id === sub.form_id)?.title;

        if (teamName !== "Unknown Team") {
          teamsList.push({
            id: sub.id,
            teamName,
            contact: contactEmail || contact || "No Contact",
            contactEmail: contactEmail,
            formName: formName || "Unknown Form",
            date: new Date(sub.created_at).toLocaleDateString(),
            source: "FORM_SUBMISSION"
          });
        }
      });
    }
  }

  // Deduplicate teams by name (optional, but good if they submit multiple forms)
  // For now, we return all to show history.
  return teamsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
