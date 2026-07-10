import { useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, LogOut, Pencil, Tv2, Smartphone, AppWindow, Cast, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { plans, devices as allDevices } from "../data/channels";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const accentMap = {
  crimson: "bg-crimson",
  cyan: "bg-cyan",
  amber: "bg-amber",
};

const deviceIcons = { "Web Browser": AppWindow, "Smart TVs": Tv2, "iOS & Android": Smartphone, "Fire TV": Cast };

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const { user, ready, updateProfile, signOut } = useAuth();
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!ready) return null;
  if (!user) return <Navigate to="/signin" replace state={{ from: "/profile" }} />;

  const justJoined = location.state?.justJoined;
  const currentPlan = plans.find((p) => p.name === user.plan) || plans[1];

  const saveDetails = (e) => {
    e.preventDefault();
    updateProfile({ name: form.name, email: form.email });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
        {justJoined && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 rounded-sm border border-cyan/40 bg-cyan/10 px-4 py-3 mb-8 text-sm"
          >
            <Check size={16} className="text-cyan shrink-0" />
            Welcome to Streamoholic — your account is ready and your first week is on us.
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-12">
          <div className={`h-16 w-16 rounded-full ${accentMap[user.avatarColor] || "bg-crimson"} flex items-center justify-center font-display font-800 text-xl text-void shrink-0`}>
            {initials(user.name)}
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-crimson mb-1">Your account</p>
            <h1 className="font-display font-800 uppercase text-3xl md:text-4xl leading-none text-balance">{user.name}</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Personal details */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 rounded-lg border border-white/10 bg-panel p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-700 text-xl uppercase">Personal details</h2>
              {!editing && (
                <button
                  onClick={() => {
                    setForm({ name: user.name, email: user.email });
                    setEditing(true);
                  }}
                  className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-paper"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveDetails} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">Full name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper focus:border-cyan/60 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper focus:border-cyan/60 outline-none transition-colors"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="bg-crimson text-paper font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-sm hover:bg-crimson/85 transition-colors">
                    Save changes
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="font-mono text-xs uppercase tracking-wide text-smoke hover:text-paper px-4 py-2.5">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-smoke">Name</dt>
                  <dd className="text-sm">{user.name}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-smoke">Email</dt>
                  <dd className="text-sm">{user.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-smoke">Member since</dt>
                  <dd className="text-sm">{new Date(user.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</dd>
                </div>
              </dl>
            )}

            {saved && <p className="mt-4 text-xs text-cyan font-mono uppercase tracking-widest">Saved</p>}

            {/* Preferences */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-display font-700 text-lg uppercase mb-4">Preferences</h3>
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <span className="flex items-center gap-2.5 text-sm min-w-0">
                  <Bell size={15} className="text-smoke shrink-0" /> Weekly live guide &amp; premiere alerts
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications}
                  onClick={() => setNotifications((n) => !n)}
                  className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${notifications ? "bg-crimson" : "bg-panel2 border border-white/15"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
              <div className="flex items-center gap-2.5 text-sm mt-4 text-smoke">
                <ShieldCheck size={15} /> Two-factor authentication — <span className="text-paper">not enabled</span>
              </div>
            </div>
          </motion.section>

          {/* Subscription + devices */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-crimson/40 bg-panel p-6 shadow-tally">
              <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">Current plan</p>
              <h3 className="font-display font-800 uppercase text-2xl mb-1">{currentPlan.name}</h3>
              <p className="text-smoke text-sm mb-4">
                {currentPlan.price === 0 ? "Free, ad-supported" : `$${currentPlan.price}/mo`} · {currentPlan.features[1]}
              </p>
              <Link
                to="/pricing"
                className="block text-center bg-crimson text-paper font-mono text-xs uppercase tracking-wide px-4 py-2.5 rounded-sm hover:bg-crimson/85 transition-colors"
              >
                {currentPlan.name === "Broadcast" ? "Manage plan" : "Upgrade plan"}
              </Link>
            </div>

            <div className="rounded-lg border border-white/10 bg-panel p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-4">Connected devices</p>
              <ul className="space-y-3">
                {(user.devices || []).map((d) => {
                  const Icon = deviceIcons[d] || AppWindow;
                  return (
                    <li key={d} className="flex items-center gap-2.5 text-sm">
                      <Icon size={16} className="text-cyan shrink-0" />
                      {d}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-smoke">
                {(user.devices || []).length} of {user.screens || 1} screen{(user.screens || 1) > 1 ? "s" : ""} in use.{" "}
                {allDevices.length - (user.devices || []).length} more device types available.
              </p>
            </div>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wide text-smoke hover:text-crimson border border-white/10 hover:border-crimson/40 rounded-sm px-4 py-3 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </motion.aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
