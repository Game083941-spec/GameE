"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteForm } from "@/actions/forms";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FormCardActions({ orgSlug, formId }: { orgSlug: string; formId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone and will delete all submissions.")) {
      return;
    }
    
    setIsDeleting(true);
    const result = await deleteForm(orgSlug, formId);
    
    if (result?.error) {
      alert("Error deleting form: " + result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${orgSlug}/forms/${formId}/edit`} className="cursor-pointer flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Form
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="cursor-pointer text-destructive focus:text-destructive flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Form
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
