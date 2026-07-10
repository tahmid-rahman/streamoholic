import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";

export default function ChannelCard({ channel, index = 0, showFavoriteButton = true }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const isFav = isFavorite(channel.id);

  // Country-based accent colors
  const isBD = channel.country?.code === 'BD';
  const accentBg = isBD ? 'bg-gradient-to-br from-amber-500/10 to-amber-900/5' : 'bg-gradient-to-br from-cyan-500/10 to-cyan-900/5';
  const accentBorder = isBD ? 'hover:border-amber-500/30' : 'hover:border-cyan-500/30';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative rounded-lg border border-white/10 bg-panel overflow-hidden ${accentBorder} transition-all duration-200`}
    >
      <Link to={`/watch/${encodeURIComponent(channel.id)}`} className="block">
        {/* Thumbnail / Logo Area */}
        <div className={`relative aspect-[16/10] ${accentBg} flex items-center justify-center overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          {/* Channel Logo */}
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="relative z-10 max-w-[75%] max-h-[75%] object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-800 text-white/20 uppercase">
                {channel.name?.charAt(0) || '?'}
              </span>
            </div>
          )}

          {/* Live Badge */}
          <span className="absolute top-2 left-2 z-20 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-crimson text-paper shadow-lg shadow-crimson/30">
            <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
            LIVE
          </span>

          {/* Quality Badge */}
          {channel.feeds?.[0]?.format && (
            <span className="absolute top-2 right-2 z-20 font-mono text-[9px] text-white/90 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              {channel.feeds[0].format}
            </span>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
            <span className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 font-mono text-[10px] uppercase tracking-widest bg-paper text-void px-4 py-2 rounded-sm shadow-xl">
              Watch now
            </span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-panel to-transparent" />
        </div>

        {/* Channel Info */}
        <div className="p-3 relative">
          {/* Category badge */}
          {channel.categories?.[0] && (
            <span className="absolute -top-3 left-3 font-mono text-[9px] uppercase tracking-wide text-paper bg-panel2 px-2 py-0.5 rounded-sm border border-white/10">
              {channel.categories[0].name}
            </span>
          )}

          <h3 className="font-display font-700 text-sm leading-tight text-paper truncate mt-1" title={channel.name}>
            {channel.name}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-smoke text-[10px]">
            <span className="flex items-center gap-1">
              <span>{channel.country?.flag}</span>
              <span className="uppercase tracking-wide">{channel.country?.code}</span>
            </span>
            {channel.qualities?.length > 0 && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-cyan/70">{channel.qualities[0]}</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      {showFavoriteButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(channel.id);
          }}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-2 right-2 z-20 h-7 w-7 flex items-center justify-center rounded-full border transition-all duration-200 ${
            isFav
              ? "bg-crimson border-crimson text-paper shadow-lg shadow-crimson/40"
              : "bg-black/50 backdrop-blur-sm border-white/20 text-white/80 hover:text-paper hover:border-white/40"
          }`}
        >
          {isFav ? <HeartOff size={12} /> : <Heart size={12} />}
        </button>
      )}
    </motion.div>
  );
}