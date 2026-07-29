import { createClient } from "@/lib/supabase/server";
import { ManageMembersClient } from "./manage-members-client";

export default async function MembersPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();

  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("slug", orgSlug)
    .single();

  let members: any[] = [];
  if (orgData) {
    const { data: membersData } = await supabase
      .from("members")
      .select(`
        role,
        sidebar_permissions,
        created_at,
        profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("organization_id", orgData.id);

    if (membersData) {
      members = membersData;
    }
  }

  return (
    <div className="space-y-6">
      <ManageMembersClient orgId={orgData?.id} members={members} />
    </div>
  );
}
