import { MapPin, Instagram, Facebook } from "lucide-react";

const SOCIAL = {
  instagram: "https://www.instagram.com/txprokicks/",
  facebook:  "https://www.facebook.com/Txprokicks/",
};

const ADDRESS = {
  line1: "1008 East Denman Avenue",
  line2: "Lufkin, Texas 75904",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1008+East+Denman+Avenue+Lufkin+TX+75904",
  embedSrc:
    "https://maps.google.com/maps?q=1008+East+Denman+Avenue,+Lufkin,+TX+75904&output=embed&z=15",
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      {/* Map strip */}
      <div className="w-full h-64 overflow-hidden relative">
        <iframe
          title="TXProKicks Location"
          src={ADDRESS.embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0 absolute"
          style={{
            filter: "grayscale(1) brightness(0.55) contrast(1.1)",
            top: "-20%",
            left: "-10%",
            width: "120%",
            height: "140%",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Custom red pin centered over the address point */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: "2%" }}>
          {/* Pulsing halo */}
          <span className="absolute w-12 h-12 rounded-full bg-primary/30 animate-ping" />
          {/* Pin body */}
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-[0_0_20px_6px_rgba(180,20,35,0.55)]">
            <MapPin className="w-5 h-5 text-white fill-white/20" strokeWidth={2} />
          </span>
        </div>

        {/* Address label */}
        <a
          href={ADDRESS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-white font-body text-xs font-semibold tracking-wider px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {ADDRESS.line1}, {ADDRESS.line2}
        </a>
      </div>

      {/* Footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Single row: brand left, find-us items spread right */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-0">

          {/* Brand block */}
          <div className="md:w-1/3 space-y-2">
            <p className="font-heading text-3xl text-white tracking-widest">
              TX<span className="text-primary">PRO</span>KICKS
            </p>
            <p className="font-body text-sm text-white/40 leading-relaxed">
              East Texas's premier destination for authentic, heat-checked sneakers.
            </p>
          </div>

          {/* Find Us — three items in a row */}
          <div className="md:flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-6">
            <a
              href={ADDRESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 font-body text-sm text-white/60 hover:text-primary transition-colors group"
            >
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{ADDRESS.line1}, {ADDRESS.line2}</span>
            </a>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-sm text-white/60 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @txprokicks
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-sm text-white/60 hover:text-primary transition-colors"
            >
              <Facebook className="w-4 h-4" />
              TXProKicks on Facebook
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="font-body text-xs text-white/25 text-center">
            © {new Date().getFullYear()} TXProKicks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
