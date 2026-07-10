import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext(null);
const KEY_PREFIX = "streamoholic_library_";

function loadFor(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY_PREFIX + key));
    return parsed || { myList: [], continueWatching: [], favorites: [] };
  } catch {
    return { myList: [], continueWatching: [], favorites: [] };
  }
}

export function LibraryProvider({ children }) {
  const { user } = useAuth();
  const scope = user?.email || "guest";
  const [library, setLibrary] = useState(() => loadFor(scope));
  const [activeStream, setActiveStream] = useState(null);

  // Reload when the signed-in user changes (sign in / out / switch).
  useEffect(() => {
    setLibrary(loadFor(scope));
  }, [scope]);

  const persist = useCallback(
    (next) => {
      setLibrary(next);
      localStorage.setItem(KEY_PREFIX + scope, JSON.stringify(next));
    },
    [scope]
  );

  const isInList = (channelId) => library.myList.includes(channelId);

  const toggleMyList = (channelId) => {
    const inList = library.myList.includes(channelId);
    const myList = inList ? library.myList.filter((id) => id !== channelId) : [channelId, ...library.myList];
    persist({ ...library, myList });
  };

  const isFavorite = (channelId) => library.favorites.includes(channelId);

  const toggleFavorite = (channelId) => {
    const inFav = library.favorites.includes(channelId);
    const favorites = inFav
      ? library.favorites.filter((id) => id !== channelId)
      : [channelId, ...library.favorites];
    persist({ ...library, favorites });
  };

  const recordWatch = (channelId) => {
    const existing = library.continueWatching.filter((w) => w.channelId !== channelId);
    const continueWatching = [{ channelId, watchedAt: Date.now() }, ...existing].slice(0, 12);
    persist({ ...library, continueWatching });
  };

  const clearWatch = (channelId) => {
    persist({ ...library, continueWatching: library.continueWatching.filter((w) => w.channelId !== channelId) });
  };

  return (
    <LibraryContext.Provider
      value={{
        library,
        isInList,
        toggleMyList,
        isFavorite,
        toggleFavorite,
        recordWatch,
        clearWatch,
        activeStream,
        setActiveStream,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
