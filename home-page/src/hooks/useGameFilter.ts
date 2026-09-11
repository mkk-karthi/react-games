import { useState, useCallback, useMemo } from "react";
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
  handleCategorySelect: (cat: string) => void;
  handleCategoryDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
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
 * and the derived filtered game list.
 */
export function useGameFilter(): UseGameFilterReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    handleCategorySelect,
    handleCategoryDropdownChange,
    resetFilters,
  };
}
