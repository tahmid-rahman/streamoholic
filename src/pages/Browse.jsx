import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Globe, Radio, X, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChannelCard from "../components/ChannelCard";
import { getChannels, getCountries, getCategories, DEFAULT_COUNTRY } from "../utils/iptvData";

const ITEMS_PER_PAGE = 24;

const sorts = [
  { id: "az", label: "A–Z" },
  { id: "za", label: "Z–A" },
];

export default function Browse() {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az");
  const [sortOpen, setSortOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  // Get data
  const countries = useMemo(() => getCountries(), []);
  const categories = useMemo(() => getCategories(country), [country]);

  // Compute category counts once
  const categoryCounts = useMemo(() => {
    const counts = { All: 0 };
    categories.forEach((c) => {
      if (c.name !== 'All') counts[c.id] = 0;
    });
    getChannels(country).forEach((ch) => {
      counts.All++;
      ch.categories?.forEach((cat) => {
        if (counts[cat.id] !== undefined) counts[cat.id]++;
      });
    });
    return counts;
  }, [country, categories]);

  // Filter channels
  const filteredChannels = useMemo(() => {
    let list = getChannels(country, active === "All" ? undefined : active);

    // Search filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.altNames.some((n) => n.toLowerCase().includes(q)) ||
          c.categories.some((cat) => cat.name.toLowerCase().includes(q)) ||
          c.network?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [country, active, query, sort]);

  // Reset on filter change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [country, active, query, sort]);

  // Lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredChannels.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredChannels.length));
            setIsLoading(false);
          }, 150);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredChannels.length]);

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-trigger')) {
        setSortOpen(false);
        setCountryOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentCountry = countries.find((c) => c.code === country);

  const handleCountryChange = (code) => {
    setCountry(code);
    setActive("All");
    setCountryOpen(false);
  };

  const handleCategoryChange = (name) => {
    setActive(name);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
          </span>
          <p className="font-mono text-[11px] uppercase tracking-widest text-crimson">Live guide</p>
        </div>
        <h1 className="font-display font-800 uppercase text-3xl md:text-5xl leading-none mb-6 text-balance">
          {currentCountry?.flag} {currentCountry?.name} Channels
        </h1>

        {/* Country Selector */}
        <div className="relative inline-block mb-6 dropdown-trigger">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCountryOpen((o) => !o);
              setSortOpen(false);
            }}
            className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:text-cyan border border-white/10 hover:border-cyan/40 rounded-sm px-4 py-2.5 transition-all bg-panel hover:bg-panel2"
          >
            <Globe size={15} />
            <span>{currentCountry?.name}</span>
            <span className="text-smoke/60">({currentCountry?.count})</span>
            <ChevronDown size={14} className={`transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
          </button>
          {countryOpen && (
            <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-lg border border-white/10 bg-panel shadow-2xl z-30">
              <div className="sticky top-0 bg-panel border-b border-white/10 px-4 py-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-smoke">Select Country</p>
              </div>
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountryChange(c.code)}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-sm hover:bg-panel2 transition-colors ${
                    country === c.code ? "text-cyan bg-panel2" : "text-paper"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="font-mono text-xs text-smoke/60">{c.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-smoke" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels..."
              className="w-full rounded-sm bg-panel2 border border-white/10 pl-10 pr-10 py-2.5 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-paper transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative dropdown-trigger">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSortOpen((o) => !o);
                setCountryOpen(false);
              }}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-smoke hover:text-paper border border-white/10 rounded-sm px-4 py-2.5 transition-colors hover:bg-panel2"
            >
              Sort: <span className="text-paper">{sorts.find((s) => s.id === sort)?.label}</span>
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-white/10 bg-panel shadow-xl z-20 overflow-hidden">
                {sorts.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-mono uppercase tracking-wide hover:bg-panel2 transition-colors ${
                      sort === s.id ? "text-cyan bg-panel2" : "text-paper"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => {
            const count = c.name === 'All' ? categoryCounts.All : categoryCounts[c.id];
            return (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(c.name)}
                className={`font-mono text-[11px] uppercase tracking-wide px-4 py-2 rounded-sm border transition-all ${
                  active === c.name
                    ? "bg-paper text-void border-paper shadow-lg"
                    : "border-white/10 text-smoke hover:text-paper hover:border-white/30 hover:bg-panel"
                }`}
              >
                {c.name}
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${
                  active === c.name ? "bg-void/20 text-void" : "bg-white/5"
                }`}>
                  {count || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs text-smoke">
            Showing <span className="text-paper">{Math.min(visibleCount, filteredChannels.length)}</span> of{' '}
            <span className="text-paper">{filteredChannels.length}</span> channels
          </p>
          {query && (
            <p className="font-mono text-xs text-smoke">
              Search: <span className="text-cyan">"{query}"</span>
            </p>
          )}
        </div>

        {/* Channel Grid */}
        {filteredChannels.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
            <Radio size={40} className="mx-auto text-smoke/30 mb-4" />
            <p className="font-display font-700 text-xl uppercase mb-2">No channels found</p>
            <p className="text-smoke text-sm">Try a different search term or category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredChannels.slice(0, visibleCount).map((channel, i) => (
                  <ChannelCard key={channel.id} channel={channel} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-cyan" />
              </div>
            )}

            {/* Infinite scroll trigger */}
            {visibleCount < filteredChannels.length && (
              <div ref={loaderRef} className="h-4" />
            )}

            {/* End of list */}
            {visibleCount >= filteredChannels.length && filteredChannels.length > 0 && (
              <p className="text-center py-8 font-mono text-xs text-smoke/50">
                You've reached the end · {filteredChannels.length} channels
              </p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}