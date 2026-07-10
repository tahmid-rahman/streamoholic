import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, HeartOff, Share2, Globe, ExternalLink, AlertCircle, ChevronRight, Tv, Languages, Layers } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoPlayer from "../components/VideoPlayer";
import ChannelCard from "../components/ChannelCard";
import UpNextRail from "../components/UpNextRail";
import { getChannelById, getChannels } from "../utils/iptvData";
import { useLibrary } from "../context/LibraryContext";

export default function Watch() {
  const { slug } = useParams();
  const decodedSlug = decodeURIComponent(slug);
  const channel = useMemo(() => getChannelById(decodedSlug), [decodedSlug]);
  const { isFavorite, toggleFavorite, recordWatch } = useLibrary();

  useEffect(() => {
    if (channel) {
      recordWatch(channel.id);
    }
    window.scrollTo({ top: 0 });
  }, [channel]);

  if (!channel) {
    return (
      <div className="bg-void min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <AlertCircle size={48} className="text-smoke mb-4" />
          <h1 className="font-display font-800 uppercase text-2xl mb-2">Channel Not Found</h1>
          <p className="text-smoke mb-6">The channel you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/browse"
            className="font-mono text-xs uppercase tracking-widest px-6 py-3 bg-cyan text-void hover:bg-cyan/90 transition-colors rounded-sm"
          >
            Browse Channels
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFav = isFavorite(channel.id);

  // Get related channels
  const related = useMemo(() => {
    const allChannels = getChannels(channel.country?.code || 'BD');
    const sameCategory = allChannels.filter(
      c => c.id !== channel.id && c.categories.some(cat => channel.categories.some(ch => ch.id === cat.id))
    );
    const others = allChannels.filter(c => c.id !== channel.id && !sameCategory.includes(c));
    return [...sameCategory, ...others].slice(0, 6);
  }, [channel]);

  const primaryCategory = channel.categories?.[0]?.name || 'Live TV';

  return (
    <div className="bg-void min-h-screen">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-20">
        <div className="grid lg:grid-cols-[1fr,360px] gap-8">
          {/* Main Content */}
          <div>
            <VideoPlayer channel={channel} />

            {/* Channel Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-smoke font-mono text-[11px] uppercase tracking-wide mb-4">
                <Link to="/browse" className="hover:text-cyan transition-colors flex items-center gap-1">
                  <Tv size={12} />
                  Live Guide
                </Link>
                <ChevronRight size={12} />
                <span className="flex items-center gap-1">
                  <Globe size={12} />
                  {channel.country?.flag} {channel.country?.name}
                </span>
                <ChevronRight size={12} />
                <span className="text-cyan">{primaryCategory}</span>
              </div>

              {/* Channel Name & Logo */}
              <div className="flex items-center gap-4 mb-4">
                {channel.logo && (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-14 w-auto object-contain drop-shadow-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div>
                  <h1 className="font-display font-800 uppercase text-2xl md:text-3xl leading-tight text-paper">
                    {channel.name}
                  </h1>
                  {channel.network && (
                    <p className="text-smoke text-sm mt-1">{channel.network}</p>
                  )}
                </div>
              </div>

              {/* Alt Names */}
              {channel.altNames?.length > 0 && (
                <p className="text-smoke text-sm mb-4">
                  Also known as: {channel.altNames.slice(0, 2).join(', ')}
                  {channel.altNames.length > 2 && ` +${channel.altNames.length - 2} more`}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {channel.feeds?.[0]?.format && (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-paper bg-panel2 px-3 py-1.5 rounded-sm border border-white/10">
                    <Tv size={12} className="text-cyan" />
                    {channel.feeds[0].format}
                  </span>
                )}
                {channel.qualities?.length > 0 && (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-paper bg-panel2 px-3 py-1.5 rounded-sm border border-white/10">
                    <Layers size={12} className="text-cyan" />
                    Max: {channel.qualities[0]}
                  </span>
                )}
                {channel.feeds?.[0]?.languages?.length > 0 && (
                  <span className="flex items-center gap-1.5 font-mono text-xs text-smoke bg-panel2 px-3 py-1.5 rounded-sm border border-white/10">
                    <Languages size={12} />
                    {channel.feeds[0].languages.map(l => l.name).join(', ')}
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-mono text-xs text-crimson bg-crimson/10 px-3 py-1.5 rounded-sm border border-crimson/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
                  LIVE
                </span>
                {channel.website && (
                  <a
                    href={channel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-cyan hover:text-cyan/80 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Website
                  </a>
                )}
              </div>

              {/* Stream Sources Info */}
              {channel.allStreams?.length > 1 && (
                <div className="mb-6 p-4 bg-panel border border-white/10 rounded-lg">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-smoke mb-3 flex items-center gap-2">
                    <Layers size={12} />
                    Available Streams ({channel.allStreams.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {channel.qualities.map((q) => (
                      <span
                        key={q}
                        className="font-mono text-[10px] px-3 py-1.5 bg-void border border-white/10 rounded-sm text-cyan"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFavorite(channel.id)}
                  className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-5 py-2.5 rounded-sm border transition-all ${
                    isFav
                      ? "bg-crimson border-crimson text-paper shadow-lg shadow-crimson/30"
                      : "border-white/15 text-paper hover:border-white/30 hover:bg-panel"
                  }`}
                >
                  {isFav ? <HeartOff size={14} /> : <Heart size={14} />}
                  {isFav ? "Favorited" : "Add to Favorites"}
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/15 text-smoke hover:text-paper hover:border-white/30 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </motion.div>

            {/* Related Channels */}
            {related.length > 0 && (
              <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-800 uppercase text-xl text-paper flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
                    More {primaryCategory} Channels
                  </h2>
                  <Link
                    to={`/browse?country=${channel.country?.code || 'BD'}&category=${encodeURIComponent(primaryCategory)}`}
                    className="font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-cyan transition-colors flex items-center gap-1"
                  >
                    Browse All <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {related.map((c, i) => (
                    <ChannelCard key={c.id} channel={c} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Channel Categories */}
            <div className="rounded-lg border border-white/10 bg-panel overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-smoke flex items-center gap-2">
                  <Tv size={12} className="text-cyan" />
                  Categories
                </h3>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {channel.categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/browse?country=${channel.country?.code || 'BD'}&category=${encodeURIComponent(cat.name)}`}
                    className="font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 bg-void border border-white/10 rounded-sm text-paper hover:border-cyan/40 hover:text-cyan transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stream Info */}
            {channel.feeds?.[0] && (
              <div className="rounded-lg border border-white/10 bg-panel overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-smoke flex items-center gap-2">
                    <Layers size={12} className="text-cyan" />
                    Broadcast Info
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-smoke text-sm flex items-center gap-2">
                      <Tv size={12} /> Format
                    </span>
                    <span className="text-paper font-mono text-xs bg-panel2 px-2 py-1 rounded">
                      {channel.feeds[0].format || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-smoke text-sm flex items-center gap-2">
                      <Languages size={12} /> Languages
                    </span>
                    <span className="text-paper font-mono text-xs text-right">
                      {channel.feeds[0].languages?.map((l) => l.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-smoke text-sm">Network</span>
                    <span className="text-paper font-mono text-xs">{channel.network || 'Independent'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-smoke text-sm flex items-center gap-2">
                      <Layers size={12} /> Sources
                    </span>
                    <span className="text-cyan font-mono text-xs">
                      {channel.allStreams?.length || 0} available
                    </span>
                  </div>
                </div>
              </div>
            )}

            
            {/* Up Next */}
            <UpNextRail channel={channel} related={related} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}