import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { plans } from "../data/channels";

export default function Pricing() {
  return (
    <section id="plans" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-white/5">
      <div className="text-center max-w-xl mx-auto mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Plans</p>
        <h2 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none mb-4 text-balance">
          One bill, no surprises
        </h2>
        <p className="text-smoke text-balance">
          Every plan includes the full live guide. Higher tiers unlock more screens, sharper picture, and longer replay windows.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-lg border p-8 flex flex-col ${
              p.highlight
                ? "border-crimson bg-panel shadow-tally md:-translate-y-3"
                : "border-white/10 bg-panel"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-widest bg-crimson text-paper px-3 py-1 rounded-sm">
                Most popular
              </span>
            )}
            <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">{p.tagline}</p>
            <h3 className="font-display font-800 uppercase text-2xl mb-4">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display font-800 text-5xl">${p.price}</span>
              <span className="text-smoke font-mono text-sm">/mo</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-paper/90">
                  <Check size={16} className="text-cyan shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={`/signup?plan=${encodeURIComponent(p.name)}`}
              className={`text-center font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm transition-colors ${
                p.highlight
                  ? "bg-crimson text-paper hover:bg-crimson/85"
                  : "border border-white/15 text-paper hover:border-white/30"
              }`}
            >
              {p.price === 0 ? "Start for free" : `Choose ${p.name}`}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
