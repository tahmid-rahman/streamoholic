import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tv, Menu, X, ChevronDown, User, LogOut, Search, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Live Guide", to: "/browse" },
  { label: "Plans", to: "/pricing" },
  { label: "Devices", href: "/#devices" },
  { label: "FAQ", href: "/#faq" },
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const accentMap = { crimson: "bg-crimson", cyan: "bg-cyan", amber: "bg-amber" };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-void/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-crimson">
            <Tv size={16} strokeWidth={2.5} className="text-paper" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyan shadow-glowcyan animate-pulse" />
          </span>
          <span className="font-display font-800 text-2xl tracking-tight uppercase">
            Streamoholic
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[13px] uppercase tracking-wide text-smoke">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className="hover:text-paper transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="hover:text-paper transition-colors">
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/search"
            aria-label="Search"
            className="h-9 w-9 flex items-center justify-center rounded-sm text-smoke hover:text-paper transition-colors"
          >
            <Search size={17} />
          </Link>
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((m) => !m)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-white/10 hover:border-white/25 transition-colors"
              >
                <span className={`h-7 w-7 rounded-full ${accentMap[user.avatarColor] || "bg-crimson"} flex items-center justify-center font-display font-800 text-xs text-void`}>
                  {initials(user.name)}
                </span>
                <ChevronDown size={14} className="text-smoke" />
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-52 rounded-sm border border-white/10 bg-panel shadow-panel overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-paper truncate">{user.name}</p>
                    <p className="font-mono text-[11px] text-smoke truncate">{user.plan} plan</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-paper/90 hover:bg-panel2"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-paper/90 hover:bg-panel2"
                  >
                    <SettingsIcon size={15} /> Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-paper/90 hover:bg-panel2"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="font-mono text-[13px] uppercase tracking-wide text-smoke hover:text-paper transition-colors">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="font-mono text-[13px] uppercase tracking-wide bg-crimson text-paper px-4 py-2 rounded-sm hover:bg-crimson/85 transition-colors shadow-tally"
              >
                Start watching free
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-paper"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-void border-t border-white/5 px-6 py-4 flex flex-col gap-4 font-mono text-sm uppercase"
        >
          <Link to="/search" onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
            Search
          </Link>
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
                {l.label}
              </a>
            )
          )}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
                Profile
              </Link>
              <Link to="/settings" onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                  navigate("/");
                }}
                className="text-left text-smoke hover:text-paper"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={() => setOpen(false)} className="text-smoke hover:text-paper">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="bg-crimson text-paper px-4 py-2 rounded-sm text-center">
                Start watching free
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
