import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2,
  ChevronDown, Wifi, WifiOff, RefreshCw, Layers, Gauge,
  RotateCcw,
} from "lucide-react";

export default function VideoPlayer({ channel, onStreamChange }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);
  const hlsRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hlsLevels, setHlsLevels] = useState([]);
  const [activeLevel, setActiveLevel] = useState(-1);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [streamOpen, setStreamOpen] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [orientationLocked, setOrientationLocked] = useState(false);

  // Check if mobile device
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Lock/unlock screen orientation
  const toggleOrientationLock = useCallback(async () => {
    if (screen.orientation && screen.orientation.lock) {
      try {
        if (orientationLocked) {
          screen.orientation.unlock();
          setOrientationLocked(false);
        } else {
          await screen.orientation.lock('landscape');
          setOrientationLocked(true);
        }
      } catch (e) {
        // Fallback: just toggle state and show hint
        setOrientationLocked(!orientationLocked);
      }
    } else {
      // Browser doesn't support orientation lock
      setOrientationLocked(!orientationLocked);
    }
  }, [orientationLocked]);

  const currentStream = channel?.allStreams?.[currentStreamIndex] || channel?.primaryStream;
  const hasMultipleStreams = (channel?.allStreams?.length || 0) > 1;
  const hasMultipleQualities = hlsLevels.length > 1;

  // Load the stream
  const loadStream = useCallback((streamUrl, streamIndex = 0) => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setLoading(true);
    setError(null);
    setHlsLevels([]);
    setActiveLevel(-1);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHlsLevels(hls.levels || []);
        setLoading(false);
        video.play().catch(() => setPlaying(false));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setActiveLevel(data.level));

      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error. Check your connection and try again.");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error. Attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              setError("Stream unavailable. Try another source.");
              setLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => setPlaying(false));
      });
      video.addEventListener("error", () => {
        setError("This browser can't play this stream.");
        setLoading(false);
      });
    } else {
      setError("HLS not supported in this browser.");
      setLoading(false);
    }
  }, []);

  // Load initial stream
  useEffect(() => {
    if (currentStream?.url) {
      setCurrentStreamIndex(0);
      loadStream(currentStream.url, 0);
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel?.id]);

  // Switch to a different stream
  const switchStream = useCallback((streamIndex) => {
    const stream = channel?.allStreams?.[streamIndex];
    if (stream) {
      setCurrentStreamIndex(streamIndex);
      loadStream(stream.url, streamIndex);
      setStreamOpen(false);
      onStreamChange?.(stream);
    }
  }, [channel?.allStreams, loadStream, onStreamChange]);

  // Switch to a different quality
  const selectLevel = useCallback((level) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
    setQualityOpen(false);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.volume === 0) {
      video.volume = 0.5;
      setVolume(0.5);
    }
  }, []);

  const onVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setMuted(v === 0);
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "KeyM") toggleMute();
      if (e.code === "KeyF") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, toggleMute, toggleFullscreen]);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    scheduleHide();
    return () => clearTimeout(hideTimer.current);
  }, [controlsVisible, scheduleHide]);

  const retryStream = () => {
    setError(null);
    loadStream(currentStream?.url, currentStreamIndex);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group/player rounded-lg border border-white/10 shadow-2xl"
      onMouseMove={() => { setControlsVisible(true); scheduleHide(); }}
      onMouseLeave={() => setControlsVisible(false)}
      onClick={() => setControlsVisible(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        muted={muted}
        autoPlay
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Loading overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:gap-4 bg-black/80 backdrop-blur-sm">
          <div className="relative">
            <Loader2 size={32} className="animate-spin text-cyan md:size-10" />
            <div className="absolute inset-0 animate-spin text-cyan/50 blur-sm">
              <Loader2 size={32} className="md:size-10" />
            </div>
          </div>
          <div className="text-center px-4">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/80 mb-0.5 md:mb-1">Tuning in</p>
            <p className="font-mono text-[9px] md:text-[10px] text-white/40 truncate max-w-[200px]">{channel?.name}</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 backdrop-blur-sm px-6 text-center">
          <div className="h-14 w-14 rounded-full bg-crimson/20 flex items-center justify-center">
            <WifiOff size={28} className="text-crimson" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/80 mb-1">{error}</p>
            {hasMultipleStreams && (
              <p className="text-white/40 text-xs">Try another stream source below</p>
            )}
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={retryStream}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all rounded-sm"
            >
              <RefreshCw size={12} /> Retry
            </button>
            {hasMultipleStreams && (
              <button
                onClick={() => setStreamOpen(true)}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 bg-crimson/20 border border-crimson/40 text-crimson hover:bg-crimson/30 transition-all rounded-sm"
              >
                <Layers size={12} /> Change Source
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute top-0 inset-x-0 p-2 md:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-all duration-300 ${
          controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Channel info */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-crimson"></span>
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
              {channel?.logo && (
                <img
                  src={channel.logo}
                  alt=""
                  className="h-5 w-5 md:h-6 md:w-6 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-white truncate">
                {channel?.name}
              </span>
            </div>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {currentStream?.quality && (
              <span className="hidden xs:flex items-center gap-1 font-mono text-[9px] md:text-[10px] text-white/60 bg-white/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm">
                <Gauge size={8} md:size={10} />
                {currentStream.quality}
              </span>
            )}
            <span className="flex items-center gap-1 font-mono text-[9px] md:text-[10px] uppercase tracking-wider text-white bg-crimson px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-sm">
              <Wifi size={8} md:size={10} className="text-white" />
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Center play/pause */}
      {!loading && !error && (
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            controlsVisible && !playing ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <span className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl hover:bg-black/80 hover:scale-110 transition-all">
            {playing ? (
              <Pause size={22} className="sm:w-7 sm:h-7" fill="currentColor" />
            ) : (
              <Play size={22} className="sm:w-7 sm:h-7" fill="currentColor" />
            )}
          </span>
        </button>
      )}

      {/* Bottom control bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ${
          controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-6">
          {/* Play/Pause */}
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="text-white hover:text-cyan transition-colors">
            {playing ? <Pause size={20} className="md:w-[22px] md:h-[22px]" /> : <Play size={20} className="md:w-[22px] md:h-[22px]" fill="currentColor" />}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 group/vol">
            <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className={`flex items-center justify-center w-6 h-6 transition-colors ${muted || volume === 0 ? "text-crimson" : "text-white hover:text-crimson"}`}>
              {muted || volume === 0 ? <VolumeX size={18} className="md:w-5 md:h-5" /> : <Volume2 size={18} className="md:w-5 md:h-5" />}
            </button>
            {/* Always visible on mobile, hover on desktop */}
            <div className="w-0 sm:group-hover/vol:w-20 transition-all duration-200 overflow-hidden flex items-center touch-auto sm:overflow-hidden">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-20 accent-crimson h-1 cursor-pointer touch:w-16 sm:touch:w-0"
                aria-label="Volume"
              />
            </div>
            {/* Touch-friendly volume controls on mobile */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => {
                  const newVol = Math.max(0, (muted ? volume : (volume - 0.1)));
                  setVolume(newVol);
                  if (videoRef.current) {
                    videoRef.current.volume = newVol;
                    videoRef.current.muted = newVol === 0;
                    setMuted(newVol === 0);
                  }
                }}
                className="text-white/70 hover:text-white p-1"
                aria-label="Decrease volume"
              >
                -
              </button>
              <span className="text-white/70 text-xs w-6 text-center font-mono">{Math.round((muted ? 0 : volume) * 100)}</span>
              <button
                onClick={() => {
                  const newVol = Math.min(1, (muted ? volume : (volume + 0.1)));
                  setVolume(newVol);
                  if (videoRef.current) {
                    videoRef.current.volume = newVol;
                    videoRef.current.muted = false;
                    setMuted(false);
                  }
                }}
                className="text-white/70 hover:text-white p-1"
                aria-label="Increase volume"
              >
                +
              </button>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-crimson">
            <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </div>

          <div className="flex-1" />

          {/* Stream Selector */}
          {hasMultipleStreams && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStreamOpen((o) => !o);
                  setQualityOpen(false);
                }}
                className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-sm transition-colors ${
                  streamOpen ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Layers size={14} />
                <span className="hidden md:inline">Source</span>
                <ChevronDown size={12} className={`transition-transform ${streamOpen ? 'rotate-180' : ''}`} />
              </button>
              {streamOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-60 max-h-72 overflow-y-auto rounded-lg border border-white/20 bg-black/95 backdrop-blur-lg shadow-2xl z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">Select Stream Source</p>
                  </div>
                  {channel.allStreams.map((stream, i) => (
                    <button
                      key={i}
                      onClick={() => switchStream(i)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-center justify-between gap-3 ${
                        currentStreamIndex === i ? "bg-cyan/20 text-cyan" : "text-white/90"
                      }`}
                    >
                      <span className="truncate flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${currentStreamIndex === i ? 'bg-cyan' : 'bg-white/30'}`} />
                        {stream.label || stream.feedName || `Source ${i + 1}`}
                      </span>
                      <span className="font-mono text-[10px] text-white/50 shrink-0">
                        {stream.quality}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HLS Quality Selector */}
          {hasMultipleQualities && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQualityOpen((o) => !o);
                  setStreamOpen(false);
                }}
                className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-sm transition-colors ${
                  qualityOpen ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Gauge size={14} />
                <span className="hidden md:inline">
                  {activeLevel === -1 ? "Auto" : `${hlsLevels[activeLevel]?.height}p`}
                </span>
                <ChevronDown size={12} className={`transition-transform ${qualityOpen ? 'rotate-180' : ''}`} />
              </button>
              {qualityOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-32 rounded-lg border border-white/20 bg-black/95 backdrop-blur-lg shadow-2xl z-30 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => selectLevel(-1)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-mono hover:bg-white/10 transition-colors ${
                      activeLevel === -1 ? "bg-cyan/20 text-cyan" : "text-white/90"
                    }`}
                  >
                    Auto
                  </button>
                  {hlsLevels.map((lvl, i) => (
                    <button
                      key={i}
                      onClick={() => selectLevel(i)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-mono hover:bg-white/10 transition-colors ${
                        activeLevel === i ? "bg-cyan/20 text-cyan" : "text-white/90"
                      }`}
                    >
                      {lvl.height}p
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rotate Screen (mobile only) */}
          {isMobile && fullscreen && (
            <button
              onClick={toggleOrientationLock}
              aria-label="Rotate screen"
              className={`text-white/70 hover:text-white transition-colors ${orientationLocked ? 'text-cyan' : ''}`}
            >
              <RotateCcw size={18} className="md:w-5 md:h-5" />
            </button>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} aria-label="Fullscreen" className="text-white/70 hover:text-white transition-colors">
            {fullscreen ? <Minimize size={18} className="md:w-5 md:h-5" /> : <Maximize size={18} className="md:w-5 md:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}