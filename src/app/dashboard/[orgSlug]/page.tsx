import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, FormInput, Users } from "lucide-react";
import { PromoBanner } from "@/components/promo-banner";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getOrganizationPayments } from "@/actions/payment";
import { Clock } from "lucide-react";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orgData } = await supabase.from("organizations").select("id").eq("slug", orgSlug).single();

  let formsCount = 0;
  let membersCount = 1;

  if (orgData) {
    const [{ count: fCount }, { count: mCount }] = await Promise.all([
      supabase.from("forms").select("*", { count: "exact", head: true }).eq("organization_id", orgData.id),
      supabase.from("organization_members").select("*", { count: "exact", head: true }).eq("organization_id", orgData.id)
    ]);
    formsCount = fCount || 0;
    membersCount = mCount || 1;
  }

  const payments = await getOrganizationPayments(orgSlug);
  const realTotalRevenue = payments.reduce((acc: number, p: any) => acc + p.amount, 0);

  const commissionRate = user?.user_metadata?.commission_rate || 5;
  const commissionMultiplier = commissionRate / 100;
  
  const finalRevenue = realTotalRevenue * commissionMultiplier;
  const formattedRevenue = finalRevenue.toFixed(2);

  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Revenue Dashboard</h2>
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
            <div className="text-2xl font-bold">₹{formattedRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total earnings generated
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
            <FormInput className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formsCount}</div>
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
            <div className="text-2xl font-bold">{membersCount}</div>
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
          <CardContent className="flex flex-col text-sm h-full pb-14 space-y-4">
            {recentPayments.length === 0 ? (
              <div className="flex items-center justify-center text-muted-foreground h-32">
                No activity to show yet.
              </div>
            ) : (
              recentPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">Form Submission Paid</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                      {payment.submission?.form?.title || "Unknown Form"} • {payment.razorpay_payment_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₹{(payment.amount * commissionMultiplier).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
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
