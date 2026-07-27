import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Shield, ShieldAlert, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();

  // Fetch the organization ID
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("slug", orgSlug)
    .single();

  // Fetch members (placeholder or actual fetch)
  let members = [];
  if (orgData) {
    const { data: membersData } = await supabase
      .from("members")
      .select(`
        role,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to {orgData?.name || "this organization"}.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            All users who currently have access to this organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length > 0 ? members.map((member: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{member.profiles?.full_name || "Unknown User"}</h4>
                    <p className="text-xs text-muted-foreground">{member.profiles?.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {member.role === "OWNER" && <ShieldAlert className="h-3 w-3" />}
                    {member.role === "ADMIN" && <Shield className="h-3 w-3" />}
                    {member.role}
                  </span>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No members found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Invite your team members to collaborate.
                </p>
                <Button variant="outline">Invite Member</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
