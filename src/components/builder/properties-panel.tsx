"use client";

import { useFormBuilderStore } from "@/lib/store/form-builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function PropertiesPanel() {
  const activeFieldId = useFormBuilderStore((state) => state.activeFieldId);
  const sections = useFormBuilderStore((state) => state.sections);
  const updateField = useFormBuilderStore((state) => state.updateField);
  const removeField = useFormBuilderStore((state) => state.removeField);

  // Find the active field across all sections
  let activeField = null;
  let activeSectionId = null;

  for (const section of sections) {
    const field = section.fields.find((f) => f.id === activeFieldId);
    if (field) {
      activeField = field;
      activeSectionId = section.id;
      break;
    }
  }

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
