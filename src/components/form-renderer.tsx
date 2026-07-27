"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { submitForm } from "@/actions/submissions";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FormRendererProps {
  form: any;
  sections: any[];
  fields: any[];
  orgName: string;
}

export function FormRenderer({ form, sections, fields, orgName }: FormRendererProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Group fields by section
  const fieldsBySection = sections.map(section => ({
    ...section,
    fields: fields.filter(f => f.section_id === section.id).sort((a, b) => a.order_index - b.order_index)
  })).sort((a, b) => a.order_index - b.order_index);

  const handleInputChange = (fieldId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate required fields
    for (const field of fields) {
      if (field.required && !responses[field.id]) {
        setError(`Please fill out all required fields. (${field.label} is missing)`);
        setIsSubmitting(false);
        return;
      }
    }

    const result = await submitForm(form.id, responses);

    if (result.error) {
      setError(result.error);
    } else {
      setIsSuccess(true);
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-12 shadow-lg border-primary/20">
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Submission Received!</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Thank you for filling out <strong>{form.title}</strong>. Your response has been securely recorded by {orgName}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-t-4 border-t-primary">
      <CardHeader className="pb-8 border-b bg-muted/30">
        <CardTitle className="text-3xl font-bold tracking-tight">{form.title}</CardTitle>
        {form.description && (
          <CardDescription className="text-base mt-2">{form.description}</CardDescription>
        )}
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-8 space-y-12">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm font-medium p-4 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {fieldsBySection.map((section) => (
            <div key={section.id} className="space-y-6">
              {section.title && section.title !== "Untitled Section" && (
                <div className="border-b pb-2">
                  <h3 className="text-xl font-semibold tracking-tight">{section.title}</h3>
                  {section.description && <p className="text-muted-foreground text-sm">{section.description}</p>}
                </div>
              )}
              
              <div className="space-y-8">
                {section.fields.map((field: any) => (
                  <div key={field.id} className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    
                    {field.type === "TEXT" || field.type === "EMAIL" || field.type === "NUMBER" || field.type === "BGMI_UID" ? (
                      <Input
                        type={field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : "text"}
                        placeholder={field.placeholder || "Your answer"}
                        required={field.required}
                        value={responses[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-12 text-base transition-colors focus-visible:ring-primary"
                      />
                    ) : (
                       <Input
                        type="text"
                        placeholder="Fallback for unsupported field"
                        disabled
                        className="h-12 bg-muted/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        
        <CardFooter className="pt-8 pb-8 bg-muted/10 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Powered by <strong className="text-foreground">GameFormHub</strong>
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting} className="font-semibold px-8 shadow-md">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Form"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
