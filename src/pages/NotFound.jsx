import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RadioTower } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="bg-void min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise pointer-events-none" />
        <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center max-w-md"
        >
          <RadioTower size={40} strokeWidth={1.2} className="text-crimson mx-auto mb-6" />
          <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Error 404</p>
          <h1 className="font-display font-800 uppercase text-4xl md:text-5xl leading-none mb-4 text-balance">
            Signal lost
          </h1>
          <p className="text-smoke text-sm mb-9">
            This channel isn't broadcasting. It may have moved or never existed on this frequency.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-crimson text-paper font-mono text-sm uppercase tracking-wide px-6 py-3.5 rounded-sm shadow-tally hover:bg-crimson/85 transition-colors"
          >
            Back to Streamoholic
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
