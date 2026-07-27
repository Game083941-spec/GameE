import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Key, Copy } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { createClient } from "@/lib/supabase/server";

export default async function ApiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar user={user} organizations={[]} />
      <main className="flex-1 p-6 md:p-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer API</h1>
            <p className="text-muted-foreground mt-2">
              Access your API keys and developer documentation.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" />
                API Credentials
              </CardTitle>
              <CardDescription>Your secret API keys for programmatic access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Production API Key</h4>
                <div className="flex gap-2">
                  <Input type="password" value="sk_prod_*****************************" readOnly className="font-mono" />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-amber-600/80">
                  Keep this key secret. Never expose it in client-side code.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button>Generate New Key</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-500" />
                Quick Start
              </CardTitle>
              <CardDescription>Make your first API request.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-900 text-zinc-300 p-4 rounded-md text-sm font-mono overflow-x-auto">
                <pre>
                  <span className="text-pink-400">curl</span> -X GET &quot;https://api.gameformhub.com/v1/forms&quot; \{"\n"}
                  {"  "}-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \{"\n"}
                  {"  "}-H &quot;Content-Type: application/json&quot;
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
