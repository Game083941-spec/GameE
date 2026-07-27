import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function DashboardOrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const orgs = await getUserOrganizations();
  
  if (orgs.length === 0) {
    redirect("/onboarding");
  }

  const currentOrg = orgs.find((o) => o.slug === orgSlug);

  if (!currentOrg) {
    // If the org doesn't exist or user doesn't have access, fallback to root dashboard
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-1">
        <Sidebar orgSlug={orgSlug} />
        <div className="flex flex-col flex-1 sm:gap-4 sm:py-4">
          <Topbar 
            userEmail={user?.email ?? ""} 
            organizations={orgs} 
            currentOrg={currentOrg} 
          />
          <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
