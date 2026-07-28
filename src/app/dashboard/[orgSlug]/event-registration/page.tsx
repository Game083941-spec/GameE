"use client";

import { useState } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Gamepad2,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EVENT = {
  name: "ESportHub Championship 2026",
  tagline: "Compete. Dominate. Claim Glory.",
  date: "July 30 – August 15, 2026",
  deadline: "August 31, 2026",
  location: "Online — Global",
  prize: "$10,000",
  slots: 128,
  organizer: "EsportHub Team",
  games: ["Valorant", "CS2", "FIFA 25", "Rocket League", "PUBG"],
  perks: [
    "Cash prizes for top 3 teams",
    "Live-streamed finals",
    "Exclusive ESportHub champion badge",
    "Featured spotlight on dashboard",
    "Custom trophy for winners",
  ],
  schedule: [
    { phase: "Registration Open", date: "July 27, 2026" },
    { phase: "Group Stage", date: "Aug 1 – Aug 10, 2026" },
    { phase: "Semi-Finals", date: "Aug 12, 2026" },
    { phase: "Grand Finals", date: "Aug 15, 2026" },
  ],
};

export default function EventRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gamertag: "",
    game: "",
    teamName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-full pb-16"
      style={{ background: "transparent" }}
    >
      <div
        className="rounded-xl overflow-hidden mb-8 relative"
        style={{
          background: "linear-gradient(135deg,#0f0c29 0%,#302b63 55%,#24243e 100%)",
        }}
      >
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#7c3aed" }} />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#06b6d4" }} />

        <div className="relative px-8 py-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(124,58,237,0.3)", color: "#c4b5fd" }}
          >
            🎮 Season 2026 · Open Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
            {EVENT.name}
          </h1>
          <p className="text-violet-200 text-lg mb-6">{EVENT.tagline}</p>

          <div className="flex flex-wrap gap-6 text-sm text-violet-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-400" />
              {EVENT.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-400" />
              {EVENT.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-400" />
              {EVENT.slots} Team Slots
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-cyan-300">{EVENT.prize} Prize Pool</span>
            </div>
          </div>
        </div>
        <div
          className="h-0.5"
          style={{ background: "linear-gradient(90deg,#7c3aed,#06b6d4,#7c3aed)" }}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-violet-500/20" style={{ background: "rgba(124,58,237,0.05)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-violet-400" />
                What You Win
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EVENT.perks.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  {p}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-violet-500/20" style={{ background: "rgba(124,58,237,0.05)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-400" />
                Tournament Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {EVENT.schedule.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: i === 0 ? "#10b981" : i === EVENT.schedule.length - 1 ? "#f59e0b" : "#7c3aed" }}
                    />
                    <span className="font-medium">{s.phase}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{s.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-violet-500/20" style={{ background: "rgba(124,58,237,0.05)" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-violet-400" />
                Supported Games
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {EVENT.games.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  {g}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card
            className="border-violet-500/20"
            style={{
              background: "linear-gradient(135deg,rgba(15,12,41,0.6) 0%,rgba(30,27,75,0.6) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-400" />
                Register for the Event
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Deadline: <strong className="text-amber-400">{EVENT.deadline}</strong> · Limited spots — register early!
              </p>
            </CardHeader>

            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div
                    className="h-20 w-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)" }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">You&apos;re In! 🎉</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Thanks <strong className="text-white">{form.fullName}</strong>! Your registration for the{" "}
                      <strong className="text-violet-300">ESportHub Championship 2026</strong> is confirmed.
                      Check <strong className="text-cyan-300">{form.email}</strong> for your confirmation.
                    </p>
                  </div>
                  <Button
                    onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", gamertag: "", game: "", teamName: "" }); }}
                    variant="outline"
                    size="sm"
                    className="mt-2 border-violet-500/40 text-violet-300 hover:text-white hover:bg-violet-500/20"
                  >
                    Register Another Player
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="er-fullName" className="text-sm flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-violet-400" /> Full Name
                      </Label>
                      <Input id="er-fullName" name="fullName" placeholder="John Doe" required value={form.fullName} onChange={handleChange} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="er-email" className="text-sm flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-violet-400" /> Email
                      </Label>
                      <Input id="er-email" name="email" type="email" placeholder="you@example.com" required value={form.email} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="er-phone" className="text-sm flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-violet-400" /> Phone
                      </Label>
                      <Input id="er-phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="er-gamertag" className="text-sm flex items-center gap-1.5">
                        <Gamepad2 className="h-3.5 w-3.5 text-violet-400" /> Gamertag / IGN
                      </Label>
                      <Input id="er-gamertag" name="gamertag" placeholder="xX_ProGamer_Xx" required value={form.gamertag} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="er-teamName" className="text-sm flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-violet-400" /> Team Name
                      </Label>
                      <Input id="er-teamName" name="teamName" placeholder="Team Alpha" value={form.teamName} onChange={handleChange} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="er-game" className="text-sm flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-violet-400" /> Game
                      </Label>
                      <select
                        id="er-game"
                        name="game"
                        required
                        value={form.game}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select a game…</option>
                        {EVENT.games.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    id="er-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold text-white gap-2 h-11"
                    style={{
                      background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#06b6d4)",
                      border: "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Complete Registration
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
