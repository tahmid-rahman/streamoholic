import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, Globe, Radio } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChannelCard from "../components/ChannelCard";
import { getChannels, getCountries, getCategories, DEFAULT_COUNTRY } from "../utils/iptvData";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [country, setCountry] = useState(params.get("country") || DEFAULT_COUNTRY);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const newParams = {};
      if (query) newParams.q = query;
      if (country && country !== DEFAULT_COUNTRY) newParams.country = country;
      setParams(newParams, { replace: true });
    }, 150);
    return () => clearTimeout(id);
  }, [query, country]);

  const countries = useMemo(() => getCountries(), []);
  const categories = useMemo(() => getCategories(country), [country]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const channels = getChannels(country);
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.altNames.some((n) => n.toLowerCase().includes(q)) ||
        c.categories.some((cat) => cat.name.toLowerCase().includes(q)) ||
        c.network?.toLowerCase().includes(q)
    );
  }, [query, country]);

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Search Input */}
        <div className="relative max-w-2xl mb-8">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, networks, categories…"
            className="w-full rounded-sm bg-panel2 border border-white/10 pl-12 pr-10 py-4 text-lg font-display text-paper placeholder:text-smoke/50 focus:border-cyan/60 outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-smoke hover:text-paper transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <Globe size={14} className="text-smoke shrink-0" />
          <div className="flex gap-2 shrink-0">
            {countries.slice(0, 15).map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-sm border transition-colors whitespace-nowrap ${
                  country === c.code
                    ? "bg-paper text-void border-paper"
                    : "border-white/10 text-smoke hover:text-paper hover:border-white/30"
                }`}
              >
                {c.flag} {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Categories */}
        {!query && (
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-4 flex items-center gap-2">
              <Radio size={12} /> Browse by category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c.name !== 'All').map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuery(c.name)}
                  className="font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-sm border border-white/10 text-smoke hover:text-paper hover:border-white/30 hover:bg-panel transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!query && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-lg">
            <Radio size={32} className="mx-auto text-smoke/40 mb-3" />
            <p className="font-display font-700 text-lg uppercase mb-1">Start searching</p>
            <p className="text-smoke text-sm">Find channels by name, network, or category</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
            <p className="font-display font-700 text-xl uppercase mb-2">No matches for "{query}"</p>
            <p className="text-smoke text-sm">Check the spelling, or try a different country.</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="font-mono text-[11px] uppercase tracking-widest text-smoke mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((c, i) => (
                <ChannelCard key={c.id} channel={c} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}