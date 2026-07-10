import { Link } from "react-router-dom";
import { Radio, ChevronRight } from "lucide-react";

export default function UpNextRail({ channel, related }) {
  if (!related || related.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-panel overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-smoke flex items-center gap-2">
          <Radio size={12} className="text-cyan" />
          More like this
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
      </div>

      {/* Channel list */}
      <ul className="divide-y divide-white/5">
        {related.slice(0, 6).map((c) => (
          <li key={c.id}>
            <Link
              to={`/watch/${encodeURIComponent(c.id)}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-panel2 transition-colors group"
            >
              {/* Thumbnail */}
              <span className="relative h-12 w-16 shrink-0 rounded overflow-hidden bg-gradient-to-br from-panel2 to-void flex items-center justify-center border border-white/5">
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="max-w-[90%] max-h-[90%] object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className={`absolute inset-0 flex items-center justify-center ${c.logo ? 'hidden' : ''}`}>
                  <Radio size={16} strokeWidth={1.2} className="text-smoke/50" />
                </span>
                {/* Live indicator */}
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-crimson animate-pulse shadow-lg shadow-crimson/50" />
              </span>

              {/* Info */}
              <span className="min-w-0 flex-1">
                <p className="font-medium text-sm text-paper truncate group-hover:text-cyan transition-colors">
                  {c.name}
                </p>
                <p className="font-mono text-[10px] text-smoke flex items-center gap-1.5 mt-0.5">
                  <span>{c.country?.flag}</span>
                  <span>{c.categories?.[0]?.name || 'Live TV'}</span>
                  {c.qualities?.length > 0 && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="text-cyan/60">{c.qualities[0]}</span>
                    </>
                  )}
                </p>
              </span>

              {/* Arrow */}
              <ChevronRight size={14} className="text-smoke/30 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      {related.length > 6 && (
        <Link
          to={`/browse?country=${channel.country?.code || 'BD'}`}
          className="block text-center py-3 border-t border-white/5 font-mono text-[10px] uppercase tracking-widest text-smoke hover:text-cyan hover:bg-panel2 transition-colors"
        >
          View all {related.length} channels →
        </Link>
      )}
    </div>
  );
}