import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";

export default async function DashboardRoot() {
  const orgs = await getUserOrganizations();

  if (orgs.length === 0) {
    redirect("/onboarding");
  } else {
    // Redirect to the first organization by default
    redirect(`/dashboard/${orgs[0].slug}`);
  }
}
