import { memo } from "react";
import { motion } from "framer-motion";
import { Search, Play, Sparkles, X, Clock, RotateCcw } from "lucide-react";

import BackgroundEffects from "./components/BackgroundEffects";
import GameCard from "./components/GameCard";
import { useGameHistory } from "./hooks/useGameHistory";
import { useGameFilter } from "./hooks/useGameFilter";
import { FEATURED_GAME } from "./data/games";

// ---------------------------------------------------------------------------
// Spotlight section (memoized — only re-renders if featuredGame identity changes)
// ---------------------------------------------------------------------------
const FeaturedSpotlight = memo(function FeaturedSpotlight({
  onPlay,
}: {
  onPlay: (id: string) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-black tracking-widest text-pink-500 uppercase flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        <span>NEW LAUNCHED CABINET</span>
      </h2>

      <div className="group relative rounded-3xl cyber-card overflow-hidden border border-pink-500/30 hover:border-cyan-400/50 shadow-neon-pink flex flex-col lg:flex-row h-auto lg:h-90 scanlines">
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/2 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-midnight via-midnight/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/20 to-transparent lg:hidden z-10 pointer-events-none" />

        {/* Game Cover */}
        <div className="relative w-full lg:w-[58%] h-50 lg:h-full overflow-hidden order-1 lg:order-2">
          <img
            src={FEATURED_GAME.image}
            alt={FEATURED_GAME.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
            width={800}
            height={450}
          />
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-midnight/20 to-midnight hidden lg:block pointer-events-none z-10" />
        </div>

        {/* Content Details */}
        <div className="relative z-20 w-full lg:w-[42%] p-8 md:p-10 flex flex-col justify-center gap-5 order-2 lg:order-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-3 py-0.5 rounded self-start shadow-pill-cyan">
                {FEATURED_GAME.category}
              </span>
              {FEATURED_GAME.isNew && (
                <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 rounded shadow-pill-pink animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <h3 className="text-3xl font-black tracking-wide text-white uppercase mt-1">
              {FEATURED_GAME.name}
            </h3>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed mt-1">
              {FEATURED_GAME.description}
            </p>
          </div>

          {/* Convex Play button */}
          <a
            href={FEATURED_GAME.link}
            target="_blank"
            rel="noreferrer"
            onClick={() => onPlay(FEATURED_GAME.id)}
            aria-label={`Play ${FEATURED_GAME.name}`}
            className="relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all duration-300 bg-linear-to-r from-pink-500 to-purple-500 hover:shadow-neon-pink self-start shadow-btn-spotlight active:scale-[0.98] border-t border-b border-black/40 arcade-btn-pulse"
          >
            <Play className="w-4 h-4 fill-current text-white animate-pulse" />
            <span>PLAY NOW</span>
          </a>
        </div>
      </div>
    </section>
  );
});

// ---------------------------------------------------------------------------
// App — composed from hooks, slim JSX
// ---------------------------------------------------------------------------
export default function App() {
  const { recentlyPlayedGames, handlePlayGame } = useGameHistory();
  const {
    searchQuery,
    selectedCategory,
    filteredGames,
    mainCategories,
    otherCategories,
    handleSearchChange,
    handleCategorySelect,
    handleCategoryDropdownChange,
    resetFilters,
  } = useGameFilter();

  return (
    <div className="relative min-h-screen text-white select-none overflow-hidden">
      {/* Perspective Grid Background & Neon Blends */}
      <BackgroundEffects />

      {/* Main Container */}
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto px-4 md:px-8 py-8 max-w-dvw w-full flex flex-col gap-10"
      >
        {/* Header & Hero */}
        <section className="relative p-4 overflow-hidden flex flex-col gap-4">
          {/* Decorative floating outline symbols */}
          <div className="absolute top-10 left-8 text-pink-500/20 text-3xl font-black select-none pointer-events-none animate-float-slow">
            ▲
          </div>
          <div
            className="absolute bottom-4 right-8 text-cyan-400/20 text-3xl font-black select-none pointer-events-none animate-float-slow"
            style={{ animationDelay: "-3s" }}
          >
            ◆
          </div>

          {/* Hero Core Branding Title */}
          <div className="flex flex-col items-center text-center gap-3 py-4 relative z-10 mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-cyan-400 uppercase drop-shadow-neon-pink animate-glitch">
              MKK Games Universe
            </h1>
            <p className="text-cyan-400/70 text-xs md:text-sm font-bold uppercase tracking-widest font-mono mt-1">
              Choose Your Challenge. Play. Compete. Conquer.
            </p>
          </div>
        </section>

        {/* New Game Cabinet Spotlight */}
        <FeaturedSpotlight onPlay={handlePlayGame} />

        {/* All Cabinets Grid Catalog (1:1 Aspect Ratio cards) */}
        <section
          id="catalog-grid"
          className="flex flex-col gap-6 scroll-mt-6"
          aria-label="Game catalog"
        >
          {/* Section Header & Active Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-cyan-glow-md animate-pulse"
                aria-hidden="true"
              />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                {selectedCategory === "All"
                  ? "ALL ARCADE CABINETS"
                  : `${selectedCategory} CABINETS`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 shadow-pill-cyan">
                {filteredGames.length} {filteredGames.length === 1 ? "SYSTEM" : "SYSTEMS"}
              </span>
            </div>

            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-pink-400 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 shadow-pill-pink transition-all cursor-pointer self-start sm:self-auto active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Arcade Command Deck (Search & Category Filter Bar) */}
          <div
            role="search"
            className="group relative w-full rounded-2xl p-3 md:p-3.5 border border-purple-500/30 hover:border-pink-500/40 shadow-neon-purple hover:shadow-neon-pink flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between z-20 backdrop-blur-xl"
          >
            {/* Arcade Corner Highlights */}
            <div
              className="absolute top-1.5 left-1.5 w-1 h-1 bg-cyan-400 shadow-cyan-glow-sm rounded-full z-20"
              aria-hidden="true"
            />
            <div
              className="absolute top-1.5 right-1.5 w-1 h-1 bg-pink-500 shadow-pink-glow-sm rounded-full z-20"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-1.5 left-1.5 w-1 h-1 bg-pink-500 shadow-pink-glow-sm rounded-full z-20"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-cyan-400 shadow-cyan-glow-sm rounded-full z-20"
              aria-hidden="true"
            />

            {/* Cyber screen subtle reflection */}
            <div
              className="absolute inset-0 bg-linear-to-tr from-transparent via-white/1.5 to-transparent pointer-events-none rounded-2xl"
              aria-hidden="true"
            />

            {/* Search Input Box */}
            <div className="relative w-full md:w-72 lg:w-80 shrink-0">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 transition-colors group-focus-within:text-pink-400"
                aria-hidden="true"
              />
              <input
                id="game-search"
                type="search"
                placeholder="FIND CABINET..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search games"
                className="w-full h-10 pl-10 pr-9 rounded-xl bg-midnight/90 border border-purple-500/40 focus:border-pink-500 focus:shadow-btn-pink text-white placeholder-white/35 text-xs font-bold tracking-wider outline-none transition-all uppercase"
              />
              {searchQuery && (
                <button
                  onClick={resetFilters}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-white transition-colors cursor-pointer p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills & Selector */}
            <div
              className="flex flex-wrap items-center justify-start md:justify-end gap-1.5 sm:gap-2"
              role="group"
              aria-label="Filter by category"
            >
              {mainCategories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${cat}`}
                    className={`h-10 px-3.5 sm:px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border cursor-pointer inline-flex items-center justify-center ${
                      isActive
                        ? "bg-linear-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-neon-pink scale-[1.03]"
                        : "bg-midnight/70 border-purple-500/30 text-white/60 hover:border-cyan-400/60 hover:text-cyan-400 hover:shadow-pill-cyan active:scale-95"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              {/* Other/More Dropdown Container */}
              {otherCategories.length > 0 && (
                <div className="relative">
                  <select
                    value={otherCategories.includes(selectedCategory) ? selectedCategory : "MORE"}
                    onChange={handleCategoryDropdownChange}
                    aria-label="More categories"
                    className={`h-10 appearance-none pl-3.5 pr-8 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer outline-none inline-flex items-center ${
                      otherCategories.includes(selectedCategory)
                        ? "bg-linear-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-neon-pink"
                        : "bg-midnight/70 border-purple-500/30 text-white/60 hover:border-cyan-400/60 hover:text-cyan-400 hover:shadow-pill-cyan"
                    }`}
                  >
                    <option value="MORE" disabled className="bg-midnight text-white/45 font-sans">
                      MORE...
                    </option>
                    {otherCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-midnight text-white font-sans">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-white/60"
                    aria-hidden="true"
                  >
                    ▼
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  name={game.name}
                  image={game.image}
                  link={game.link}
                  category={game.category}
                  description={game.description}
                  isNew={game.isNew}
                  onPlay={() => handlePlayGame(game.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-midnight/80 border border-purple-500/30 py-16 text-center text-white/40 flex flex-col items-center justify-center gap-3">
              <p className="text-sm font-bold uppercase tracking-wider">No cabinets match filter</p>
              <button
                onClick={resetFilters}
                className="text-xs text-cyan-400 hover:text-pink-500 transition-colors font-bold uppercase tracking-widest"
              >
                Reset Systems Filter
              </button>
            </div>
          )}
        </section>

        {/* Recently Played Section */}
        {recentlyPlayedGames.length > 0 && (
          <section className="flex flex-col gap-4" aria-label="Recently played games">
            <h2 className="text-sm font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2 px-1">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" aria-hidden="true" />
              <span>RECENTLY PLAYED</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8">
              {recentlyPlayedGames.map((game) => (
                <GameCard
                  key={`recent-${game.id}`}
                  name={game.name}
                  image={game.image}
                  link={game.link}
                  category={game.category}
                  description={game.description}
                  isNew={game.isNew}
                  onPlay={() => handlePlayGame(game.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-purple-500/20 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/45 font-mono uppercase tracking-widest">
          <div>
            <span>© {new Date().getFullYear()} MKK Creation. All rights reserved.</span>
          </div>
        </footer>
      </motion.main>
    </div>
  );
}
