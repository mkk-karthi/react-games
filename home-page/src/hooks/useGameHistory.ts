import { useState, useEffect, useCallback, useMemo } from "react";
import { GAMES_LIST } from "../data/games";
import type { Game } from "../types/game";

const STORAGE_KEY = "mkk_recently_played_history";
const MAX_HISTORY = 5;

interface UseGameHistoryReturn {
  recentlyPlayedGames: Game[];
  handlePlayGame: (gameId: string) => void;
}

/**
 * Custom hook that manages the "recently played" game history.
 * Reads from and writes to localStorage, and keeps local state in sync.
 */
export function useGameHistory(): UseGameHistoryReturn {
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>(() => {
    // Lazy initializer — runs only once on mount, avoids a separate useEffect
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever the list changes (after the initial load)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyPlayedIds));
    } catch (e) {
      console.error("Failed to persist play history", e);
    }
  }, [recentlyPlayedIds]);

  const handlePlayGame = useCallback((gameId: string) => {
    setRecentlyPlayedIds((prev) => {
      const filtered = prev.filter((id) => id !== gameId);
      return [gameId, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const recentlyPlayedGames = useMemo(
    () =>
      recentlyPlayedIds
        .map((id) => GAMES_LIST.find((g) => g.id === id))
        .filter((g): g is Game => !!g && g.link !== "#"),
    [recentlyPlayedIds],
  );

  return { recentlyPlayedGames, handlePlayGame };
}
