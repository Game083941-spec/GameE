"use client";

import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "@/lib/store/form-builder";
import { GripVertical, Type, Mail, Hash, Gamepad2, List, CircleDot, IndianRupee, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormBuilderStore } from "@/lib/store/form-builder";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "TEXT", label: "Short Text", icon: <Type className="w-4 h-4" /> },
  { type: "EMAIL", label: "Email Address", icon: <Mail className="w-4 h-4" /> },
  { type: "NUMBER", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { type: "BGMI_UID", label: "BGMI UID", icon: <Gamepad2 className="w-4 h-4" /> },
  { type: "SELECT", label: "Dropdown", icon: <List className="w-4 h-4" /> },
  { type: "RADIO", label: "Single Choice", icon: <CircleDot className="w-4 h-4" /> },
  { type: "PAYMENT", label: "Entry Fee (Razorpay)", icon: <IndianRupee className="w-4 h-4" /> },
  { type: "IMAGE", label: "Banner Image", icon: <ImageIcon className="w-4 h-4" /> },
];

function DraggableField({ type, label, icon, onClick }: { type: FieldType; label: string; icon: React.ReactNode; onClick: () => void }) {
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
      onClick={onClick}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function BuilderSidebar() {
  const [activeTab, setActiveTab] = useState<"elements" | "templates">("elements");
  const sections = useFormBuilderStore((state) => state.sections);
  const addField = useFormBuilderStore((state) => state.addField);
  const loadTemplate = useFormBuilderStore((state) => state.loadTemplate);

  const handleFieldClick = (type: FieldType) => {
    if (sections.length > 0) {
      addField(sections[0].id, type);
    }
  };

  const templates = [
    {
      id: "tournament",
      name: "Tournament Registration",
      description: "Standard layout for BGMI tournaments",
      getTemplate: () => {
        const sectionId = uuidv4();
        return {
          title: "Tournament Registration",
          description: "Register your squad for the upcoming tournament.",
          sections: [
            {
              id: sectionId,
              title: "Team Details",
              fields: [
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Team Name", required: true },
                { id: uuidv4(), type: "EMAIL" as FieldType, label: "Captain Email", required: true },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Captain WhatsApp Number", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Player 1 UID (Captain)", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Player 2 UID", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Player 3 UID", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Player 4 UID", required: true },
                { id: uuidv4(), type: "PAYMENT" as FieldType, label: "Entry Fee (INR)", required: true, options: [{ label: "Amount", value: "100" }] }
              ]
            }
          ]
        };
      }
    },
    {
      id: "scrims",
      name: "Daily Scrims Application",
      description: "Quick application for daily practice matches",
      getTemplate: () => {
        const sectionId = uuidv4();
        return {
          title: "Daily Scrims Application",
          description: "Apply for our daily T3/T2 scrims.",
          sections: [
            {
              id: sectionId,
              title: "Application Details",
              fields: [
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Team Name", required: true },
                { id: uuidv4(), type: "SELECT" as FieldType, label: "Tier", required: true, options: [{ label: "T3", value: "t3" }, { label: "T2", value: "t2" }, { label: "T1", value: "t1" }] },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Captain Discord/WhatsApp", required: true }
              ]
            }
          ]
        };
      }
    }
  ];

  return (
    <div className="hidden md:flex w-64 border-r bg-muted/20 flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Add to Form</h3>
        <div className="flex bg-muted p-1 rounded-md">
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all ${activeTab === 'elements' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('elements')}
          >
            Elements
          </button>
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all ${activeTab === 'templates' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {activeTab === 'elements' ? (
          <div className="flex flex-col gap-3">
            {FIELD_TYPES.map((field) => (
              <DraggableField key={field.type} {...field} onClick={() => handleFieldClick(field.type)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="border rounded-md p-3 bg-card hover:border-primary transition-colors cursor-pointer group" onClick={() => {
                if(confirm("Load template? This will replace your current form design.")) {
                  const data = tpl.getTemplate();
                  loadTemplate(data.title, data.description, data.sections);
                }
              }}>
                <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">{tpl.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{tpl.description}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
