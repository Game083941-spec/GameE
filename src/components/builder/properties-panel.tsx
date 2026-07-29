"use client";

import { useFormBuilderStore } from "@/lib/store/form-builder";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Loader2 } from "lucide-react";
import { useState } from "react";

export function PropertiesPanel() {
  const activeFieldData = useFormBuilderStore(
    useShallow((state) => {
      if (!state.activeFieldId) return null;
      for (const section of state.sections) {
        const field = section.fields.find((f) => f.id === state.activeFieldId);
        if (field) {
          return { activeField: field, activeSectionId: section.id };
        }
      }
      return null;
    })
  );

  const updateField = useFormBuilderStore((state) => state.updateField);
  const removeField = useFormBuilderStore((state) => state.removeField);
  const [isUploading, setIsUploading] = useState(false);

  const activeField = activeFieldData?.activeField;
  const activeSectionId = activeFieldData?.activeSectionId;

  const updateSettings = useFormBuilderStore((state) => state.updateSettings);
  const settings = useFormBuilderStore((state) => state.settings);
  const setActiveField = useFormBuilderStore((state) => state.setActiveField);

  if (!activeField || !activeSectionId) {
    return (
      <div className="w-80 border-l bg-muted/10 p-6 flex items-center justify-center text-center text-muted-foreground text-sm">
        Select a field on the canvas to edit its properties
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-muted/10 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Field Properties
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => removeField(activeSectionId!, activeField.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="prop-label">Field Label</Label>
          <Input
            id="prop-label"
            value={activeField.label}
            onChange={(e) =>
              updateField(activeSectionId!, activeField.id, {
                label: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prop-placeholder">Placeholder</Label>
          <Input
            id="prop-placeholder"
            value={activeField.placeholder || ""}
            placeholder="Enter placeholder text..."
            onChange={(e) =>
              updateField(activeSectionId!, activeField.id, {
                placeholder: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="prop-required">Required Field</Label>
            <p className="text-xs text-muted-foreground">
              Prevent form submission if empty
            </p>
          </div>
          <Switch
            id="prop-required"
            checked={activeField.required}
            onCheckedChange={(checked) =>
              updateField(activeSectionId!, activeField.id, { required: checked })
            }
          />
        </div>

        {activeField.type === "PAYMENT" && (
          <div className="space-y-2 pt-4 border-t border-dashed">
            <Label htmlFor="prop-amount">Entry Fee Amount (INR)</Label>
            <Input
              id="prop-amount"
              type="number"
              min="1"
              value={activeField.options?.[0]?.value || ""}
              onChange={(e) =>
                updateField(activeSectionId!, activeField.id, {
                  options: [{ label: "Amount (INR)", value: e.target.value }],
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              This amount will be charged via Razorpay.
            </p>
          </div>
        )}

        {activeField.type === "IMAGE" && (
          <div className="space-y-2 pt-4 border-t border-dashed">
            <Label>Upload Banner Image</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setIsUploading(true);
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (!res.ok) throw new Error("Upload failed");

                    const data = await res.json();

                    updateField(activeSectionId!, activeField.id, {
                      options: [{ label: "url", value: data.url }],
                    });
                  } catch (error) {
                    console.error("Upload error", error);
                    alert("Failed to upload image. Please check your Cloudflare credentials.");
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />
            </div>
            {isUploading && (
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading to Cloudflare R2...
              </p>
            )}
            {activeField.options?.[0]?.value && !isUploading && (
              <p className="text-xs text-green-600 mt-1">Image uploaded successfully!</p>
            )}
          </div>
        )}

        {/* Future expansion: specific properties for SELECT, RADIO, BGMI_UID etc. */}
        <div className="pt-4 border-t border-dashed">
          <p className="text-xs text-muted-foreground">
            Type: <span className="font-mono bg-muted px-1 py-0.5 rounded">{activeField.type}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            ID: <span className="font-mono text-[10px] break-all">{activeField.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
