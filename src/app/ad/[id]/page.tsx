import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Trophy, ArrowRight, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PublicAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the ad page data
  const { data: ad, error } = await supabase
    .from("ad_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ad) {
    notFound();
  }

  // Increment views if we were tracking analytics, but for now we'll just render it
  
  // Destructure for easy access
  const {
    title,
    subtitle,
    badge,
    date_info,
    prize_info,
    location_info,
    cta_text,
    bg_image,
    registration_link,
    field_visibility,
  } = ad;

  // Defaults for missing visibility rules in older data
  const visibility = field_visibility || { showDate: true, showPrize: true, showLocation: true, extraFields: [] };
  const extraFields = visibility.extraFields || [];

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlays */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bg_image}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center space-y-12">
        
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-md animate-fade-in-down">
            <span className="flex h-2.5 w-2.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm font-semibold text-violet-100 uppercase tracking-widest">{badge}</span>
          </div>
        )}

        {/* Headings */}
        <div className="space-y-6 max-w-4xl">
          {title && (
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-violet-100 to-cyan-200 drop-shadow-xl tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-violet-100/90 font-medium max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Feature Grid */}
        <div className="flex flex-wrap justify-center gap-6 w-full pt-8">
          {visibility.showDate && date_info && (
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl min-w-[220px]">
              <Calendar className="h-8 w-8 text-violet-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{date_info}</h3>
            </div>
          )}
          
          {visibility.showPrize && prize_info && (
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl min-w-[220px]">
              <Trophy className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{prize_info}</h3>
            </div>
          )}

          {visibility.showLocation && location_info && (
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl min-w-[220px]">
              <MapPin className="h-8 w-8 text-violet-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{location_info}</h3>
            </div>
          )}

          {/* Extra Custom Fields */}
          {extraFields.map((field: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl min-w-[220px]">
              <LayoutList className="h-8 w-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{field.value}</h3>
              <span className="text-sm font-medium text-white/50 uppercase tracking-widest">{field.label}</span>
            </div>
          ))}
        </div>

        {/* Call To Action Button */}
        <div className="pt-12 w-full flex justify-center">
          <Link href={registration_link || "#"}>
            <Button 
              size="lg" 
              className="h-16 px-12 text-xl font-bold text-white shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_70px_rgba(6,182,212,0.6)]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none",
              }}
            >
              {cta_text || "Register Now"}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
