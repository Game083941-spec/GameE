import { NotificationsForm } from "@/components/notifications/notifications-form";
import { getOrgTeams } from "@/actions/teams";

export default async function NotificationsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const teams = await getOrgTeams(orgSlug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Select teams or enter custom emails to send notifications.
        </p>
      </div>

      <NotificationsForm initialTeams={teams} />
    </div>
  );
}
