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
import { Loader2, Trash2 } from "lucide-react";
import { deleteAdminUser } from "@/actions/admin";

export function DeleteAdminModal({
  user
}: {
  user: { id: string; email?: string }
}) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setIsPending(true);
    setError(null);

    const result = await deleteAdminUser(user.id);

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
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Administrator</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {user.email}? This action cannot be undone and they will lose all access.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {error && (
            <div className="text-sm text-destructive font-medium bg-destructive/15 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <p className="text-sm font-medium text-destructive">
            Warning: Deleting this user will permanently remove their account from the platform.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
