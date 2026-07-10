import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { getChannelById } from "../utils/iptvData";
import { useLibrary } from "../context/LibraryContext";

export default function ContinueWatchingRow() {
  const { library, clearWatch } = useLibrary();
  const items = library.continueWatching
    .map((w) => getChannelById(w.channelId))
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-28 md:pt-16">
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">Continue watching</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {items.map((c) => (
          <div key={c.id} className="relative shrink-0 w-56 group">
            <Link
              to={`/watch/${encodeURIComponent(c.id)}`}
              className="block rounded-lg border border-white/10 bg-panel overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="relative aspect-video bg-gradient-to-br from-panel2 to-void flex items-center justify-center overflow-hidden">
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="max-w-[60%] max-h-[60%] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-scanlines opacity-20" />
                    <Radio size={22} strokeWidth={1.2} className="text-cyan opacity-60" />
                  </>
                )}
                {/* Live indicator */}
                <span className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-crimson text-paper">
                  <span className="h-1 w-1 rounded-full bg-paper animate-pulse" />
                  LIVE
                </span>
                {/* Progress bar placeholder */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
                  <div className="h-full bg-cyan/60" style={{ width: "30%" }} />
                </div>
              </div>
              <div className="p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-smoke mb-0.5 truncate">
                  {c.country?.flag} {c.name}
                </p>
                <p className="text-sm text-paper/90 truncate">
                  {c.categories?.[0]?.name || 'Live TV'}
                </p>
              </div>
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); clearWatch(c.id); }}
              aria-label="Remove from continue watching"
              className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-void/70 text-smoke opacity-0 group-hover:opacity-100 hover:text-paper transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}