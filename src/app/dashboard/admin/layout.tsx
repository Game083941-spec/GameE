import { Topbar } from "@/components/topbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/actions/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isSuperAdmin())) {
    redirect("/login");
  }

  // Fetch all organizations for the switcher
  const { data: orgsData } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .order("created_at", { ascending: false });

  const organizations = (orgsData || []) as any[];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <Topbar 
          user={user} 
          organizations={organizations} 
          isSuperAdmin={true}
        />
        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
