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

// Default to Bangladesh
export const DEFAULT_COUNTRY = 'BD';