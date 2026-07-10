import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import { plans } from "../data/channels";

const compareRows = [
  { label: "Live channels", values: ["20", "60+", "180+", "300+"] },
  { label: "Simultaneous screens", values: ["1", "1", "3", "6"] },
  { label: "Max streaming quality", values: ["480p", "720p", "4K", "4K + HDR"] },
  { label: "Replay window", values: ["—", "24 hours", "7 days", "30 days"] },
  { label: "Offline downloads", values: [false, false, true, true] },
  { label: "Multiview mode", values: [false, false, false, true] },
  { label: "Ad-supported", values: [true, false, false, false] },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="pt-28 md:pt-36 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Plans</p>
            <h1 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none mb-4 text-balance">
              One bill, no surprises
            </h1>
            <p className="text-smoke text-balance">
              Every plan includes the full live guide. Higher tiers unlock more screens, sharper picture, and longer replay windows.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-14">
            <span className={`font-mono text-xs uppercase tracking-wide ${!annual ? "text-paper" : "text-smoke"}`}>Monthly</span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((a) => !a)}
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${annual ? "bg-crimson" : "bg-panel2 border border-white/15"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${annual ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className={`font-mono text-xs uppercase tracking-wide ${annual ? "text-paper" : "text-smoke"}`}>
              Annual <span className="text-cyan">— 2 months free</span>
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {plans.map((p, i) => {
              const price = annual ? Math.round(p.price * 10) : p.price;
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative rounded-lg border p-8 flex flex-col ${
                    p.highlight ? "border-crimson bg-panel shadow-tally md:-translate-y-3" : "border-white/10 bg-panel"
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-widest bg-crimson text-paper px-3 py-1 rounded-sm">
                      Most popular
                    </span>
                  )}
                  <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">{p.tagline}</p>
                  <h3 className="font-display font-800 uppercase text-2xl mb-4">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display font-800 text-5xl">${price}</span>
                    <span className="text-smoke font-mono text-sm">/{annual ? "yr" : "mo"}</span>
                  </div>
                  <p className="text-smoke text-xs font-mono mb-6">{price === 0 ? "Free forever" : annual ? "Billed yearly" : "Billed monthly"}</p>
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
                      p.highlight ? "bg-crimson text-paper hover:bg-crimson/85" : "border border-white/15 text-paper hover:border-white/30"
                    }`}
                  >
                    {p.price === 0 ? "Start for free" : `Choose ${p.name}`}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mb-24 overflow-x-auto">
            <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-6 text-center">Compare plans</p>
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-4 font-mono text-[11px] uppercase tracking-widest text-smoke font-normal">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className="text-center py-4 px-4 font-display font-700 uppercase text-sm">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-white/5">
                    <td className="py-4 pr-4 text-sm text-paper/85">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="text-center py-4 px-4">
                        {typeof v === "boolean" ? (
                          v ? <Check size={16} className="text-cyan inline" /> : <Minus size={16} className="text-smoke/50 inline" />
                        ) : (
                          <span className="text-sm font-mono text-paper/85">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
