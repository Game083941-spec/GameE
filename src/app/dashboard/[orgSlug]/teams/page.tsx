import { getOrgTeams } from "@/actions/teams";
import { TeamsManager } from "@/components/teams/teams-manager";

export default async function TeamsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  
  // Fetch combined teams (Manual + Form Submissions)
  const teams = await getOrgTeams(orgSlug);

  return (
    <TeamsManager initialTeams={teams} orgSlug={orgSlug} />
  );
}
