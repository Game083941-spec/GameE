"use client";

import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "@/lib/store/form-builder";
import { GripVertical, Type, Mail, Hash, Gamepad2, List, CircleDot, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "TEXT", label: "Short Text", icon: <Type className="w-4 h-4" /> },
  { type: "EMAIL", label: "Email Address", icon: <Mail className="w-4 h-4" /> },
  { type: "NUMBER", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { type: "BGMI_UID", label: "BGMI UID", icon: <Gamepad2 className="w-4 h-4" /> },
  { type: "SELECT", label: "Dropdown", icon: <List className="w-4 h-4" /> },
  { type: "RADIO", label: "Single Choice", icon: <CircleDot className="w-4 h-4" /> },
  { type: "PAYMENT", label: "Entry Fee (Razorpay)", icon: <IndianRupee className="w-4 h-4" /> },
];

function DraggableField({ type, label, icon }: { type: FieldType; label: string; icon: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type,
      isSidebarItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 bg-card border rounded-md cursor-grab active:cursor-grabbing hover:border-primary transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function BuilderSidebar() {
  return (
    <div className="w-64 border-r bg-muted/20 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Form Elements</h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {FIELD_TYPES.map((field) => (
            <DraggableField key={field.type} {...field} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
