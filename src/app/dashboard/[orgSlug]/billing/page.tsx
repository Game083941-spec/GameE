import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Zap } from "lucide-react";

export default async function BillingPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;

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
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Manage how you pay for your subscription.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center border">
                <span className="font-bold text-xs">VISA</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Visa ending in 4242</h4>
                <p className="text-xs text-muted-foreground">Expires 12/2028</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">Default</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Payment Method</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
import { Plus } from "lucide-react";
