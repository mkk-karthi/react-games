import type { Game } from "../types/game";

// Game Thumbnail Imports
import ticTacToe from "../assets/tic-tac-toe.webp";
import memoryMatching from "../assets/memory-cards-matching.webp";
import snakeGame from "../assets/snake-game.webp";
import TwoZeroFourEightGame from "../assets/2048-game.webp";
import puzzleTetris from "../assets/puzzle-tetris.webp";
import blockBreaker from "../assets/block-breaker.webp";
import candyCrush from "../assets/candy-crush.webp";
import flappyBird from "../assets/flappy-bird.webp";
import bullseyeArchery from "../assets/bullseye-archery.webp";
import chess from "../assets/chess.webp";

/**
 * Static master list of all games in the catalog.
 * Defined outside of any component so it is never re-created on re-renders.
 */
export const GAMES_LIST: Game[] = [
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

/**
 * The featured/spotlight game shown at the top of the page.
 * Derived once at module load time — no useMemo needed.
 */
export const FEATURED_GAME: Game =
  GAMES_LIST.find((game) => game.id === "chess") ?? GAMES_LIST[0];
