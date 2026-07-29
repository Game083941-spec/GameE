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

  // 5. Fetch member role and permissions
  let memberRole = "VIEWER";
  let sidebarPermissions: string[] = [];
  
  if (user && currentOrg) {
    const { data: memberData } = await supabase
      .from("members")
      .select("role, sidebar_permissions")
      .eq("organization_id", currentOrg.id)
      .eq("profile_id", user.id)
      .single();
      
    if (memberData) {
      memberRole = memberData.role;
      sidebarPermissions = memberData.sidebar_permissions || [];
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40">
      {/* Sidebar — fixed height, never scrolls */}
      <Sidebar 
        orgSlug={orgSlug} 
        isSuperAdmin={user?.email === process.env.SUPER_ADMIN_EMAIL} 
        userEmail={user?.email}
        memberRole={memberRole}
        sidebarPermissions={sidebarPermissions}
        globalRole={user?.user_metadata?.role}
      />
      {/* Main area — scrolls independently */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Topbar 
          user={user} 
          organizations={organizations} 
          currentOrgSlug={orgSlug} 
          isSuperAdmin={user?.email === process.env.SUPER_ADMIN_EMAIL}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 sm:py-4 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
