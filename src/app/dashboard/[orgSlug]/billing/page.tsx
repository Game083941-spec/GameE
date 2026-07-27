import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import { Plus } from "lucide-react";
import { getOrganizationPayments } from "@/actions/payment";
import { VirtualTransactionTable } from "@/components/virtual-transaction-table";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All successful payments collected from your forms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TransactionSkeleton />}>
            <TransactionList orgSlug={orgSlug} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between border-b pb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

async function TransactionList({ orgSlug }: { orgSlug: string }) {
  const transactions = await getOrganizationPayments(orgSlug);

  return (
    <>
      <VirtualTransactionTable transactions={transactions as any} />
    </>
  );
}
