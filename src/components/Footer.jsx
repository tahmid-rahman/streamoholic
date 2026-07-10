import { Tv } from "lucide-react";

const columns = [
  {
    title: "Watch",
    links: ["Live Guide", "Sports", "News", "Movies", "Kids"],
  },
  {
    title: "Account",
    links: ["Plans & Pricing", "Manage Devices", "Billing", "Help Center"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Content Partners"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-[1.3fr,1fr,1fr,1fr] gap-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-crimson">
              <Tv size={16} strokeWidth={2.5} className="text-paper" />
            </span>
            <span className="font-display font-800 text-xl tracking-tight uppercase">Streamoholic</span>
          </div>
          <p className="text-smoke text-sm max-w-xs mb-5">
            Live channels, on-demand replays, and originals — streamed to any screen, no cable required.
          </p>
          <div className="flex items-center gap-4 text-smoke">
            <a href="#" aria-label="X" className="hover:text-paper transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.6 22H1.5l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-paper transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-paper transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-paper/85 hover:text-paper transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-smoke">© 2026 Streamoholic. All rights reserved.</p>
          <p className="font-mono text-[11px] text-smoke">Developed by <span className="text-cyan">ART</span></p>
        </div>
      </div>
    </footer>
  );
}
