"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Trophy, ArrowRight, LayoutTemplate, Briefcase, Megaphone, Rocket, Edit3, Image as ImageIcon, Link as LinkIcon, UploadCloud, EyeOff, Eye, Plus, Trash2, LayoutList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createAdPage } from "@/actions/adpages";

const TEMPLATES = [
  {
    id: "tournament",
    name: "Tournament",
    icon: Trophy,
    data: {
      badge: "Major Tournament 2026",
      title: "ESportHub Championship",
      subtitle: "Assemble your squad, master your strategy, and compete against the best for ultimate glory and a share of the $10,000 prize pool.",
      date: "Aug 15 - Aug 31",
      prize: "$10,000 Prize Pool",
      location: "Global Online",
      cta: "Register Your Team Now",
      bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      registrationLink: "/dashboard/soul/event-registration"
    }
  },
  {
    id: "launch",
    name: "Product Launch",
    icon: Rocket,
    data: {
      badge: "New Release",
      title: "Introducing X-Gear Pro",
      subtitle: "Experience the next level of gaming performance with our latest peripherals. Designed by pros, for pros.",
      date: "Available Now",
      prize: "Special Discount",
      location: "Store Online",
      cta: "Shop Now",
      bgImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
      registrationLink: "https://store.esporthub.com"
    }
  },
  {
    id: "recruitment",
    name: "Recruitment",
    icon: Briefcase,
    data: {
      badge: "Hiring Now",
      title: "Join Our Roster",
      subtitle: "We are looking for top-tier talent to join our Valorant and CS2 squads for the upcoming season.",
      date: "Applications Open",
      prize: "Salary + Benefits",
      location: "Remote / NA",
      cta: "Apply Today",
      bgImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
      registrationLink: "https://careers.esporthub.com"
    }
  },
  {
    id: "sponsorship",
    name: "Sponsorship",
    icon: Megaphone,
    data: {
      badge: "Partner With Us",
      title: "Season 2026 Sponsorships",
      subtitle: "Connect your brand with millions of passionate gamers. We offer premium placement and engagement opportunities.",
      date: "Season Starts Sept 1",
      prize: "Maximized ROI",
      location: "Global Reach",
      cta: "View Pitch Deck",
      bgImage: "https://images.unsplash.com/photo-1563810156942-834468f3dbbe?q=80&w=2070&auto=format&fit=crop",
      registrationLink: "/sponsorship-deck.pdf"
    }
  },
  {
    id: "svmam",
    name: "svmam page",
    icon: Megaphone,
    data: {
      badge: "BGIS SETTING 🍷",
      title: "svmam page",
      subtitle: "ADVANCE ROOM + 3X LOOT 🍷",
      date: "7-9 PM LOBBY 🍷",
      prize: "16 TEAMS ONLY 🍷",
      location: "IDP TIME :- 7:22/8:02/8:42 PM 🚨",
      cta: "Join Lobby Now",
      bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      registrationLink: "/dashboard/soul/event-registration"
    }
  },
  {
    id: "custom",
    name: "Custom",
    icon: Edit3,
    data: {
      badge: "Your Badge",
      title: "Your Custom Ad Title",
      subtitle: "Enter your custom description here. Make it catchy and engaging for your audience.",
      date: "Your Date",
      prize: "Your Highlight",
      location: "Your Location",
      cta: "Your Call to Action",
      bgImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
      registrationLink: "/dashboard/soul/event-registration"
    }
  }
];

export default function AdPageBuilder({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = use(params);
  const router = useRouter();
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].id);
  const [customData, setCustomData] = useState(TEMPLATES[0].data);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [visibility, setVisibility] = useState({
    showDate: true,
    showPrize: true,
    showLocation: true,
  });

  const handleTemplateSelect = (t: typeof TEMPLATES[0]) => {
    setActiveTemplate(t.id);
    setCustomData({
      ...t.data,
      registrationLink: `/dashboard/${orgSlug}/event-registration` // default link
    });
    if (t.id !== "custom") {
      setVisibility({ showDate: true, showPrize: true, showLocation: true });
      setCustomFields([]); // Clear custom fields
    }
  };

  const [customFields, setCustomFields] = useState<{ id: string; label: string; value: string }[]>([]);

  const handleAddCustomField = () => {
    setActiveTemplate("custom");
    setCustomFields(prev => [...prev, { id: `field-${Date.now()}`, label: "New Field", value: "Custom Value" }]);
  };

  const handleUpdateCustomField = (id: string, key: "label" | "value", newValue: string) => {
    setCustomFields(prev => prev.map(f => f.id === id ? { ...f, [key]: newValue } : f));
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const handleCustomChange = (field: keyof typeof customData, value: string) => {
    setActiveTemplate("custom");
    setCustomData(prev => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCustomChange("bgImage", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createAdPage({
        org_slug: orgSlug,
        template_id: activeTemplate,
        title: customData.title,
        badge: customData.badge,
        subtitle: customData.subtitle,
        date_info: customData.date,
        prize_info: customData.prize,
        location_info: customData.location,
        cta_text: customData.cta,
        bg_image: customData.bgImage,
        registration_link: customData.registrationLink,
        status: "draft",
        field_visibility: { ...visibility, extraFields: customFields },
      });
      alert("Saved successfully!");
      router.push(`/dashboard/${orgSlug}/adpage`);
    } catch (e) {
      alert("Failed to save. Make sure your database table is set up!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] gap-6 p-4 md:p-0">

      {/* LEFT PANEL - BUILDER/CONTROLS */}
      <div className="w-full lg:w-[400px] flex-shrink-0 bg-background/50 border border-border/50 rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <LayoutTemplate className="h-6 w-6 text-primary" />
          Create Ad Page
        </h2>

        {/* Templates Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">1. Select Template</h3>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <Button
                key={t.id}
                variant={activeTemplate === t.id ? "default" : "outline"}
                className={`justify-start h-12 ${activeTemplate === t.id ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted/30 border-border/40'}`}
                onClick={() => handleTemplateSelect(t)}
              >
                <t.icon className="mr-2 h-4 w-4" />
                <span className="text-xs">{t.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex justify-between items-center">
            2. Customize Content
            {activeTemplate !== "custom" && (
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Will switch to Custom</span>
            )}
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Badge Text</Label>
              <Input
                value={customData.badge}
                onChange={(e) => handleCustomChange("badge", e.target.value)}
                className="bg-black/20 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Main Title</Label>
              <Input
                value={customData.title}
                onChange={(e) => handleCustomChange("title", e.target.value)}
                className="bg-black/20 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subtitle / Description</Label>
              <Textarea
                value={customData.subtitle}
                onChange={(e) => handleCustomChange("subtitle", e.target.value)}
                className="bg-black/20 resize-none h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Date Info</Label>
                  {activeTemplate === "custom" && (
                    <button onClick={() => toggleVisibility('showDate')} className="text-muted-foreground hover:text-foreground">
                      {visibility.showDate ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
                {visibility.showDate && <Input value={customData.date} onChange={(e) => handleCustomChange("date", e.target.value)} className="bg-black/20 h-9" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Highlight/Prize</Label>
                  {activeTemplate === "custom" && (
                    <button onClick={() => toggleVisibility('showPrize')} className="text-muted-foreground hover:text-foreground">
                      {visibility.showPrize ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
                {visibility.showPrize && <Input value={customData.prize} onChange={(e) => handleCustomChange("prize", e.target.value)} className="bg-black/20 h-9" />}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Location</Label>
                  {activeTemplate === "custom" && (
                    <button onClick={() => toggleVisibility('showLocation')} className="text-muted-foreground hover:text-foreground">
                      {visibility.showLocation ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
                {visibility.showLocation && <Input value={customData.location} onChange={(e) => handleCustomChange("location", e.target.value)} className="bg-black/20 h-9" />}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CTA Button Text</Label>
                <Input value={customData.cta} onChange={(e) => handleCustomChange("cta", e.target.value)} className="bg-black/20 h-9" />
              </div>
            </div>

            {/* Extra Custom Fields Section */}
            {activeTemplate === "custom" && (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1.5 text-muted-foreground"><LayoutList className="h-3.5 w-3.5" /> Extra Fields</Label>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={handleAddCustomField}>
                    <Plus className="h-3 w-3 mr-1" /> Add Field
                  </Button>
                </div>
                {customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <Input
                      value={field.label}
                      onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                      placeholder="Label (e.g. Server IP)"
                      className="bg-black/20 h-9 text-xs"
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                      placeholder="Value"
                      className="bg-black/20 h-9 text-xs"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => handleRemoveCustomField(field.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5 pt-4 border-t border-border/50">
              <Label className="text-xs flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> Registration / Target Link</Label>
              <Input
                value={customData.registrationLink}
                onChange={(e) => handleCustomChange("registrationLink", e.target.value)}
                placeholder="https://example.com/register"
                className="bg-black/20 h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Background Image</Label>

              <div className="flex gap-2">
                <Input
                  value={customData.bgImage}
                  onChange={(e) => handleCustomChange("bgImage", e.target.value)}
                  className="bg-black/20 h-9 text-xs flex-1"
                  placeholder="Image URL"
                />
                <Button
                  variant="secondary"
                  className="h-9 px-3 shrink-0 bg-primary/20 text-primary hover:bg-primary/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border/50">
            <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Save Ad Page Design"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - LIVE PREVIEW */}
      <div className="flex-1 rounded-2xl overflow-hidden relative min-h-[600px] border border-border/30">

        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url('${customData.bgImage}')`,
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

          {/* Gradient overlay for aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Content Preview */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 h-full max-w-4xl mx-auto space-y-8 pointer-events-none">

          {customData.badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-sm font-medium text-violet-100 uppercase tracking-wider">{customData.badge}</span>
            </div>
          )}

          <div className="space-y-4 w-full">
            {customData.title && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-violet-100 to-cyan-200 drop-shadow-lg tracking-tight">
                {customData.title}
              </h1>
            )}
            {customData.subtitle && (
              <p className="text-lg md:text-xl text-violet-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
                {customData.subtitle}
              </p>
            )}
          </div>

          {/* Event Details Grid */}
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl mt-8">
            {visibility.showDate && (
              <div className="flex flex-col items-center p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm min-w-[200px]">
                <Calendar className="h-6 w-6 md:h-8 md:w-8 text-violet-400 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{customData.date}</h3>
              </div>
            )}

            {visibility.showPrize && (
              <div className="flex flex-col items-center p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm min-w-[200px]">
                <Trophy className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{customData.prize}</h3>
              </div>
            )}

            {visibility.showLocation && (
              <div className="flex flex-col items-center p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm min-w-[200px]">
                <MapPin className="h-6 w-6 md:h-8 md:w-8 text-violet-400 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{customData.location}</h3>
              </div>
            )}

            {/* Custom Extra Fields */}
            {activeTemplate === "custom" && customFields.map((field) => (
              <div key={field.id} className="flex flex-col items-center p-5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm min-w-[200px]">
                <LayoutList className="h-6 w-6 md:h-8 md:w-8 text-indigo-400 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{field.value}</h3>
                <span className="text-xs text-white/60 uppercase tracking-wider">{field.label}</span>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-8 w-full flex justify-center">
            <Button
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none",
              }}
            >
              {customData.cta}
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
