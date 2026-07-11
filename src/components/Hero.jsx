import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import ChannelDial from "./ChannelDial";

export default function Hero() {
  return (
    <section id="top" className="relative pt-24 pb-16 md:pt-44 md:pb-28 px-4 md:px-10 overflow-hidden">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-14 items-center relative">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-smoke">
              300+ channels broadcasting now
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-800 uppercase leading-[0.92] text-[clamp(2.2rem,7vw,6rem)] text-balance"
          >
            Live TV,
            <br />
            <span className="text-crimson">on your terms.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg text-smoke max-w-md text-balance"
          >
            Sports, news, movies, and originals — streamed straight to any screen you own.
            No box to install, no technician, no contract to escape.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-crimson text-paper font-mono text-sm uppercase tracking-wide px-6 py-3.5 rounded-sm shadow-tally hover:bg-crimson/85 transition-colors"
            >
              <Play size={15} fill="currentColor" />
              Start watching free
            </Link>
            <Link
              to="/browse"
              className="font-mono text-sm uppercase tracking-wide text-smoke hover:text-paper transition-colors underline underline-offset-4 decoration-white/20"
            >
              Browse the live guide
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 font-mono text-[11px] uppercase tracking-widest text-smoke"
          >
            Free plan available · No credit card required
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center md:justify-end"
        >
          <ChannelDial />
        </motion.div>
      </div>
    </section>
  );
}
