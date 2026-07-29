"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit2, Eye, EyeOff } from "lucide-react";
import { updateAdminUser } from "@/actions/admin";

export function EditAdminModal({ 
  user 
}: { 
  user: { id: string; email?: string; user_metadata?: { full_name?: string } } 
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    
    // Add user ID to form data
    formData.append("id", user.id);
    
    const result = await updateAdminUser(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
    
    setIsPending(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
          <Edit2 className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update details for {user.email}. Leave password blank to keep it unchanged.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={user.user_metadata?.full_name || ""}
                placeholder="Rahul Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">User Type</Label>
              <select 
                id="role"
                name="role"
                defaultValue={(user.user_metadata as any)?.role || "ADMIN"}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="SUPER_ADMIN" className="bg-background">Super Admin</option>
                <option value="ADMIN" className="bg-background">Admin</option>
                <option value="USER_ADMIN" className="bg-background">User Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Cut (%)</Label>
              <Input
                id="commission_rate"
                name="commission_rate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                defaultValue={(user.user_metadata as any)?.commission_rate || "5"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep unchanged"
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive font-medium bg-destructive/15 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
