"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bell, Send, Loader2, CheckCircle2 } from "lucide-react";
import { broadcastToTeams } from "@/actions/email";

export function NotificationsForm() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{success?: boolean, count?: number, error?: string} | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    // Parse comma separated emails
    const emailList = emails
      .split(",")
      .map(e => e.trim())
      .filter(e => e && e.includes("@"));

    if (emailList.length === 0) {
      setResult({ error: "Please provide at least one valid email address." });
      setIsSending(false);
      return;
    }

    const uniqueEmails = Array.from(new Set(emailList));

    // Reusing the broadcast function since it perfectly sends custom emails
    const res = await broadcastToTeams(uniqueEmails, subject, message);
    
    if (res.error) {
      setResult({ error: res.error });
    } else {
      setResult({ success: true, count: res.count });
      setEmails("");
      setSubject("");
      setMessage("");
      setTimeout(() => setResult(null), 5000);
    }
    
    setIsSending(false);
  };

  return (
    <Card className="max-w-2xl border-t-4 border-t-primary shadow-md">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bell className="h-6 w-6 text-primary" />
          Send Notification
        </CardTitle>
        <CardDescription>
          Send a custom email notification to any list of recipients.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {result?.success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
            <h3 className="text-2xl font-bold">Notification Sent!</h3>
            <p className="text-muted-foreground text-lg">
              Successfully delivered to {result.count} recipient(s).
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setResult(null)}>
              Send Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-5">
            {result?.error && (
              <div className="bg-destructive/15 text-destructive text-sm font-medium p-4 rounded-md border border-destructive/20">
                {result.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Recipients (Emails) <span className="text-destructive">*</span></Label>
              <Textarea 
                required 
                placeholder="email1@example.com, email2@example.com..." 
                className="min-h-[80px]"
                value={emails}
                onChange={e => setEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple emails with commas.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Subject Line <span className="text-destructive">*</span></Label>
              <Input 
                required 
                placeholder="Notification Subject" 
                className="h-12 text-base"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Message Body <span className="text-destructive">*</span></Label>
              <Textarea 
                required 
                placeholder="Type your message here..." 
                className="min-h-[200px] text-base"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button type="submit" size="lg" disabled={isSending} className="w-full sm:w-auto font-semibold px-8">
                {isSending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="mr-2 h-5 w-5" /> Send Notification</>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
