import { Suspense } from "react";
import { getOrgTeams } from "@/actions/teams";
import { TeamsManager } from "@/components/teams/teams-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function TeamsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  
  return (
    <Suspense fallback={<TeamsSkeleton />}>
      <TeamsList orgSlug={orgSlug} />
    </Suspense>
  );
}

function TeamsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function TeamsList({ orgSlug }: { orgSlug: string }) {
  const teams = await getOrgTeams(orgSlug);
  return <TeamsManager initialTeams={teams} orgSlug={orgSlug} />;
}
