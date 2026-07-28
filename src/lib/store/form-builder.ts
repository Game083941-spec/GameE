import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type FieldType = "TEXT" | "EMAIL" | "NUMBER" | "BGMI_UID" | "SELECT" | "RADIO" | "PAYMENT" | "IMAGE";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormBuilderState {
  formTitle: string;
  formDescription: string;
  settings: { limit?: number; contactEmail?: string };
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  updateSettings: (settings: { limit?: number; contactEmail?: string }) => void;
  sections: FormSection[];
  activeFieldId: string | null;
  addSection: () => void;
  updateSection: (sectionId: string, updates: Partial<FormSection>) => void;
  removeSection: (sectionId: string) => void;
  addField: (sectionId: string, type: FieldType) => void;
  updateField: (sectionId: string, fieldId: string, updates: Partial<FormField>) => void;
  removeField: (sectionId: string, fieldId: string) => void;
  moveField: (sectionId: string, oldIndex: number, newIndex: number) => void;
  setActiveField: (fieldId: string | null) => void;
  setActiveField: (fieldId: string | null) => void;
  loadTemplate: (title: string, description: string, sections: FormSection[], settings?: { limit?: number; contactEmail?: string }) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  formTitle: "Untitled Form",
  formDescription: "",
  settings: {},
  setFormTitle: (title) => set({ formTitle: title }),
  setFormDescription: (description) => set({ formDescription: description }),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  sections: [
    {
      id: uuidv4(),
      title: "Untitled Section",
      fields: [],
    },
  ],
  activeFieldId: null,

  addSection: () =>
    set((state) => ({
      sections: [
        ...state.sections,
        { id: uuidv4(), title: "New Section", fields: [] },
      ],
    })),

  updateSection: (sectionId, updates) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    })),

  removeSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== sectionId),
      // Clean up activeField if it was in this section
      activeFieldId: state.sections
        .find((s) => s.id === sectionId)
        ?.fields.find((f) => f.id === state.activeFieldId)
        ? null
        : state.activeFieldId,
    })),

  addField: (sectionId, type) =>
    set((state) => {
      const newField: FormField = {
        id: uuidv4(),
        type,
        label: `New ${type.toLowerCase()} field`,
        required: false,
        placeholder: "",
        ...(type === "SELECT" || type === "RADIO"
          ? { options: [{ label: "Option 1", value: "option-1" }] }
          : type === "PAYMENT"
          ? { options: [{ label: "Amount (INR)", value: "50" }] }
          : {}),
      };

      return {
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? { ...section, fields: [...section.fields, newField] }
            : section
        ),
        activeFieldId: newField.id,
      };
    }),

  updateField: (sectionId, fieldId, updates) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : section
      ),
    })),

  removeField: (sectionId, fieldId) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter((field) => field.id !== fieldId),
            }
          : section
      ),
      activeFieldId: state.activeFieldId === fieldId ? null : state.activeFieldId,
    })),

  moveField: (sectionId, oldIndex, newIndex) =>
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const newFields = Array.from(section.fields);
        const [movedField] = newFields.splice(oldIndex, 1);
        newFields.splice(newIndex, 0, movedField);
        return { ...section, fields: newFields };
      }),
    })),

  setActiveField: (fieldId) => set({ activeFieldId: fieldId }),
  
  loadTemplate: (title, description, sections, settings) =>
    set({
      formTitle: title,
      formDescription: description,
      settings: settings || {},
      sections,
      activeFieldId: null,
    }),
}));
