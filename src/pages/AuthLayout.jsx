import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tv } from "lucide-react";

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-void relative flex items-center justify-center px-6 py-28">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-crimson">
          <Tv size={16} strokeWidth={2.5} className="text-paper" />
        </span>
        <span className="font-display font-800 text-xl tracking-tight uppercase">Streamoholic</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-lg border border-white/10 bg-panel shadow-panel p-8 md:p-10"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-2">{eyebrow}</p>
        <h1 className="font-display font-800 uppercase text-3xl leading-tight mb-2 text-balance">{title}</h1>
        {subtitle && <p className="text-smoke text-sm mb-8">{subtitle}</p>}

        {children}

        {footer && <div className="mt-7 pt-6 border-t border-white/10 text-center text-sm text-smoke">{footer}</div>}
      </motion.div>
    </div>
  );
}
