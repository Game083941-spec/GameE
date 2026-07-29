"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trophy, Plus, Users, Mail, Send, Loader2, CheckCircle2, UserPlus, FileUp } from "lucide-react";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addManualTeam, bulkAddManualTeams } from "@/actions/teams";
import { broadcastToTeams } from "@/actions/email";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  teamName: string;
  contact: string;
  contactEmail: string;
  formName: string;
  date: string;
  source: string;
}

export function TeamsManager({ initialTeams, orgSlug }: { initialTeams: Team[], orgSlug: string }) {
  const router = useRouter();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmail, setNewTeamEmail] = useState("");
  const [newTeamPhone, setNewTeamPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{success?: boolean, count?: number, error?: string} | null>(null);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddError("");

    const res = await addManualTeam(orgSlug, newTeamName, newTeamEmail, newTeamPhone);
    setIsAdding(false);

    if (res.error) {
      setAddError(res.error);
    } else {
      setIsAddOpen(false);
      setNewTeamName("");
      setNewTeamEmail("");
      setNewTeamPhone("");
      router.refresh();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Parse as JSON array of arrays to handle different header names
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (rows.length < 2) {
        alert("The Excel file is empty or missing headers.");
        setIsUploading(false);
        return;
      }

      // Assume first row is header. Try to find indexes for name, email, phone.
      const headers = (rows[0] || []).map(h => String(h).toLowerCase().trim());
      const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("team"));
      const emailIdx = headers.findIndex(h => h.includes("email") || h.includes("mail"));
      const phoneIdx = headers.findIndex(h => h.includes("phone") || h.includes("number"));

      if (nameIdx === -1) {
        alert("Could not find a 'Name' or 'Team' column in the Excel file.");
        setIsUploading(false);
        return;
      }

      const parsedTeams = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;
        
        const name = row[nameIdx] ? String(row[nameIdx]) : "";
        if (!name) continue; // Skip empty names

        const email = emailIdx !== -1 && row[emailIdx] ? String(row[emailIdx]) : "";
        const phone = phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]) : "";

        parsedTeams.push({ name, email, phone });
      }

      if (parsedTeams.length === 0) {
        alert("No valid teams found in the Excel file.");
        setIsUploading(false);
        return;
      }

      const res = await bulkAddManualTeams(orgSlug, parsedTeams);
      if (res.error) {
        alert("Error bulk adding teams: " + res.error);
      } else {
        alert(`Successfully added ${res.count} teams!`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Error parsing the Excel file.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setBroadcastResult(null);

    const validEmails = initialTeams
      .map(t => t.contactEmail)
      .filter(email => email && email.includes("@"));

    const uniqueEmails = Array.from(new Set(validEmails));

    if (uniqueEmails.length === 0) {
      setBroadcastResult({ error: "No valid email addresses found among teams." });
      setIsBroadcasting(false);
      return;
    }

    const res = await broadcastToTeams(uniqueEmails, broadcastSubject, broadcastMessage);

    if (res.error) {
      setBroadcastResult({ error: res.error });
    } else {
      setBroadcastResult({ success: true, count: res.count });
      setTimeout(() => {
        setIsBroadcastOpen(false);
        setBroadcastSubject("");
        setBroadcastMessage("");
        setBroadcastResult(null);
      }, 3000);
    }
    setIsBroadcasting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered teams and communicate with them.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setIsBroadcastOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Broadcast Msg
          </Button>
          
          <div className="relative w-full sm:w-auto">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleFileUpload}
              disabled={isUploading}
              title="Upload Excel/CSV"
            />
            <Button variant="secondary" className="w-full sm:w-auto" disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
              {isUploading ? "Uploading..." : "Bulk Upload"}
            </Button>
          </div>

          <Button className="w-full sm:w-auto" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>
      </div>

      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-primary" />
            Active Teams <span className="text-muted-foreground text-lg font-normal">({initialTeams.length})</span>
          </CardTitle>
          <CardDescription>
            Teams that have successfully registered or were manually added.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {initialTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed bg-muted/10">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold">No teams found</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                You haven't received any successful team registrations yet, and no manual teams exist.
              </p>
              <Button onClick={() => setIsAddOpen(true)} className="px-8">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Team
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialTeams.map((team, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                        {team.teamName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={team.teamName}>{team.teamName}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 px-2 py-0.5 rounded-full bg-muted mt-1 inline-block">
                          {team.source === 'MANUAL' ? 'Manual' : 'Registered'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary/60" />
                      <span className="truncate">{team.contact}</span>
                    </div>
                    {team.contactEmail && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary/60" />
                        <span className="truncate">{team.contactEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t text-xs text-muted-foreground flex items-center justify-between">
                    <div className="truncate max-w-[140px] font-medium text-foreground/70 bg-muted px-2 py-1 rounded-md">
                      {team.formName}
                    </div>
                    <span className="font-mono text-muted-foreground/70">{team.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD TEAM MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Manual Team</DialogTitle>
            <DialogDescription>
              Create a new team entry bypassing forms and payments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTeam} className="space-y-4 pt-4">
            {addError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {addError}
              </div>
            )}
            <div className="space-y-2">
              <Label>Team Name <span className="text-destructive">*</span></Label>
              <Input
                required
                placeholder="e.g. Team Soul"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                placeholder="leader@example.com"
                value={newTeamEmail}
                onChange={e => setNewTeamEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input
                type="tel"
                placeholder="+91 9999999999"
                value={newTeamPhone}
                onChange={e => setNewTeamPhone(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* BROADCAST MODAL */}
      <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Broadcast Message
            </DialogTitle>
            <DialogDescription>
              Send an email to all active teams that have provided an email address.
            </DialogDescription>
          </DialogHeader>

          {broadcastResult?.success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h3 className="text-xl font-bold">Broadcast Sent!</h3>
              <p className="text-muted-foreground">
                Successfully delivered to {broadcastResult.count} teams.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="space-y-4 pt-4">
              {broadcastResult?.error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {broadcastResult.error}
                </div>
              )}

              <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground mb-4">
                You are about to email <strong>{new Set(initialTeams.map(t => t.contactEmail).filter(e => e && e.includes("@"))).size}</strong> unique team contacts.
              </div>

              <div className="space-y-2">
                <Label>Subject Line <span className="text-destructive">*</span></Label>
                <Input
                  required
                  placeholder="e.g. Schedule Update for Tonight's Scrims"
                  value={broadcastSubject}
                  onChange={e => setBroadcastSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Message Body <span className="text-destructive">*</span></Label>
                <Textarea
                  required
                  placeholder="Type your message here..."
                  className="min-h-[150px] resize-none"
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsBroadcastOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isBroadcasting}>
                  {isBroadcasting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> Send Broadcast</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
