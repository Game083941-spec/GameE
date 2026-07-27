import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getFormSubmissions } from "@/actions/submissions";

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; formId: string }>;
}) {
  const { orgSlug, formId } = await params;
  const supabase = await createClient();

  // 1. Verify org and form exist and belong to each other
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*, organization:organizations(slug)")
    .eq("id", formId)
    .single();

  if (formError || !form || form.organization.slug !== orgSlug) {
    notFound();
  }

  // 2. Fetch submissions
  const submissions = await getFormSubmissions(formId);

  // 3. Fetch fields so we know the column headers
  const { data: sections } = await supabase
    .from("sections")
    .select("id")
    .eq("form_id", formId);
    
  let fields: any[] = [];
  if (sections && sections.length > 0) {
    const { data: fieldsData } = await supabase
      .from("fields")
      .select("id, label, type")
      .in("section_id", sections.map((s: any) => s.id))
      .order("order_index");
    if (fieldsData) fields = fieldsData;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/${orgSlug}/forms`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold tracking-tight line-clamp-1">{form.title}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Viewing submissions for this form.
          </p>
        </div>
        <Link href={`/f/${form.id}`} target="_blank">
          <Button variant="secondary">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public Form
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responses ({submissions?.length || 0})</CardTitle>
          <CardDescription>All data collected from the public form.</CardDescription>
        </CardHeader>
        <CardContent>
          {!submissions || submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No submissions yet. Share your form link to start collecting data!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-medium">Submitted At</th>
                    {fields.map(field => (
                      <th key={field.id} className="px-6 py-3 font-medium truncate max-w-[200px]">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {new Date(sub.created_at).toLocaleString()}
                      </td>
                      {fields.map(field => (
                        <td key={field.id} className="px-6 py-4 truncate max-w-[300px]">
                          {sub.responses[field.id] !== undefined ? String(sub.responses[field.id]) : <span className="text-muted-foreground/50">-</span>}
                        </td>
                      ))}
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
