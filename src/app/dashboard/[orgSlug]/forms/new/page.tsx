import { BuilderLayout } from "@/components/builder/builder-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUserOrganizations } from "@/actions/organizations";
import { redirect } from "next/navigation";

export default async function NewFormPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const orgs = await getUserOrganizations() as any[];
  const org = orgs.find((o: any) => o.slug === orgSlug);

  if (!org) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Builder Top Bar */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${orgSlug}/forms`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Create New Form</h2>
            <p className="text-sm text-muted-foreground">
              {org.name} Organization
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${orgSlug}/forms`} className={buttonVariants({ variant: "default" })}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Main Drag and Drop Interface */}
      <div className="flex-1 min-h-0">
        <BuilderLayout />
      </div>
    </div>
  );
}
