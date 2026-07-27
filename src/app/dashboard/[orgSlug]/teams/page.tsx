import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";

export default async function TeamsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;

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
            Active Teams
          </CardTitle>
          <CardDescription>
            Teams currently registered for upcoming matches and tournaments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <Trophy className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No teams found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
              You haven't added any teams yet. Create a team or import them from your form submissions.
            </p>
            <Button variant="outline">Create First Team</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
