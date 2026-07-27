import { redirect } from "next/navigation";
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Fetch all organizations for the switcher
  const { data: orgsData } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .order("created_at", { ascending: false });
    
  const organizations = (orgsData || []) as any[];

  // 4. Validate current organization
  const currentOrg = organizations.find((o) => o.slug === orgSlug);

  if (!currentOrg) {
    // If the org doesn't exist or user doesn't have access, fallback to root dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-1">
        <Sidebar 
          orgSlug={orgSlug} 
          isSuperAdmin={user?.email === process.env.SUPER_ADMIN_EMAIL} 
          userEmail={user?.email}
        />
        <div className="flex flex-col flex-1 sm:gap-4 sm:py-4">
          <Topbar 
            user={user} 
            organizations={organizations} 
            currentOrgSlug={orgSlug} 
            isSuperAdmin={user?.email === process.env.SUPER_ADMIN_EMAIL}
          />
          <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
