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
      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted h-8 w-8 text-muted-foreground outline-none">
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer p-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/dashboard/${orgSlug}/forms/${formId}/edit`);
            }}
            className="flex items-center w-full px-2 py-1.5 text-left"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Form
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive p-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            className="flex items-center w-full px-2 py-1.5"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Form
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
