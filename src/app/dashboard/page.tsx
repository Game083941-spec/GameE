import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";
import { isSuperAdmin } from "@/actions/admin";

export default async function DashboardRoot() {
  const organizations = await getUserOrganizations() as any[];

  if (await isSuperAdmin()) {
    redirect("/dashboard/admin");
  }

  if (!organizations || organizations.length === 0) {
    redirect("/onboarding");
  }

  // If the user has organizations, redirect them to the first one's dashboard
  redirect(`/dashboard/${organizations[0].slug}`);
}
