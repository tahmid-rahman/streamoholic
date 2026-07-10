import { motion } from "framer-motion";
import { Tv2, Smartphone, Cast, Monitor, Gamepad2, AppWindow } from "lucide-react";
import { devices } from "../data/channels";

const icons = [Tv2, Smartphone, AppWindow, Cast, Monitor, Tv2, AppWindow, Gamepad2];

export default function Devices() {
  return (
    <section id="devices" className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Everywhere you already are</p>
          <h2 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none mb-6 text-balance">
            One account.
            <br />
            Every screen.
          </h2>
          <p className="text-smoke max-w-md text-balance">
            Sign in once and pick up exactly where you left off — same channel, same timestamp,
            whichever device is in front of you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {devices.map((d, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-panel py-7 px-3 text-center hover:border-white/25 transition-colors"
              >
                <Icon size={24} strokeWidth={1.4} className="text-cyan" />
                <span className="font-mono text-[11px] uppercase tracking-wide text-smoke">{d}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
