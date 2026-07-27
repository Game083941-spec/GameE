import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar user={user} organizations={[]} />
      <main className="flex-1 p-6 md:p-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and preferences.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.user_metadata?.full_name || "Rahul Sharma"} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" className="pl-9" defaultValue={user?.email} disabled />
                  </div>
                  <Button variant="outline">Change Email</Button>
                </div>
                <p className="text-xs text-muted-foreground">Your email address is used for login and notifications.</p>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
