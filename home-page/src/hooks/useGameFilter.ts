import { useState, useCallback, useMemo, useEffect } from "react";
import { GAMES_LIST } from "../data/games";
import type { Game } from "../types/game";

interface CategorySplit {
  mainCategories: string[];
  otherCategories: string[];
}

interface UseGameFilterReturn extends CategorySplit {
  searchQuery: string;
  selectedCategory: string;
  filteredGames: Game[];
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  handleCategorySelect: (cat: string) => void;
  handleCategoryDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
}

/**
 * Helper to safely extract search parameter from URL query string.
 * Ignores template placeholders like {search_term_string}.
 */
function getInitialSearchQuery(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const q = params.get("search") || "";
  return q.startsWith("{") && q.endsWith("}") ? "" : q;
}

/**
 * Compute the category split once at module level — GAMES_LIST is static.
 * Top-3 most-populated categories go into main pills; the rest into a dropdown.
 */
const CATEGORY_SPLIT: CategorySplit = (() => {
  const counts: Record<string, number> = {};
  GAMES_LIST.forEach((game) => {
    counts[game.category] = (counts[game.category] || 0) + 1;
  });
  const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const top3 = sorted.slice(0, 3);
  return {
    mainCategories: ["All", ...top3],
    otherCategories: sorted.filter((cat) => !top3.includes(cat)),
  };
})();

/**
 * Custom hook that manages search query, category selection,
 * URL query param synchronization, and the derived filtered game list.
 */
export function useGameFilter(): UseGameFilterReturn {
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Keep state in sync if the user navigates back/forward in browser history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search") || "";
      setSearchQuery(query.startsWith("{") && query.endsWith("}") ? "" : query);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Sync search state to URL query parameter (?search=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const currentSearch = url.searchParams.get("search") || "";

    if (searchQuery) {
      if (currentSearch !== searchQuery) {
        url.searchParams.set("search", searchQuery);
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } else {
      if (url.searchParams.has("search")) {
        url.searchParams.delete("search");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    }
  }, [searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat);
  }, []);

  const handleCategoryDropdownChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val !== "MORE") setSelectedCategory(val);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
  }, []);

  const filteredGames = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return GAMES_LIST.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(lowerSearch) ||
        game.category.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return {
    searchQuery,
    selectedCategory,
    filteredGames,
    ...CATEGORY_SPLIT,
    setSearchQuery,
    setSelectedCategory,
    handleSearchChange,
    handleClearSearch,
    handleCategorySelect,
    handleCategoryDropdownChange,
    resetFilters,
  };
}
