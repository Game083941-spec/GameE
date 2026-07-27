import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";
import { isSuperAdmin } from "@/actions/admin";

export default async function DashboardRoot() {
  try {
    const organizations = await getUserOrganizations() as any[];

    if (await isSuperAdmin()) {
      redirect("/dashboard/admin");
    }
    if (!organizations || organizations.length === 0) {
      redirect("/onboarding");
    }
    redirect(`/dashboard/${organizations[0].slug}`);
  } catch (error: any) {
    if ((error.message && error.message === "NEXT_REDIRECT") || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) {
      throw error; // Let Next.js handle redirects
    }
    return (
      <div className="p-8 text-red-500 bg-red-50 rounded-md m-8">
        <h2 className="text-xl font-bold mb-4">Dashboard Error</h2>
        <pre>{error?.message || String(error)}</pre>
        <pre className="mt-4 text-xs">{error?.stack}</pre>
      </div>
    );
  }
}
