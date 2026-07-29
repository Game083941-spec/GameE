import { getAllUsers, isSuperAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Mail, Clock, Activity, CheckCircle2, Globe, Database } from "lucide-react";
import { CreateAdminModal } from "./create-admin-modal";
import { EditAdminModal } from "./edit-admin-modal";
import { DeleteAdminModal } from "./delete-admin-modal";

export default async function SuperAdminPage() {
  if (!(await isSuperAdmin())) {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Super Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage platform administrators and settings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">
              Go to Dashboard
            </Button>
          </Link>
          <CreateAdminModal />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Administrators ({users.length})
          </CardTitle>
          <CardDescription>
            All registered users on the platform. You are the only one who can add more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {user.email}
                  </TableCell>
                  <TableCell>{user.user_metadata?.full_name || "N/A"}</TableCell>
                  <TableCell>{user.user_metadata?.commission_rate || 5}%</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <EditAdminModal user={user} />
                      {user.email !== process.env.SUPER_ADMIN_EMAIL && (
                        <DeleteAdminModal user={user} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Public Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Landing Page (/)</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Live</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Login (/login)</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Live</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Signup (/signup)</span>
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">Disabled (Admin Only)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              App Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dashboard System</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Live</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Form Builder API</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Live</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Service (Resend)</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Live</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              Supabase Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Postgres Database</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Edge Functions</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium"><CheckCircle2 className="h-3 w-3" /> Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
