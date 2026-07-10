import { useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Radio, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChannelCard from "../components/ChannelCard";
import { getChannels, getCategories, DEFAULT_COUNTRY } from "../utils/iptvData";

export default function Category() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name || '');

  const categories = useMemo(() => getCategories(DEFAULT_COUNTRY), []);
  const category = categories.find(
    (c) => c.name.toLowerCase() === decodedName.toLowerCase()
  );

  const channels = useMemo(() => {
    if (!category || category.name === 'All') return [];
    return getChannels(DEFAULT_COUNTRY, category.name);
  }, [category]);

  if (!decodedName) return <Navigate to="/browse" replace />;

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-smoke font-mono text-[11px] uppercase tracking-wide mb-4">
          <Link to="/browse" className="hover:text-paper transition-colors">Browse</Link>
          <ChevronRight size={12} />
          <span className="text-cyan">{decodedName}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
          <p className="font-mono text-[11px] uppercase tracking-widest text-crimson">Live Category</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <h1 className="font-display font-800 uppercase text-3xl md:text-5xl leading-none text-balance">
            {decodedName}
          </h1>
          <span className="font-mono text-xs text-smoke bg-panel px-3 py-1.5 rounded-sm">
            {channels.length} channel{channels.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Related Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.filter((c) => c.name !== 'All' && c.name !== decodedName).map((c) => (
            <Link
              key={c.id}
              to={`/category/${encodeURIComponent(c.name)}`}
              className="font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-sm border border-white/10 text-smoke hover:text-paper hover:border-white/30 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {channels.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-lg">
            <Radio size={32} className="mx-auto text-smoke/40 mb-3" />
            <p className="font-display font-700 text-xl uppercase mb-2">No channels found</p>
            <p className="text-smoke text-sm">No live channels in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {channels.map((c, i) => (
              <ChannelCard key={c.id} channel={c} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}