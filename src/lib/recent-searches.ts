import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "districap.recent-searches.v1";
const MAX = 6;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => setRecent(read()), []);

  const add = useCallback((term: string) => {
    const value = term.trim();
    if (!value) return;
    const next = [value, ...read().filter((t) => t.toLowerCase() !== value.toLowerCase())].slice(
      0,
      MAX,
    );
    write(next);
    setRecent(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setRecent([]);
  }, []);

  return { recent, add, clear };
}
