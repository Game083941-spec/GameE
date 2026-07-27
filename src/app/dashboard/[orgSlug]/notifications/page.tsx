import { NotificationsForm } from "@/components/notifications/notifications-form";

export default async function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Send custom emails or messages to anyone.
        </p>
      </div>

      <NotificationsForm />
    </div>
  );
}
