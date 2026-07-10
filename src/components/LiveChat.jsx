import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Wifi } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const bots = ["night_owl", "static_fan", "kaya_r", "ch_hopper", "loop_watcher", "pixelfox", "stream_viper", "hd_fan"];
const lines = [
  "been watching this since it started 🔥",
  "anyone else's stream buffering or just me",
  "this is way better than cable honestly",
  "quality looks crisp today",
  "who else is on the Signal plan",
  "buffering for me too, try refreshing",
  "love this channel!",
  "switching over from another stream, much better quality here",
  "the stream is solid tonight",
  "can we get a replay of that last bit",
  "great content as always",
  "is this working for everyone?",
  "finally a good stream!",
  "the commentary is on point tonight",
  "best IPTV service hands down",
  "anyone know what song is playing?",
];

function randomLine(id) {
  return {
    id,
    user: bots[Math.floor(Math.random() * bots.length)],
    text: lines[Math.floor(Math.random() * lines.length)],
    timestamp: Date.now(),
  };
}

export default function LiveChat({ channelId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => [randomLine(0), randomLine(1), randomLine(2)]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const counter = useRef(3);

  // Reset the feed when switching channels, then keep it lightly alive.
  useEffect(() => {
    counter.current = 3;
    setMessages([randomLine(0), randomLine(1), randomLine(2)]);
    const id = setInterval(() => {
      setMessages((m) => [...m.slice(-50), randomLine(counter.current++)]);
    }, 3500);
    return () => clearInterval(id);
  }, [channelId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `me-${counter.current++}`, user: user?.name || "you", text: draft.trim(), self: true, timestamp: Date.now() },
    ]);
    setDraft("");
  };

  return (
    <div className="flex flex-col rounded-lg border border-white/10 bg-panel overflow-hidden h-full min-h-[320px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-panel2/50">
        <span className="font-mono text-[11px] uppercase tracking-widest text-smoke flex items-center gap-2">
          <MessageCircle size={12} />
          Live Chat
        </span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-mono text-[10px] text-green-400 uppercase tracking-wide">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
      >
        {messages.map((m) => (
          <div key={m.id} className="group">
            <div className="flex items-start gap-2">
              {/* Avatar indicator */}
              <span className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                m.self ? "bg-cyan/20 text-cyan" : "bg-amber/20 text-amber"
              }`}>
                {m.self ? 'Y' : m.user.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-[11px] ${m.self ? "text-cyan" : "text-amber/80"}`}>
                    {m.self ? 'You' : m.user}
                  </span>
                  <span className="font-mono text-[9px] text-smoke/40">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-paper/90 leading-relaxed">{m.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-white/10 bg-panel2/30">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? "Type a message..." : "Sign in to chat"}
          disabled={!user}
          className="flex-1 rounded-sm bg-panel border border-white/10 px-3 py-2 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!user || !draft.trim()}
          aria-label="Send"
          className="h-9 w-9 flex items-center justify-center rounded-sm bg-crimson text-paper disabled:opacity-30 hover:bg-crimson/90 transition-all shrink-0"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}