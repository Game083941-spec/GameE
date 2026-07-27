import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import { Plus } from "lucide-react";
import { getOrganizationPayments } from "@/actions/payment";

export default async function BillingPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const transactions = await getOrganizationPayments(orgSlug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization's subscription and view usage limits.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
            Current Plan
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription>Everything you need for serious gaming tournaments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited Forms</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced Analytics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Custom Domain</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Priority Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Manage Subscription</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Usage Limits
            </CardTitle>
            <CardDescription>Your current usage for this billing cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Form Responses</span>
                <span className="text-muted-foreground">1,245 / 5,000</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "25%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Storage Used</span>
                <span className="text-muted-foreground">245 MB / 10 GB</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "5%" }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Team Members</span>
                <span className="text-muted-foreground">4 / Unlimited</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "100%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All successful payments collected from your forms.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No transactions found yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Transaction ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Form</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{tx.razorpay_payment_id || tx.id.substring(0, 8)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {tx.submission?.form?.title || "Unknown Form"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-500">
                        + ₹{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
