import { BuilderLayout } from "@/components/builder/builder-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getUserOrganizations } from "@/actions/organizations";
import { redirect } from "next/navigation";

export default async function NewFormPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const orgs = await getUserOrganizations();
  const currentOrg = orgs.find((o) => o.slug === orgSlug);

  if (!currentOrg) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Builder Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/${orgSlug}/forms`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Create New Form</h2>
            <p className="text-sm text-muted-foreground">
              {currentOrg.name} Organization
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* We will wire up a Client Component form saving button here later */}
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Drag and Drop Interface */}
      <div className="flex-1 min-h-0">
        <BuilderLayout />
      </div>
    </div>
  );
}
