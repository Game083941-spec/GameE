"use client";

import { useDroppable } from "@dnd-kit/core";
import { useFormBuilderStore } from "@/lib/store/form-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Section({ sectionId }: { sectionId: string }) {
  const section = useFormBuilderStore((state) =>
    state.sections.find((s) => s.id === sectionId)
  );
  const { setNodeRef, isOver } = useDroppable({
    id: sectionId,
    data: {
      isSection: true,
    },
  });

  const removeSection = useFormBuilderStore((state) => state.removeSection);
  const setActiveField = useFormBuilderStore((state) => state.setActiveField);
  const activeFieldId = useFormBuilderStore((state) => state.activeFieldId);
  const removeField = useFormBuilderStore((state) => state.removeField);

  if (!section) return null;

  return (
    <Card className="mb-6 relative group">
      <div className="absolute -left-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => removeSection(sectionId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">{section.title}</CardTitle>
      </CardHeader>
      <CardContent
        ref={setNodeRef}
        className={`min-h-[150px] p-4 transition-colors ${
          isOver ? "bg-muted/50" : ""
        }`}
      >
        {section.fields.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed rounded-lg py-8">
            Drag and drop fields here
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {section.fields.map((field) => (
              <div
                key={field.id}
                onClick={() => setActiveField(field.id)}
                className={`p-3 border rounded-md cursor-pointer transition-colors relative ${
                  activeFieldId === field.id
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary/50"
                }`}
              >
                {activeFieldId === field.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(section.id, field.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                <div className="font-medium text-sm mb-1">
                  {field.type === "IMAGE" ? (
                    field.options?.[0]?.value ? (
                      <div className="mt-2 mb-2 rounded-md overflow-hidden border border-border/50">
                        <img src={field.options[0].value} alt="Banner" className="w-full h-32 object-cover" />
                      </div>
                    ) : (
                      <div className="mt-2 mb-2 bg-muted/50 w-full h-32 flex items-center justify-center rounded-md border border-dashed text-muted-foreground text-xs">
                        Select to upload banner image
                      </div>
                    )
                  ) : (
                    <>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Type: {field.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BuilderCanvas() {
  const sections = useFormBuilderStore((state) => state.sections);
  const addSection = useFormBuilderStore((state) => state.addSection);

  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const setFormTitle = useFormBuilderStore((state) => state.setFormTitle);
  const formDescription = useFormBuilderStore((state) => state.formDescription);
  const setFormDescription = useFormBuilderStore((state) => state.setFormDescription);

  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 p-6 bg-background rounded-xl border shadow-sm">
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-3xl font-bold tracking-tight mb-4 border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            placeholder="Form Title"
          />
          <Textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="text-muted-foreground border-none shadow-none px-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            placeholder="Add a description for your form..."
            rows={2}
          />
        </div>

        {sections.map((section) => (
          <Section key={section.id} sectionId={section.id} />
        ))}

        <Button
          variant="outline"
          className="w-full mt-4 border-dashed py-8"
          onClick={addSection}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Section
        </Button>
      </div>
    </div>
  );
}
