import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function TeamsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();

  // Fetch all successful submissions for forms belonging to this org
  const { data: orgData } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  let activeTeams: any[] = [];

  if (orgData) {
    const { data: forms } = await supabase
      .from("forms")
      .select("id, title")
      .eq("organization_id", orgData.id);

    if (forms && forms.length > 0) {
      const formIds = forms.map(f => f.id);
      
      const { data: submissions } = await supabase
        .from("submissions")
        .select(`
          id,
          created_at,
          form_id,
          payment_status,
          submission_answers(
            field:fields(label),
            value
          )
        `)
        .in("form_id", formIds)
        .in("payment_status", ["SUCCESS", "NOT_REQUIRED"])
        .order("created_at", { ascending: false });

      if (submissions) {
        activeTeams = submissions.map(sub => {
          let teamName = "Unknown Team";
          let contact = "";
          
          sub.submission_answers?.forEach((ans: any) => {
            const label = ans.field?.label?.toLowerCase() || "";
            if (label.includes("team")) {
              teamName = ans.value;
            }
            if (label.includes("name") && !label.includes("team")) {
              contact = ans.value;
            }
          });

          const formName = forms.find(f => f.id === sub.form_id)?.title;

          return {
            id: sub.id,
            teamName,
            contact,
            formName,
            date: new Date(sub.created_at).toLocaleDateString()
          };
        }).filter(t => t.teamName !== "Unknown Team");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage currently active teams and players playing in your games.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Active Teams ({activeTeams.length})
          </CardTitle>
          <CardDescription>
            Teams currently registered for upcoming matches and tournaments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
              <Trophy className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No teams found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                You haven't received any successful team registrations yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTeams.map((team, idx) => (
                <div key={idx} className="border rounded-lg p-4 flex flex-col gap-2 hover:border-primary transition-colors bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {team.teamName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold truncate text-lg">{team.teamName}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="truncate">{team.contact || "No Contact"}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex justify-between">
                    <span className="truncate max-w-[120px]">{team.formName}</span>
                    <span>{team.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
