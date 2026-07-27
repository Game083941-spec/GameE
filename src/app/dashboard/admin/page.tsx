import { getAllUsers, isSuperAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Mail, Clock } from "lucide-react";
import { CreateAdminModal } from "./create-admin-modal";

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
        <CreateAdminModal />
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
                <TableHead>Joined At</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
