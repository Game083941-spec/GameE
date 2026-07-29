"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";

const getCachedAnalyticsTeams = unstable_cache(
  async (orgSlug: string) => {
    const supabase = createAdminClient();

    const { data: orgData } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", orgSlug)
      .single();

    if (!orgData) return [];

    const { data: analyticsTeams, error } = await supabase
      .from("analytics_teams")
      .select("*")
      .eq("organization_id", orgData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching analytics teams:", error);
      return [];
    }

    return analyticsTeams;
  },
  ["org-analytics-teams"],
  { tags: ["org-analytics-teams"] }
);

export async function getAnalyticsTeams(orgSlug: string) {
  return await getCachedAnalyticsTeams(orgSlug);
}
