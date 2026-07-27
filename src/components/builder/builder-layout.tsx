"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { useFormBuilderStore, FieldType } from "@/lib/store/form-builder";
import { BuilderCanvas } from "./canvas";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const BuilderSidebar = dynamic(() => import("./sidebar").then(mod => mod.BuilderSidebar), {
  loading: () => <Skeleton className="w-64 h-full rounded-none" />
});

const PropertiesPanel = dynamic(() => import("./properties-panel").then(mod => mod.PropertiesPanel), {
  loading: () => <Skeleton className="w-80 h-full rounded-none" />
});

export function BuilderLayout() {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);
  
  const addField = useFormBuilderStore((state) => state.addField);
  const sections = useFormBuilderStore((state) => state.sections);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    // If dragging from sidebar, the active.data will contain the field type
    if (active.data.current?.isSidebarItem) {
      setActiveDragType(active.data.current.type as FieldType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveDragType(null);

    if (!over) return;

    // Handle dropping a sidebar item into a section
    if (active.data.current?.isSidebarItem && over.data.current?.isSection) {
      const sectionId = over.id as string;
      const type = active.data.current.type as FieldType;
      addField(sectionId, type);
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch due to uuidv4() in zustand store
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full border rounded-xl overflow-hidden bg-background shadow-sm">
        <BuilderSidebar />
        <BuilderCanvas />
        <PropertiesPanel />
      </div>

      <DragOverlay>
        {activeDragType ? (
          <div className="bg-primary text-primary-foreground p-3 rounded-md shadow-lg opacity-80 font-medium">
            {activeDragType} Field
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
