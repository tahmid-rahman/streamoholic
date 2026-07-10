import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, Radio, Play } from "lucide-react";
import { channels } from "../data/channels";

// Signature piece: a mechanical cable-box channel dial. Flipping channels
// triggers a GSAP digit-roll + panel-swap, with a pulsing on-air tally light.
export default function ChannelDial() {
  const [index, setIndex] = useState(0);
  const digitRef = useRef(null);
  const panelRef = useRef(null);
  const tallyRef = useRef(null);
  const current = channels[index];

  const change = (dir) => {
    const next = (index + dir + channels.length) % channels.length;

    gsap.timeline()
      .to(digitRef.current, { yPercent: dir > 0 ? -100 : 100, duration: 0.22, ease: "power2.in" })
      .call(() => setIndex(next))
      .set(digitRef.current, { yPercent: dir > 0 ? 100 : -100 })
      .to(digitRef.current, { yPercent: 0, duration: 0.28, ease: "power3.out" });

    gsap.fromTo(
      panelRef.current,
      { opacity: 0.3, filter: "brightness(1.8) blur(2px)" },
      { opacity: 1, filter: "brightness(1) blur(0px)", duration: 0.35, ease: "power2.out" }
    );
  };

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(tallyRef.current, { boxShadow: "0 0 4px 1px rgba(228,40,58,0.35)", duration: 0.9, ease: "sine.inOut" })
      .to(tallyRef.current, { boxShadow: "0 0 16px 4px rgba(228,40,58,0.85)", duration: 0.9, ease: "sine.inOut" });
    return () => tl.kill();
  }, []);

  const accentMap = { crimson: "text-crimson", cyan: "text-cyan", amber: "text-amber" };

  return (
    <div className="relative w-full max-w-md rounded-lg border border-white/10 bg-panel shadow-panel overflow-hidden">
      {/* on-air strip */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-panel2">
        <div className="flex items-center gap-2">
          <span ref={tallyRef} className="h-2.5 w-2.5 rounded-full bg-crimson" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-crimson">On Air</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-smoke">CH-{current.num}</span>
      </div>

      {/* preview panel */}
      <div ref={panelRef} className="relative aspect-video bg-gradient-to-br from-panel2 to-void flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-0 bg-scanlines opacity-40" />
        <Radio size={36} strokeWidth={1.2} className={`${accentMap[current.accent]} opacity-70`} />
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-void via-void/70 to-transparent">
          <p className="font-mono text-[10px] uppercase tracking-widest text-smoke mb-1">{current.category}</p>
          <p className="font-display font-700 text-xl leading-tight text-paper text-balance">{current.show}</p>
        </div>
      </div>

      {/* dial control */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => change(-1)}
          className="h-9 w-9 flex items-center justify-center rounded-sm border border-white/10 text-smoke hover:text-paper hover:border-white/30 transition-colors"
          aria-label="Previous channel"
        >
          <ChevronUp size={18} />
        </button>

        <div className="flex flex-col items-center overflow-hidden h-12 justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-smoke">{current.name}</span>
          <div className="h-8 overflow-hidden relative w-24">
            <span ref={digitRef} className="font-display font-800 text-4xl block text-center text-paper">
              {current.num}
            </span>
          </div>
        </div>

        <button
          onClick={() => change(1)}
          className="h-9 w-9 flex items-center justify-center rounded-sm border border-white/10 text-smoke hover:text-paper hover:border-white/30 transition-colors"
          aria-label="Next channel"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      <Link
        to={`/watch/${current.slug}`}
        className="flex items-center justify-center gap-2 border-t border-white/10 bg-panel2 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:text-cyan transition-colors"
      >
        <Play size={13} fill="currentColor" /> Watch CH-{current.num} live
      </Link>
    </div>
  );
}
