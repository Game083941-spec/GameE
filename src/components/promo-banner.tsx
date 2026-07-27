"use client";

import { useState } from "react";
import { X, Zap, ArrowRight, Trophy, User, Mail, Phone, Gamepad2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gamertag: "",
    game: "",
  });

  if (!isVisible) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => setIsSubmitted(false), 400); // reset after close animation
  };

  return (
    <>
      {/* ── Banner ── */}
      <div
        className="relative w-full rounded-xl overflow-hidden mb-6"
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        }}
      >
        {/* Decorative glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-12 -left-12 w-56 h-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "#7c3aed" }}
          />
          <div
            className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "#06b6d4" }}
          />
        </div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
          {/* Left — icon + text */}
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(124,58,237,0.25)",
                border: "1px solid rgba(124,58,237,0.5)",
              }}
            >
              <Trophy className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(124,58,237,0.3)",
                    color: "#c4b5fd",
                  }}
                >
                  🎮 Season 2026 — Open Now
                </span>
              </div>
              <p className="text-white font-bold text-base sm:text-lg leading-tight">
                ESportHub Championship — Register your team &amp; compete for{" "}
                <span style={{ color: "#67e8f9" }}>$10,000 in prizes!</span>
              </p>
              <p className="text-violet-200 text-xs mt-0.5 opacity-80">
                Limited spots available · Deadline: Aug 31, 2026 · Open to all
                verified organizations
              </p>
            </div>
          </div>

          {/* Right — CTA + dismiss */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              id="promo-banner-register-btn"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="font-semibold gap-1.5 text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none",
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              Register Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <button
              id="promo-banner-dismiss-btn"
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss banner"
              className="text-violet-300 hover:text-white transition-colors rounded-md p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom animated shimmer bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: "linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
      </div>

      {/* ── Registration Dialog ── */}
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[480px]"
          style={{
            background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 100%)",
            border: "1px solid rgba(124,58,237,0.35)",
            color: "#e2e8f0",
          }}
        >
          {isSubmitted ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.4)",
                }}
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  You&apos;re Registered! 🎉
                </h3>
                <p className="text-sm text-violet-200 max-w-xs">
                  Welcome to the ESportHub Championship! We&apos;ll send
                  confirmation details to{" "}
                  <strong className="text-cyan-300">{formData.email}</strong>.
                </p>
              </div>
              <Button
                onClick={handleClose}
                size="sm"
                className="mt-2"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  border: "none",
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <DialogHeader className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-5 w-5 text-violet-400" />
                  <span
                    className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(124,58,237,0.25)",
                      color: "#c4b5fd",
                    }}
                  >
                    Season 2026
                  </span>
                </div>
                <DialogTitle className="text-white text-xl">
                  Championship Registration
                </DialogTitle>
                <DialogDescription className="text-violet-300 text-sm">
                  Fill in your details to secure your spot. Limited slots
                  available!
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-fullName"
                    className="text-violet-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <User className="h-3.5 w-3.5" /> Full Name
                  </Label>
                  <Input
                    id="reg-fullName"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-email"
                    className="text-violet-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </Label>
                  <Input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-phone"
                    className="text-violet-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </Label>
                  <Input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                {/* Gamertag */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-gamertag"
                    className="text-violet-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Gamepad2 className="h-3.5 w-3.5" /> Gamertag / IGN
                  </Label>
                  <Input
                    id="reg-gamertag"
                    name="gamertag"
                    placeholder="xX_ProGamer_Xx"
                    required
                    value={formData.gamertag}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                {/* Game */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reg-game"
                    className="text-violet-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Trophy className="h-3.5 w-3.5" /> Game / Category
                  </Label>
                  <Input
                    id="reg-game"
                    name="game"
                    placeholder="e.g. Valorant, CS2, FIFA 25"
                    required
                    value={formData.game}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                <Button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bold text-white gap-2 mt-2"
                  style={{
                    background: isLoading
                      ? "rgba(124,58,237,0.4)"
                      : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    border: "none",
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Registering…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
      `}</style>
    </>
  );
}
