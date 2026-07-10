import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { faqs } from "../data/channels";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-white/5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3 text-center">FAQ</p>
      <h2 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none mb-12 text-center text-balance">
        Questions, answered
      </h2>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display font-700 text-lg md:text-xl text-balance">{f.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 text-crimson"
                >
                  <Plus size={20} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-smoke text-sm leading-relaxed max-w-xl">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
