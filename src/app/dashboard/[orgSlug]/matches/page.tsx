import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, History } from "lucide-react";

export default async function MatchesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches & History</h1>
          <p className="text-muted-foreground mt-1">
            View history of all past games played by teams in your organization.
          </p>
        </div>
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Past Games Record
          </CardTitle>
          <CardDescription>
            A complete log of all completed matches and their results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
            <Gamepad2 className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No match history</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Once you start hosting matches and tournaments, the results and past games will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
