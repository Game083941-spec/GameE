import { getAnalyticsTeams } from "@/actions/analytics_teams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function AnalyticsTeamsPage({ params }: { params: { orgSlug: string } }) {
  const teams = await getAnalyticsTeams(params.orgSlug);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Permanent Teams Analytics</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submitted Teams</CardTitle>
          <CardDescription>
            This data is permanently stored and will persist even if the original form is deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Team / Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>IGN</TableHead>
                  <TableHead>Discord</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Raw Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No team data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  teams.map((team: any) => (
                    <TableRow key={team.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(team.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {team.team_name || "N/A"}
                      </TableCell>
                      <TableCell>{team.contact_email || "-"}</TableCell>
                      <TableCell>{team.contact_phone || "-"}</TableCell>
                      <TableCell>{team.in_game_name || "-"}</TableCell>
                      <TableCell>{team.discord_tag || "-"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${team.payment_status === "SUCCESS" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          {team.payment_status || "NOT_REQUIRED"}
                        </span>
                      </TableCell>
                      <TableCell>
                         <details className="text-xs cursor-pointer group">
                           <summary className="font-semibold text-primary">View JSON</summary>
                           <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto max-w-xs absolute z-10 border shadow-lg hidden group-open:block">
                             {JSON.stringify(team.raw_data, null, 2)}
                           </pre>
                         </details>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
