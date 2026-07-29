"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Send, Loader2, CheckCircle2, Users } from "lucide-react";
import { broadcastToTeams } from "@/actions/email";

interface Team {
  id: string;
  teamName: string;
  contactEmail: string;
  formName: string;
  date?: string;
}

export function NotificationsForm({ initialTeams = [] }: { initialTeams?: Team[] }) {
  const validTeams = useMemo(() =>
    initialTeams.filter(t => t.contactEmail && t.contactEmail.includes("@")),
  [initialTeams]);

  const forms = useMemo(() => {
    const formMap = new Map<string, Team[]>();
    validTeams.forEach(t => {
      const arr = formMap.get(t.formName) || [];
      arr.push(t);
      formMap.set(t.formName, arr);
    });
    return Array.from(formMap.entries());
  }, [validTeams]);

  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [customEmails, setCustomEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{success?: boolean, count?: number, error?: string} | null>(null);

  const toggleTeam = (teamId: string) => {
    const next = new Set(selectedTeams);
    if (next.has(teamId)) next.delete(teamId);
    else next.add(teamId);
    setSelectedTeams(next);
  };

  const toggleForm = (formTeams: Team[]) => {
    const next = new Set(selectedTeams);
    const allSelected = formTeams.every(t => next.has(t.id));

    if (allSelected) {
      formTeams.forEach(t => next.delete(t.id));
    } else {
      formTeams.forEach(t => next.add(t.id));
    }
    setSelectedTeams(next);
  };

  const selectAll = () => {
    if (selectedTeams.size === validTeams.length) {
      setSelectedTeams(new Set());
    } else {
      setSelectedTeams(new Set(validTeams.map(t => t.id)));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    const teamEmails = validTeams
      .filter(t => selectedTeams.has(t.id))
      .map(t => t.contactEmail);

    const customEmailList = customEmails
      .split(",")
      .map(e => e.trim())
      .filter(e => e && e.includes("@"));

    const allEmails = [...teamEmails, ...customEmailList];
    const uniqueEmails = Array.from(new Set(allEmails));

    if (uniqueEmails.length === 0) {
      setResult({ error: "Please select at least one team or provide a valid custom email address." });
      setIsSending(false);
      return;
    }

    const res = await broadcastToTeams(uniqueEmails, subject, message);

    if (res.error) {
      setResult({ error: res.error });
    } else {
      setResult({ success: true, count: res.count });
      setCustomEmails("");
      setSubject("");
      setMessage("");
      setSelectedTeams(new Set());
      setTimeout(() => setResult(null), 5000);
    }

    setIsSending(false);
  };

  return (
    <Card className="max-w-3xl mx-auto border-t-4 border-t-primary shadow-md">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bell className="h-6 w-6 text-primary" />
          Send Notification
        </CardTitle>
        <CardDescription>
          Select registered teams or enter custom emails to broadcast a message.
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
          <form onSubmit={handleSend} className="space-y-8">
            {result?.error && (
              <div className="bg-destructive/15 text-destructive text-sm font-medium p-4 rounded-md border border-destructive/20">
                {result.error}
              </div>
            )}

            {/* Team Selection Section */}
            <div className="space-y-4 bg-muted/20 p-5 rounded-lg border">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Select Active Teams
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only teams with valid email addresses are shown.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  disabled={validTeams.length === 0}
                >
                  {selectedTeams.size === validTeams.length && validTeams.length > 0 ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {validTeams.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center italic">
                  No active teams with email addresses found.
                </div>
              ) : (
                <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {forms.map(([formName, formTeams]) => (
                    <div key={formName} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`form-${formName}`}
                          checked={formTeams.every(t => selectedTeams.has(t.id))}
                          onCheckedChange={() => toggleForm(formTeams)}
                        />
                        <label
                          htmlFor={`form-${formName}`}
                          className="text-sm font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                        >
                          {formName} ({formTeams.length})
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                        {formTeams.map(team => (
                          <div key={team.id} className="flex items-center space-x-2 bg-background border p-2 rounded-md hover:border-primary/50 transition-colors">
                            <Checkbox
                              id={`team-${team.id}`}
                              checked={selectedTeams.has(team.id)}
                              onCheckedChange={() => toggleTeam(team.id)}
                            />
                            <label
                              htmlFor={`team-${team.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex justify-between items-center truncate"
                              title={`${team.teamName} (${team.contactEmail})`}
                            >
                              <span className="truncate">
                                {team.teamName} <span className="text-muted-foreground font-normal text-xs ml-1">({team.contactEmail})</span>
                              </span>
                              {team.date && (
                                <span className="text-xs text-muted-foreground ml-2 shrink-0">{team.date}</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Emails Section */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Additional Custom Emails (Optional)</Label>
              <Textarea
                placeholder="email1@example.com, email2@example.com..."
                className="min-h-[80px]"
                value={customEmails}
                onChange={e => setCustomEmails(e.target.value)}
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

            <div className="pt-4 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">
                Total Recipients: <span className="text-foreground">{selectedTeams.size + (customEmails.trim() ? customEmails.split(',').filter(e=>e.includes('@')).length : 0)}</span>
              </p>
              <Button type="submit" size="lg" disabled={isSending} className="w-full sm:w-auto font-semibold px-8 shadow-sm">
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
