"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function CopyLinkButton({ url, title = "Copy and View Public Form" }: { url: string; title?: string }) {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="h-8 w-8" 
      title={title}
      onClick={() => {
        const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
        navigator.clipboard.writeText(fullUrl);
        window.open(fullUrl, '_blank');
        alert("Link copied to clipboard and opened in new tab!");
      }}
    >
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
}
