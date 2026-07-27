"use client";

import { useState } from "react";
import { X, Calendar, MapPin, Trophy, ExternalLink } from "lucide-react";
import Link from "next/link";

interface EventBannerProps {
  event: {
    name: string;
    date: string;
    location: string;
    description: string;
    organizer: string;
    registerLink: string;
    notes?: string[];
  };
}

export function EventBanner({ event }: EventBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="mx-3 mt-4 rounded-lg overflow-hidden relative text-xs"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 100%)",
        border: "1px solid rgba(124,58,237,0.35)",
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss event banner"
        className="absolute top-2 right-2 text-violet-300 hover:text-white transition-colors rounded p-0.5 hover:bg-white/10"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="p-3 pr-6 space-y-2">
        {/* Badge + Title */}
        <div>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(124,58,237,0.3)", color: "#c4b5fd" }}
          >
            🎮 Upcoming Event
          </span>
          <p className="text-white font-bold mt-1 leading-tight">{event.name}</p>
        </div>

        {/* Meta */}
        <div className="space-y-1 text-violet-200 opacity-90">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-violet-400 shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-violet-400 shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3 w-3 text-violet-400 shrink-0" />
            <span>By {event.organizer}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-violet-200 opacity-75 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Register link */}
        <Link
          href={event.registerLink}
          className="inline-flex items-center gap-1 font-semibold transition-colors"
          style={{ color: "#67e8f9" }}
        >
          Register <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Bottom shimmer bar */}
      <div
        className="h-0.5"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)",
        }}
      />
    </div>
  );
}
