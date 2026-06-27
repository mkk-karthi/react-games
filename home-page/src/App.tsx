import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Play, Sparkles, X, Clock } from "lucide-react";

import BackgroundEffects from "./components/BackgroundEffects";
import GameCard from "./components/GameCard";

// Game Thumbnail Imports
import ticTacToe from "./assets/tic-tac-toe.webp";
import memoryMatching from "./assets/memory-cards-matching.webp";
import snakeGame from "./assets/snake-game.webp";
import TwoZeroFourEightGame from "./assets/2048-game.webp";
import puzzleTetris from "./assets/puzzle-tetris.webp";
import blockBreaker from "./assets/block-breaker.webp";
import candyCrush from "./assets/candy-crush.webp";
import flappyBird from "./assets/flappy-bird.webp";
import bullseyeArchery from "./assets/bullseye-archery.webp";
import chess from "./assets/chess.webp";

interface Game {
  id: string;
  name: string;
  image: string;
  link: string;
  category: "Arcade" | "Puzzle" | "Strategy" | "Classic" | "Action";
  description: string;
  isNew?: boolean;
}

const GAMES_LIST: Game[] = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    image: ticTacToe,
    link: "tic-tac-toe",
    category: "Classic",
    description:
      "The classic grid battle of Xs and Os. Double-cross your opponent and claim the grid.",
  },
  {
    id: "memory-cards-matching",
    name: "Memory Match",
    image: memoryMatching,
    link: "memory-cards-matching",
    category: "Puzzle",
    description: "Match retro symbol cards to clean the board. Train your memory in speed runs.",
  },
  {
    id: "snake-game",
    name: "Snake",
    image: snakeGame,
    link: "snake-game",
    category: "Arcade",
    description:
      "Consume pixel bits, grow your digital tail, and survive a high-speed boundary crash.",
  },
  {
    id: "2048-game",
    name: "2048",
    image: TwoZeroFourEightGame,
    link: "2048-game",
    category: "Strategy",
    description:
      "Combine matching numbers to form the legendary 2048 tile. Pure mathematical strategy.",
  },
  {
    id: "puzzle-tetris",
    name: "Puzzle (Tetris)",
    image: puzzleTetris,
    link: "puzzle-tetris",
    category: "Puzzle",
    description: "Align dropping bricks to clean layers. Classic speed drop block stacking.",
  },
  {
    id: "block-breaker",
    name: "Block Breaker",
    image: blockBreaker,
    link: "block-breaker",
    category: "Arcade",
    description:
      "Reflect the ball and break grid structures. Capture drop power-ups to blast bricks.",
  },
  {
    id: "candy-crush",
    name: "Candy Crush",
    image: candyCrush,
    link: "candy-crush",
    category: "Puzzle",
    description:
      "Match rows of colorful candy sweets to generate score multipliers and clear levels.",
  },
  {
    id: "flappy-bird",
    name: "Flappy Bird",
    image: flappyBird,
    link: "flappy-bird",
    category: "Arcade",
    description: "Bounce through gap hazards in this reflex-demanding high-speed flapping test.",
  },
  {
    id: "bullseye-archery",
    name: "Bullseye Archery",
    image: bullseyeArchery,
    link: "bullseye-archery",
    category: "Action",
    description:
      "Pull, aim, adjust for wind direction, and launch your arrows directly into the bullseye.",
    isNew: true,
  },
  // {
  //   id: "rock-paper-scissors",
  //   name: "Rock Paper Scissors",
  //   image: rockPaperScissors,
  //   link: "rock-paper-scissors",
  //   category: "Classic",
  //   description: "Rival the computer system with quick decisions and psychological arcade predictions.",
  // },
  {
    id: "chess",
    name: "Chess",
    image: chess,
    link: "chess",
    category: "Strategy",
    description:
      "The ultimate command board. Devise checkmate tactics and capture opposing pieces.",
    isNew: true,
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>([]);

  // Dynamically compute all categories and split into main (top 3 + All) and other categories
  const { mainCategories, otherCategories } = useMemo(() => {
    const counts: Record<string, number> = {};
    GAMES_LIST.forEach((game) => {
      counts[game.category] = (counts[game.category] || 0) + 1;
    });

    const sortedCategories = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const top3 = sortedCategories.slice(0, 3);
    const main = ["All", ...top3];
    const other = sortedCategories.filter((cat) => !top3.includes(cat));

    return { mainCategories: main, otherCategories: other };
  }, []);

  // Load recently played from localStorage
  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem("mkk_recently_played_history");
      if (historyRaw) {
        setRecentlyPlayedIds(JSON.parse(historyRaw));
      }
    } catch (e) {
      console.error("Failed to load play history", e);
    }
  }, []);

  const handlePlayGame = (gameId: string) => {
    try {
      const historyRaw = localStorage.getItem("mkk_recently_played_history");
      let history: string[] = historyRaw ? JSON.parse(historyRaw) : [];

      // Filter out duplication and add to the top
      history = history.filter((id) => id !== gameId);
      history.unshift(gameId);
      history = history.slice(0, 5); // Keep up to 5 recently played games

      localStorage.setItem("mkk_recently_played_history", JSON.stringify(history));
      setRecentlyPlayedIds(history);
    } catch (e) {
      console.error("Failed to save play history", e);
    }
  };

  const recentlyPlayedGames = useMemo(() => {
    return recentlyPlayedIds
      .map((id) => GAMES_LIST.find((g) => g.id === id))
      .filter((g): g is Game => !!g && g.link !== "#");
  }, [recentlyPlayedIds]);

  // Feature Chess as the prominent spotlight game
  const featuredGame = useMemo(() => {
    return GAMES_LIST.find((game) => game.id === "chess") || GAMES_LIST[0];
  }, []);

  // Filtered Cabinets List
  const filteredAllGames = useMemo(() => {
    return GAMES_LIST.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
        <section className="relative p-4 overflow-hidden flex flex-col gap-8  ">
          {/* Decorative floating outline symbols */}
          <div className="absolute top-20 left-8 text-pink-500/20 text-3xl font-black select-none pointer-events-none animate-float-slow">
            ▲
          </div>
          <div
            className="absolute bottom-20 right-8 text-cyan-400/20 text-3xl font-black select-none pointer-events-none animate-float-slow"
            style={{ animationDelay: "-3s" }}
          >
            ◆
          </div>

          {/* Hero Core Branding Title */}
          <div className="flex flex-col items-center text-center gap-3 py-2 relative z-10 mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 uppercase drop-shadow-neon-pink animate-glitch">
              MKK Games Universe
            </h1>
            <p className="text-cyan-400/70 text-xs md:text-sm font-bold uppercase tracking-widest font-mono mt-1">
              Choose Your Challenge. Play. Compete. Conquer.
            </p>
          </div>

          {/* Search bar & filter pills with glowing edges */}
          <div className="w-full max-w-5xl mx-auto rounded-2xl bg-midnight/90 border border-purple-500/35 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-neon-purple z-20">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-purple-500" />
              <input
                type="text"
                placeholder="FIND CABINET..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-midnight border border-purple-500/40 focus:border-pink-500 focus:shadow-btn-pink text-white placeholder-white/30 text-xs font-bold tracking-wider outline-none transition-all uppercase"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Outline category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {mainCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-neon-pink"
                      : "bg-midnight border-purple-500/40 text-white/60 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-pill-cyan"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Other/More Dropdown Container (Select Box Style) */}
              {otherCategories.length > 0 && (
                <div className="relative">
                  <select
                    value={otherCategories.includes(selectedCategory) ? selectedCategory : "MORE"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val !== "MORE") {
                        setSelectedCategory(val);
                      }
                    }}
                    className={`appearance-none pl-4 pr-8 py-2 rounded-full text-xs font-black uppercase transition-all border cursor-pointer outline-none ${
                      otherCategories.includes(selectedCategory)
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white shadow-neon-pink"
                        : "bg-midnight border-purple-500/40 text-white/60 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-pill-cyan"
                    }`}
                  >
                    <option value="MORE" disabled className="bg-midnight text-white/45">
                      MORE
                    </option>
                    {otherCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-midnight text-white font-mono">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-white/60">
                    ▼
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* New Game Cabinet Spotlight */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-black tracking-widest text-pink-500 uppercase flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>NEW LAUNCHED CABINET</span>
          </h2>

          <div className="group relative rounded-3xl cyber-card overflow-hidden border border-pink-500/30 hover:border-cyan-400/50 shadow-neon-pink flex flex-col lg:flex-row h-auto lg:h-90 scanlines">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent lg:hidden z-10 pointer-events-none" />

            {/* Game Cover */}
            <div className="relative w-full lg:w-[58%] h-50 lg:h-full overflow-hidden order-1 lg:order-2">
              <img
                src={featuredGame.image}
                alt={featuredGame.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-midnight/20 to-midnight hidden lg:block pointer-events-none z-10" />
            </div>

            {/* Content Details */}
            <div className="relative z-20 w-full lg:w-[42%] p-8 md:p-10 flex flex-col justify-center gap-5 order-2 lg:order-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-3 py-0.5 rounded self-start shadow-pill-cyan">
                    {featuredGame.category}
                  </span>
                  {featuredGame.isNew && (
                    <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 rounded shadow-pill-pink animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-black tracking-wide text-white uppercase mt-1">
                  {featuredGame.name}
                </h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mt-1">
                  {featuredGame.description}
                </p>
              </div>

              {/* Convex Play button */}
              <a
                href={featuredGame.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => handlePlayGame(featuredGame.id)}
                className="relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-neon-pink self-start shadow-btn-spotlight active:scale-[0.98] border-t border-white/20 border-b border-black/40 arcade-btn-pulse"
              >
                <Play className="w-4 h-4 fill-current text-white animate-pulse" />
                <span>PLAY NOW</span>
              </a>
            </div>
          </div>
        </section>

        {/* All Cabinets Grid Catalog (1:1 Aspect Ratio cards) */}
        <section id="catalog-grid" className="flex flex-col gap-6 scroll-mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4 px-1">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                {selectedCategory === "All"
                  ? "ALL ARCADE CABINETS"
                  : `${selectedCategory} CABINETS`}
              </h2>
              <p className="text-xs text-white/50 uppercase tracking-widest font-mono">
                Total systems: {filteredAllGames.length}
              </p>
            </div>
          </div>

          {filteredAllGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8">
              {filteredAllGames.map((game) => (
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
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-cyan-400 hover:text-pink-500 transition-colors font-bold uppercase tracking-widest"
              >
                Reset Systems Filter
              </button>
            </div>
          )}
        </section>

        {/* Recently Played Section */}
        {recentlyPlayedGames.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-black tracking-widest text-cyan-400 uppercase flex items-center gap-2 px-1">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
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
