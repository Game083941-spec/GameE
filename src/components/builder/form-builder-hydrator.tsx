"use client";

import { useEffect, useRef } from "react";
import { useFormBuilderStore } from "@/lib/store/form-builder";

export function FormBuilderHydrator({
  formTitle,
  formDescription,
  sections,
}: {
  formTitle: string;
  formDescription: string;
  sections: any[];
}) {
  const setFormTitle = useFormBuilderStore((state) => state.setFormTitle);
  const setFormDescription = useFormBuilderStore((state) => state.setFormDescription);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current) {
      setFormTitle(formTitle);
      setFormDescription(formDescription);
      
      // Zustand allows us to update the entire store state cleanly via setState if we wanted to, 
      // but modifying properties directly is safer if we don't have a specific hydration method.
      useFormBuilderStore.setState({ sections });
      
      hasHydrated.current = true;
    }
  }, [formTitle, formDescription, sections, setFormTitle, setFormDescription]);

  return null;
}
