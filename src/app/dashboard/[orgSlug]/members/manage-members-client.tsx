"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Plus, Shield, ShieldAlert, Settings, X, Loader2 } from "lucide-react";
import { inviteMember, updateMemberPermissions } from "@/actions/organizations";

const SIDEBAR_OPTIONS = [
  { id: "forms", label: "Create Tournament" },
  { id: "adpage", label: "Ad Page" },
  { id: "members", label: "Members" },
  { id: "notifications", label: "Send IDP" },
  { id: "teams", label: "Current Events" },
  { id: "matches", label: "Matches & History" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
  { id: "event-registration", label: "Event Registration" },
];

export function ManageMembersClient({ 
  orgId, 
  members 
}: { 
  orgId: string;
  members: any[];
}) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER"); // Default role
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await inviteMember(orgId, email, role, permissions);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsInviteOpen(false);
      resetForm();
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await updateMemberPermissions(orgId, selectedMember.profiles.id, role, permissions);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsEditOpen(false);
      resetForm();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setRole("VIEWER");
    setPermissions([]);
    setError("");
    setSelectedMember(null);
  };

  const togglePermission = (id: string) => {
    setPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage who has access to this organization.
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-4">
        {members.length > 0 ? members.map((member: any, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || "U"}
              </div>
              <div>
                <h4 className="font-medium text-sm">{member.profiles?.full_name || "Unknown User"}</h4>
                <p className="text-xs text-muted-foreground">{member.profiles?.email || "No email"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                {member.role === "OWNER" && <ShieldAlert className="h-3 w-3" />}
                {member.role === "ADMIN" && <Shield className="h-3 w-3" />}
                {member.role}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setSelectedMember(member);
                  setRole(member.role);
                  setPermissions(member.sidebar_permissions || []);
                  setIsEditOpen(true);
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No members found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Invite your team members to collaborate.
            </p>
            <Button variant="outline" onClick={() => setIsInviteOpen(true)}>Invite Member</Button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Invite Member</h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsInviteOpen(false); resetForm(); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md bg-transparent"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-2 border rounded-md bg-transparent"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">User Admin (Moderator)</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
              
              {role === "MODERATOR" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Sidebar Permissions</label>
                  <p className="text-xs text-muted-foreground mb-3">Select which options this user admin can see in the sidebar.</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded-md">
                    {SIDEBAR_OPTIONS.map(opt => (
                      <label key={opt.id} className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          checked={permissions.includes(opt.id)}
                          onChange={() => togglePermission(opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Invite
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edit Member</h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsEditOpen(false); resetForm(); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  disabled
                  value={selectedMember.profiles.email}
                  className="w-full p-2 border rounded-md bg-muted text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-2 border rounded-md bg-transparent"
                >
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">User Admin (Moderator)</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
              
              {role === "MODERATOR" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Sidebar Permissions</label>
                  <p className="text-xs text-muted-foreground mb-3">Select which options this user admin can see in the sidebar.</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded-md">
                    {SIDEBAR_OPTIONS.map(opt => (
                      <label key={opt.id} className="flex items-center gap-2 text-sm">
                        <input 
                          type="checkbox" 
                          checked={permissions.includes(opt.id)}
                          onChange={() => togglePermission(opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
