import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Settings, ExternalLink, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormCardActions } from "@/components/forms/form-card-actions";
import { getOrgForms } from "@/actions/forms";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FormsListPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Forms</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your organization's forms and view submissions.
          </p>
        </div>
        <Link href={`/dashboard/${orgSlug}/forms/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      <Suspense fallback={<FormsSkeleton />}>
        <FormsGrid orgSlug={orgSlug} />
      </Suspense>
    </div>
  );
}

function FormsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="flex flex-col h-[200px]">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="mt-auto pb-4">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="flex items-center gap-2 pt-4 border-t">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function FormsGrid({ orgSlug }: { orgSlug: string }) {
  const forms = await getOrgForms(orgSlug);

  return (
    <>
      {!forms || forms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="mb-2">No forms created yet</CardTitle>
          <CardDescription className="mb-6 max-w-sm">
            Create your first form using our drag-and-drop builder to start collecting responses.
          </CardDescription>
          <Link href={`/dashboard/${orgSlug}/forms/new`}>
            <Button>Get Started</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-all group flex flex-col relative">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 pr-8">
                    <CardTitle className="text-lg line-clamp-1">{form.title}</CardTitle>
                    {form.description && (
                      <CardDescription className="line-clamp-2 text-xs">
                        {form.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <FormCardActions orgSlug={orgSlug} formId={form.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                   <div className="flex items-center gap-1">
                     <span className={`h-2 w-2 rounded-full ${form.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                     {form.is_published ? "Published" : "Draft"}
                   </div>
                   <div>
                     {new Date(form.created_at).toLocaleDateString()}
                   </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Link href={`/dashboard/${orgSlug}/forms/${form.id}`} className="flex-1">
                     <Button variant="secondary" className="w-full text-xs h-8">
                       <Users className="mr-2 h-3 w-3" />
                       Submissions
                     </Button>
                  </Link>
                  <Link href={`/f/${form.id}`} target="_blank">
                     <Button variant="outline" size="icon" className="h-8 w-8" title="View Public Form">
                       <ExternalLink className="h-3 w-3" />
                     </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
