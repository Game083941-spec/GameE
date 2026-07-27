"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useFormBuilderStore } from "@/lib/store/form-builder";
import { saveForm } from "@/actions/forms";
import { useRouter } from "next/navigation";

export function SaveFormButton({ orgSlug, formId }: { orgSlug: string; formId?: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const sections = useFormBuilderStore((state) => state.sections);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const formDescription = useFormBuilderStore((state) => state.formDescription);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const result = await saveForm(orgSlug, formTitle, formDescription, sections, formId);
      
      if (result?.error) {
        alert("Error saving form: " + result.error);
        setIsSaving(false);
        return;
      }

      // Success! Redirect back to the forms list
      router.push(`/dashboard/${orgSlug}/forms`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
      setIsSaving(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Save className="h-4 w-4 mr-2" />
      )}
      {isSaving ? "Saving..." : "Save & Publish Form"}
    </Button>
  );
}
