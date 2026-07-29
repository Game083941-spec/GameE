"use client";

import { useEffect, useRef } from "react";
import { useFormBuilderStore } from "@/lib/store/form-builder";

export function FormBuilderHydrator({
  formTitle,
  formDescription,
  sections,
  settings,
}: {
  formTitle: string;
  formDescription: string;
  sections: any[];
  settings: any;
}) {
  const setFormTitle = useFormBuilderStore((state) => state.setFormTitle);
  const setFormDescription = useFormBuilderStore((state) => state.setFormDescription);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current) {
      setFormTitle(formTitle);
      setFormDescription(formDescription);

      useFormBuilderStore.setState({ sections, settings: settings || {} });

      hasHydrated.current = true;
    }
  }, [formTitle, formDescription, sections, settings, setFormTitle, setFormDescription]);

  return null;
}
