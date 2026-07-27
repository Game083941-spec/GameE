import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, FormInput, Users } from "lucide-react";
import { PromoBanner } from "@/components/promo-banner";
import Link from "next/link";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back to the dashboard for <strong className="text-foreground">{orgSlug}</strong>. Here is what is happening today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
            <FormInput className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for submissions
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active users in your org
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Matches</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tournaments in progress
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 min-h-[300px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest form submissions and match results.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-muted-foreground text-sm h-full pb-14">
            No activity to show yet.
          </CardContent>
        </Card>
        <Card className="col-span-3 min-h-[300px]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
             <Link href={`/dashboard/${orgSlug}/forms/new`} className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer group block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
               <h4 className="text-sm font-medium group-hover:text-primary transition-colors">Create a new form</h4>
               <p className="text-xs text-muted-foreground mt-1">Start building a form using our drag-and-drop builder.</p>
             </Link>
             <Link href={`/dashboard/${orgSlug}/members`} className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer group block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
               <h4 className="text-sm font-medium group-hover:text-primary transition-colors">Invite team members</h4>
               <p className="text-xs text-muted-foreground mt-1">Add moderators or admins to help manage your organization.</p>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
