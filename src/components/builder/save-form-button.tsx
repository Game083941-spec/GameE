"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ArrowRight } from "lucide-react";
import { useFormBuilderStore } from "@/lib/store/form-builder";
import { saveForm } from "@/actions/forms";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SaveFormButton({ orgSlug, formId }: { orgSlug: string; formId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const sections = useFormBuilderStore((state) => state.sections);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const formDescription = useFormBuilderStore((state) => state.formDescription);
  const settings = useFormBuilderStore((state) => state.settings);
  
  const setFormTitle = useFormBuilderStore((state) => state.setFormTitle);
  const setFormDescription = useFormBuilderStore((state) => state.setFormDescription);
  const updateSettings = useFormBuilderStore((state) => state.updateSettings);

  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const result = await saveForm(orgSlug, formTitle, formDescription, sections, settings, formId);
      
      if (result?.error) {
        alert("Error saving form: " + result.error);
        setIsSaving(false);
        return;
      }

      // Success! Redirect back to the forms list
      router.push(`/dashboard/${orgSlug}/forms`);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Next <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish Form</DialogTitle>
          <DialogDescription>
            Review the final details and settings for your form before making it public.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Form Description</Label>
            <Textarea
              id="description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Max Submissions Limit (Optional)</Label>
            <Input
              id="limit"
              type="number"
              placeholder="e.g. 100"
              value={settings.limit || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : undefined;
                updateSettings({ limit: val });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Support Contact Email</Label>
            <Input
              id="contact"
              type="email"
              placeholder="e.g. contact@example.com"
              value={settings.contactEmail || ""}
              onChange={(e) => updateSettings({ contactEmail: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save & Publish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
