import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, PlayCircle, Captions, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const qualities = ["Auto", "480p", "720p", "1080p", "4K HDR"];

function Toggle({ checked, onChange, label, icon: Icon }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-4 border-b border-white/5 last:border-0 gap-4">
      <span className="flex items-center gap-2.5 text-sm min-w-0">
        {Icon && <Icon size={15} className="text-smoke shrink-0" />} <span className="truncate">{label}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${checked ? "bg-crimson" : "bg-panel2 border border-white/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

export default function Settings() {
  const { user, ready } = useAuth();
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [defaultQuality, setDefaultQuality] = useState("Auto");
  const [parentalLock, setParentalLock] = useState(false);
  const [pin, setPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!ready) return null;
  if (!user) return <Navigate to="/signin" replace state={{ from: "/settings" }} />;

  const savePlayback = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const savePin = (e) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2200);
  };

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-3">Settings</p>
        <h1 className="font-display font-800 uppercase text-4xl leading-none mb-10 text-balance">Playback &amp; controls</h1>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-panel p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <PlayCircle size={17} className="text-cyan" />
            <h2 className="font-display font-700 text-xl uppercase">Playback</h2>
          </div>
          <p className="text-smoke text-sm mb-2">Choose how channels play when you tune in.</p>

          <div>
            <Toggle checked={autoplay} onChange={setAutoplay} label="Autoplay next recommended channel" />
            <Toggle checked={subtitles} onChange={setSubtitles} label="Subtitles on by default" icon={Captions} />
            <Toggle checked={dataSaver} onChange={setDataSaver} label="Data saver on mobile networks" />
          </div>

          <div className="mt-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-3">Default streaming quality</p>
            <div className="flex flex-wrap gap-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDefaultQuality(q)}
                  className={`font-mono text-xs uppercase tracking-wide px-3.5 py-2 rounded-sm border transition-colors ${
                    defaultQuality === q ? "bg-paper text-void border-paper" : "border-white/10 text-smoke hover:text-paper hover:border-white/30"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={savePlayback}
            className="mt-6 flex items-center gap-2 bg-crimson text-paper font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-sm hover:bg-crimson/85 transition-colors"
          >
            {saved && <Check size={14} />} {saved ? "Saved" : "Save playback settings"}
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg border border-white/10 bg-panel p-6 md:p-8"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <Lock size={17} className="text-crimson" />
            <h2 className="font-display font-700 text-xl uppercase">Parental controls</h2>
          </div>
          <p className="text-smoke text-sm mb-2">Lock mature categories behind a 4-digit PIN on this profile.</p>

          <Toggle checked={parentalLock} onChange={setParentalLock} label="Require PIN for Movies &amp; Entertainment" />

          {parentalLock && (
            <form onSubmit={savePin} className="mt-5 flex items-end gap-3">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">4-digit PIN</label>
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  placeholder="••••"
                  className="w-28 rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm tracking-[0.4em] text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={pin.length !== 4}
                className="font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-sm border border-white/15 text-paper hover:border-white/30 transition-colors disabled:opacity-40"
              >
                {pinSaved ? "PIN set" : "Set PIN"}
              </button>
            </form>
          )}
        </motion.section>

        <p className="mt-8 text-center text-sm text-smoke">
          Looking for billing or devices? Manage those from your{" "}
          <Link to="/profile" className="text-paper underline underline-offset-4 decoration-white/30 hover:decoration-paper">
            profile page
          </Link>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
