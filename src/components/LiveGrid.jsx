import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getChannels, getCategories, DEFAULT_COUNTRY } from "../utils/iptvData";
import ChannelCard from "./ChannelCard";

export default function LiveGrid() {
  const [active, setActive] = useState("All");
  const categories = getCategories(DEFAULT_COUNTRY);
  const allChannels = getChannels(DEFAULT_COUNTRY, active === "All" ? undefined : active);
  const filtered = allChannels.slice(0, 6);

  return (
    <section id="guide" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Live guide</p>
          <h2 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none text-balance">
            What's on right now
          </h2>
        </div>
        <p className="text-smoke max-w-sm text-sm">
          A preview of the guide. Tap a category to narrow it, or jump straight into the full lineup.
        </p>
      </div>

      <div id="categories" className="flex flex-wrap items-center gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.name)}
            className={`font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-sm border transition-colors ${
              active === c.name
                ? "bg-paper text-void border-paper"
                : "border-white/10 text-smoke hover:text-paper hover:border-white/30"
            }`}
          >
            {c.name}
          </button>
        ))}
        <Link
          to="/browse"
          className="ml-auto font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-sm border border-crimson/40 text-crimson hover:bg-crimson/10 transition-colors"
        >
          Full live guide →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((ch, i) => (
            <ChannelCard key={ch.id} channel={ch} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}