import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Globe, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const supabase = await createClient();

  const { data: orgData } = await supabase
    .from("organizations")
    .select("name, slug")
    .eq("slug", orgSlug)
    .single();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization&apos;s identity and global preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            General Information
          </CardTitle>
          <CardDescription>Update your organization&apos;s name and URL slug.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" defaultValue={orgData?.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orgSlug">URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm bg-muted px-3 py-2 rounded-md border border-input">
                gameformhub.com/
              </span>
              <Input id="orgSlug" defaultValue={orgData?.slug} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Warning: Changing your URL slug will break any existing links to your forms.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Custom Domain
          </CardTitle>
          <CardDescription>Host your forms on your own domain name.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-dashed rounded-lg text-center space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">No custom domain configured</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Connect your own domain to white-label your forms and provide a seamless experience for your users.
              </p>
            </div>
            <Button variant="outline">Connect Domain</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <h4 className="font-medium">Delete Organization</h4>
              <p className="text-sm text-muted-foreground">
                Permanently remove this organization and all its data.
              </p>
            </div>
            <Button variant="destructive">Delete Organization</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
