# Streamoholic

> A live-TV / IPTV-style streaming frontend with a broadcast aesthetic. No cable, no contract, no fluff.

Built with **React 19**, **Vite**, **React Router v7**, **Tailwind CSS**, **Framer Motion**, **GSAP**, and **hls.js** for adaptive video playback.

---

## Getting Started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── assets/           # Static assets (logos, JSON data, icons)
├── components/       # Reusable UI components
│   ├── ChannelCard.jsx      # Channel grid card with hover effects
│   ├── ChannelDial.jsx      # GSAP-animated cable-box channel flipper
│   ├── ContinueWatchingRow.jsx  # Resume viewing rail
│   ├── Devices.jsx          # Supported device grid
│   ├── FAQ.jsx              # Animated accordion
│   ├── Footer.jsx           # Site footer
│   ├── Hero.jsx             # Hero section with ChannelDial
│   ├── LiveChat.jsx         # Live viewer chat sidebar
│   ├── LiveGrid.jsx         # EPG-style live channel guide
│   ├── Navbar.jsx           # Sticky nav with mobile menu & profile dropdown
│   ├── Pricing.jsx          # 4-tier pricing cards (Free/Starter/Signal/Broadcast)
│   ├── TrendingTicker.jsx   # GSAP infinite marquee of trending shows
│   ├── UpNextRail.jsx       # Up next sidebar rail
│   └── VideoPlayer.jsx      # HLS.js video player with quality selector
├── context/
│   ├── AuthContext.jsx      # Mock auth (localStorage-based, no backend)
│   └── LibraryContext.jsx   # Favorites, My List, Continue Watching
├── data/
│   └── channels.js          # Mock channel data, plans, devices, FAQs
├── pages/
│   ├── AuthLayout.jsx       # Shared auth form layout
│   ├── Browse.jsx           # Live channel guide with country/category filters
│   ├── Category.jsx         # Single-category channel listing
│   ├── Home.jsx             # Marketing landing page
│   ├── NotFound.jsx         # 404 page
│   ├── Pricing.jsx          # Pricing page with plan comparison table
│   ├── Profile.jsx          # Account settings, subscription, devices
│   ├── Search.jsx           # Full-text channel search
│   ├── Settings.jsx         # Playback & parental control settings
│   ├── SignIn.jsx           # Sign in form
│   └── SignUp.jsx           # Sign up form with plan selection
├── utils/
│   └── iptvData.js          # IPTV data transformer (loads src/assets/iptv-streams.json)
├── App.jsx                  # Route definitions
├── main.jsx                 # React root mount
└── index.css                # Global styles, Tailwind base, animations
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Marketing landing page |
| `/browse` | Browse | Live channel guide with country/category filters |
| `/watch/:slug` | Watch | Channel player with related channels |
| `/category/:name` | Category | All channels in a category |
| `/search` | Search | Full-text search across channels |
| `/pricing` | Pricing | 4-tier pricing with comparison table |
| `/profile` | Profile | Account details, subscription, devices |
| `/settings` | Settings | Playback & parental controls |
| `/signin` | SignIn | Sign in form |
| `/signup` | SignUp | Sign up form (plan pre-selection via `?plan=`) |
| `*` | NotFound | 404 — signal lost |

---

## Features

### Marketing Pages
- **Hero** with animated ChannelDial (GSAP cable-box flipper with pulsing "ON AIR" tally light)
- **Continue Watching** rail (persisted per-user via localStorage)
- **Trending Ticker** — infinite GSAP marquee of trending live shows
- **Live Grid** — EPG-style channel guide with category filters
- **Pricing** — 4 plans (Free, Starter, Signal, Broadcast) with monthly/annual toggle
- **Supported Devices** grid
- **FAQ** — animated accordion

### App Pages (authenticated)
- **Browse** — lazy-loaded channel grid with country selector, category filters, A-Z sort, search, infinite scroll
- **Watch** — HLS.js video player, quality selector, favorites, related channels, broadcast info sidebar
- **Search** — real-time full-text search by channel name, network, or category
- **Category** — filtered channel listing by category
- **Profile** — editable name/email, subscription card, connected devices, notification toggle
- **Settings** — autoplay, subtitles, data saver, default quality, parental PIN lock

### Auth System (Mock)
Accounts are stored in `localStorage` — **not secure**, for demo/development only. Replace `src/context/AuthContext.jsx` with real API calls when ready.

Demo credentials are seeded on first load:
- **Email:** `demo@streamoholic.tv`
- **Password:** `demo1234`

### Library System
- **My List** — save channels for later
- **Favorites** — mark channels as favorites
- **Continue Watching** — up to 12 recently watched channels, with timestamps
- All data stored per-user in `localStorage`

---

## Customization

### Tailwind Colors & Fonts
Defined in `tailwind.config.js`:
- **void** `#0B0D10` — main background
- **panel** `#14171C` — card backgrounds
- **panel2** `#1B1F26` — elevated surfaces
- **crimson** `#E4283A` — primary accent
- **amber** `#FFB020` — secondary accent
- **cyan** `#33E6C8` — highlight accent
- **paper** `#F2F1ED` — primary text
- **smoke** `#8A8F98` — muted text

Fonts: **Big Shoulders Display** (display), **Manrope** (body), **JetBrains Mono** (mono/code).

### Adding Real Channels
The `src/assets/iptv-streams.json` file contains IPTV channel data. The `src/utils/iptvData.js` transformer loads and filters it. Replace this with your real API endpoint.

Video playback uses publicly available HLS test streams (Mux, Apple) for demo purposes. Swap `primaryStream.url` with your actual stream URLs.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Framer Motion | 12 | Declarative animations |
| GSAP | 3.15 | Advanced animations (ChannelDial, ticker) |
| hls.js | 1.6 | HLS video playback |
| lucide-react | 1.24 | Icon library |
| oxlint | 1.71 | Linting |

---

## License

MIT