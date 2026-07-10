import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { getChannels, DEFAULT_COUNTRY } from "../utils/iptvData";

export default function TrendingTicker() {
  const trackRef = useRef(null);
  const channels = useMemo(() => getChannels(DEFAULT_COUNTRY), []);

  // Get top channels by number of streams (as a proxy for popularity)
  const trending = useMemo(() => {
    return channels
      .sort((a, b) => (b.allStreams?.length || 0) - (a.allStreams?.length || 0))
      .slice(0, 10)
      .map((c) => `${c.name} — ${c.country?.flag} ${c.categories?.[0]?.name || 'Live TV'}`);
  }, [channels]);

  useEffect(() => {
    if (!trackRef.current || trending.length === 0) return;
    const el = trackRef.current;
    const width = el.scrollWidth / 2;
    const tween = gsap.to(el, {
      x: -width,
      duration: 40,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, [trending.length]);

  if (trending.length === 0) return null;

  const items = [...trending, ...trending];

  return (
    <div className="border-y border-white/10 bg-panel overflow-hidden py-3">
      <div ref={trackRef} className="flex whitespace-nowrap w-max">
        {items.map((t, i) => (
          <span key={i} className="flex items-center font-mono text-xs uppercase tracking-wide text-smoke px-6">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson mr-3 shrink-0 animate-pulse" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}