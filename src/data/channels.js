// Mock EPG data — no real broadcast rights, illustrative content only.
// Video playback uses publicly available HLS test/demo streams (Mux, Apple)
// looped to simulate a live feed.

export const categories = [
  "All", "Sports", "News", "Movies", "Kids", "Music", "Documentary", "Entertainment"
];

// Public HLS test streams, cycled across channels for real <video> playback.
export const testStreams = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const raw = [
  { id: 1, num: "001", name: "PULSE SPORTS", category: "Sports", show: "Matchday Live: City Derby", live: true, viewers: "84.2K", accent: "crimson", tag: "LIVE",
    description: "Wall-to-wall football coverage with live scores, tactical breakdowns, and post-match reaction from the studio desk.",
    language: "English", quality: "4K HDR" },
  { id: 2, num: "002", name: "NORTHSTAR NEWS", category: "News", show: "The Nightly Brief", live: true, viewers: "41.6K", accent: "cyan", tag: "LIVE",
    description: "Twenty minutes on the stories that matter, delivered straight with no filler and no shouting.",
    language: "English", quality: "1080p" },
  { id: 3, num: "003", name: "REEL ONE", category: "Movies", show: "Midnight in Alkara (2024)", live: true, viewers: "22.9K", accent: "amber", tag: "PREMIERE",
    description: "A fictional noir thriller premiere — a detective chases one last case through a city that never sleeps.",
    language: "English", quality: "4K HDR" },
  { id: 4, num: "004", name: "ORBIT KIDS", category: "Kids", show: "Comet & Cricket", live: true, viewers: "9.4K", accent: "cyan", tag: "LIVE",
    description: "A curious space-faring duo explore friendly planets and solve gentle mysteries, one episode at a time.",
    language: "English", quality: "1080p" },
  { id: 5, num: "005", name: "AFTERGLOW MUSIC", category: "Music", show: "Rooftop Sessions Vol. 12", live: true, viewers: "17.1K", accent: "amber", tag: "LIVE",
    description: "Stripped-back live sets recorded at golden hour, featuring a rotating cast of independent artists.",
    language: "English", quality: "1080p" },
  { id: 6, num: "006", name: "DEEP FIELD", category: "Documentary", show: "Under the Ice Shelf", live: true, viewers: "12.8K", accent: "cyan", tag: "LIVE",
    description: "A slow, meditative look at life beneath Antarctic ice, narrated with restraint and real patience.",
    language: "English", quality: "4K HDR" },
  { id: 7, num: "007", name: "COURTSIDE", category: "Sports", show: "Playoffs: Game 4 Tip-Off", live: true, viewers: "63.5K", accent: "crimson", tag: "LIVE",
    description: "Playoff basketball with full-court commentary and real-time win-probability tracking.",
    language: "English", quality: "4K HDR" },
  { id: 8, num: "008", name: "VELVET HOUR", category: "Entertainment", show: "Late Night with Marra Voss", live: true, viewers: "28.3K", accent: "amber", tag: "LIVE",
    description: "Monologue, guests, and a house band — the late-night format done with a little more warmth.",
    language: "English", quality: "1080p" },
  { id: 9, num: "009", name: "GRID CIRCUIT", category: "Sports", show: "Qualifying: Free Practice 2", live: true, viewers: "35.0K", accent: "crimson", tag: "LIVE",
    description: "Trackside motorsport coverage with live sector times and driver radio.",
    language: "English", quality: "4K HDR" },
  { id: 10, num: "010", name: "ARCHIVE 24", category: "Documentary", show: "The Vinyl Renaissance", live: true, viewers: "6.7K", accent: "cyan", tag: "LIVE",
    description: "A look at the collectors and pressing plants keeping physical music alive.",
    language: "English", quality: "1080p" },
  { id: 11, num: "011", name: "REEL TWO", category: "Movies", show: "Foxglove & Ash", live: true, viewers: "14.2K", accent: "amber", tag: "LIVE",
    description: "A fictional slow-burn drama about two estranged siblings rebuilding their family's orchard.",
    language: "English", quality: "1080p" },
  { id: 12, num: "012", name: "SIGNAL NEWS 24", category: "News", show: "Markets at the Bell", live: true, viewers: "19.5K", accent: "cyan", tag: "LIVE",
    description: "Closing-bell market coverage with analyst call-ins and a look ahead to tomorrow's open.",
    language: "English", quality: "1080p" },
];

export const channels = raw.map((c, i) => ({
  ...c,
  slug: slugify(c.name),
  streamUrl: testStreams[i % testStreams.length],
  schedule: [
    { time: "6:00 AM", title: "Morning Edition" },
    { time: "12:00 PM", title: "Midday Replay" },
    { time: "8:00 PM", title: c.show, current: true },
    { time: "10:30 PM", title: "Evening Recap" },
    { time: "1:00 AM", title: "Late Rotation" },
  ],
}));

export const trending = [
  "Matchday Live: City Derby — 84.2K watching",
  "Playoffs: Game 4 Tip-Off — 63.5K watching",
  "Qualifying: Free Practice 2 — 35.0K watching",
  "Late Night with Marra Voss — 28.3K watching",
  "The Nightly Brief — 41.6K watching",
  "Midnight in Alkara (2024) Premiere — 22.9K watching",
];

export const plans = [
  {
    name: "Free",
    price: 0,
    tagline: "Try it out",
    features: ["20 live channels", "1 screen at a time", "480p streaming", "Ad-supported", "No replay"],
    highlight: false,
  },
  {
    name: "Starter",
    price: 8,
    tagline: "Get on air",
    features: ["60+ live channels", "1 screen at a time", "720p streaming", "24-hr replay"],
    highlight: false,
  },
  {
    name: "Signal",
    price: 16,
    tagline: "Most popular",
    features: ["180+ live channels", "3 screens at once", "4K on supported channels", "7-day replay", "Offline downloads"],
    highlight: true,
  },
  {
    name: "Broadcast",
    price: 26,
    tagline: "For the whole house",
    features: ["300+ live channels", "6 screens at once", "4K + HDR everywhere", "30-day replay", "Multiview mode"],
    highlight: false,
  },
];

export const devices = [
  "Smart TVs", "iOS & Android", "Fire TV", "Apple TV", "Chromecast", "Web Browser", "Roku", "Game Consoles"
];

export const faqs = [
  { q: "Do I need a cable box or satellite dish?", a: "No. Streamoholic runs entirely over your internet connection — sign in on any supported device and you're on air in seconds." },
  { q: "Can I pause and rewind live channels?", a: "Yes. Every channel supports live pause, rewind, and replay windows ranging from 24 hours to 30 days depending on your plan." },
  { q: "How many screens can watch at once?", a: "Depends on your plan — from one screen on Starter up to six simultaneous streams on Broadcast, all on separate profiles." },
  { q: "Is there a contract?", a: "None. Streamoholic is billed monthly and you can cancel any time from your account settings — no calls, no retention maze." },
  { q: "What video quality can I expect?", a: "Up to 4K HDR on supported channels and devices, with adaptive streaming that adjusts automatically to your connection." },
];

export function getChannelBySlug(slug) {
  return channels.find((c) => c.slug === slug);
}

export function relatedChannels(channel, count = 4) {
  return channels
    .filter((c) => c.id !== channel.id && c.category === channel.category)
    .concat(channels.filter((c) => c.id !== channel.id && c.category !== channel.category))
    .slice(0, count);
}
