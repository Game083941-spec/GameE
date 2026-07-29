"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2 } from "lucide-react";

export function CopyLinkButton({ url, title = "Copy and View Public Form" }: { url: string; title?: string }) {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8" 
        title={title}
        onClick={() => {
          const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
          navigator.clipboard.writeText(fullUrl);
          window.open(fullUrl, '_blank');
          
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }}
      >
        <ExternalLink className="h-3 w-3" />
      </Button>

      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4" />
          <p className="text-sm font-medium">Link copied to clipboard and opened!</p>
        </div>
      )}
    </>
  );
}
