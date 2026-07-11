// IPTV Data Transformer
// Transforms raw iptv-streams.json into app-ready format with BD default

import rawData from '../assets/iptv-streams.json';

// Extract unique countries with channel counts
export function getCountries() {
  const countryMap = new Map();

  rawData.channels.forEach(channel => {
    const { code, name, flag } = channel.country;
    if (!countryMap.has(code)) {
      countryMap.set(code, { code, name, flag, count: 0 });
    }
    countryMap.get(code).count++;
  });

  return Array.from(countryMap.values())
    .sort((a, b) => b.count - a.count);
}

// Get channels filtered by country (default: BD)
export function getChannels(countryCode = 'BD', category = 'All') {
  let channels = rawData.channels;

  // Filter by country
  if (countryCode && countryCode !== 'All') {
    channels = channels.filter(c => c.country.code === countryCode);
  }

  // Filter by category
  if (category && category !== 'All') {
    channels = channels.filter(c =>
      c.categories.some(cat => cat.name === category)
    );
  }

  return channels.map(channel => transformChannel(channel));
}

// Transform raw channel to app format
export function transformChannel(raw) {
  // Collect all streams from all feeds with quality info
  const allStreams = [];

  raw.feeds?.forEach(feed => {
    feed.streams?.forEach(stream => {
      if (stream.url) {
        allStreams.push({
          url: stream.url,
          quality: stream.quality || feed.format || 'Unknown',
          label: stream.label || feed.name,
          feedId: feed.id,
          feedName: feed.name,
          referrer: stream.referrer,
          userAgent: stream.user_agent,
        });
      }
    });
  });

  // Sort by quality (prefer higher quality)
  allStreams.sort((a, b) => {
    const qualityOrder = ['4K', '1080p', '720p', '576p', '480p', '360p', '240p', 'Unknown'];
    const aIndex = qualityOrder.indexOf(a.quality);
    const bIndex = qualityOrder.indexOf(b.quality);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  // Get unique qualities from streams
  const qualities = [...new Set(allStreams.map(s => s.quality))];

  // Get primary stream (best quality)
  const primaryStream = allStreams[0] || null;

  return {
    id: raw.id,
    name: raw.name,
    altNames: raw.alt_names || [],
    network: raw.network,
    country: raw.country,
    categories: raw.categories || [],
    logo: raw.logo?.url || null,
    website: raw.website,
    isNsfw: raw.is_nsfw,
    languages: raw.feeds?.[0]?.languages || [],
    feeds: raw.feeds || [],
    allStreams,
    qualities,
    primaryStream,
    currentStream: primaryStream,
    currentQuality: primaryStream?.quality || null,
  };
}

// Get channel by ID
export function getChannelById(id) {
  const raw = rawData.channels.find(c => c.id === id);
  return raw ? transformChannel(raw) : null;
}

// Get categories for a country
export function getCategories(countryCode = 'BD') {
  const channels = countryCode === 'All'
    ? rawData.channels
    : rawData.channels.filter(c => c.country.code === countryCode);

  const categoryMap = new Map();
  categoryMap.set('All', { id: 'all', name: 'All' });

  channels.forEach(channel => {
    channel.categories?.forEach(cat => {
      if (!categoryMap.has(cat.id)) {
        categoryMap.set(cat.id, cat);
      }
    });
  });

  return Array.from(categoryMap.values());
}

// Get unique languages
export function getLanguages(countryCode = 'BD') {
  const channels = countryCode === 'All'
    ? rawData.channels
    : rawData.channels.filter(c => c.country.code === countryCode);

  const langMap = new Map();

  channels.forEach(channel => {
    channel.feeds?.forEach(feed => {
      feed.languages?.forEach(lang => {
        if (!langMap.has(lang.code)) {
          langMap.set(lang.code, lang);
        }
      });
    });
  });

  return Array.from(langMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Filter streams by quality
export function getStreamsByQuality(channel, quality) {
  return channel.allStreams.filter(s => s.quality === quality);
}

// Get all available countries with flags
export const countries = getCountries();

// Fallback default (Bangladesh)
export const FALLBACK_COUNTRY = 'BD';

// Detect user's country via IP geolocation
// Caches result in sessionStorage to avoid repeated API calls
export async function detectUserCountry() {
  const cacheKey = 'streamoholic_detected_country';

  // Check cache first (sessionStorage persists across page loads but not tabs)
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    // Using ipapi.co free API (no API key required, 1000 req/day)
    const res = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    });
    if (!res.ok) throw new Error('Geolocation API error');

    const data = await res.json();
    const userCountryCode = data?.country_code;

    // Check if we have this country in our available countries
    if (userCountryCode && countries.some(c => c.code === userCountryCode)) {
      sessionStorage.setItem(cacheKey, userCountryCode);
      return userCountryCode;
    }
  } catch (err) {
    console.warn('Could not detect user location, using default:', err.message);
  }

  // Fallback to BD
  sessionStorage.setItem(cacheKey, FALLBACK_COUNTRY);
  return FALLBACK_COUNTRY;
}

// Hook to detect and use the user's country
// Usage: const { country, loading } = useUserCountry()
import { useState, useEffect } from 'react';

export function useUserCountry() {
  const [country, setCountry] = useState(FALLBACK_COUNTRY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectUserCountry().then((detected) => {
      setCountry(detected);
      setLoading(false);
    });
  }, []);

  return { country, loading };
}

// DEFAULT_COUNTRY kept for backward compatibility (static)
export const DEFAULT_COUNTRY = FALLBACK_COUNTRY;