import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";

export default async function DashboardRoot() {
  const organizations = await getUserOrganizations() as any[];

  if (!organizations || organizations.length === 0) {
    redirect("/onboarding");
  }

  // If the user has organizations, redirect them to the first one's dashboard
  redirect(`/dashboard/${organizations[0].slug}`);
}
