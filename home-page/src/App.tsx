// import { useEffect, useMemo, useRef } from "react";

import ticTacToe from "./assets/tic-tac-toe.png";
import rockPaperScissors from "./assets/rock-paper-scissors.png";
import memoryMatching from "./assets/memory-cards-matching.png";
import snakeGame from "./assets/snake-game.png";
import TwoZeroFourEightGame from "./assets/2048-game.png";
import puzzleTetris from "./assets/puzzle-tetris.png";
import blockBreaker from "./assets/block-breaker.png";

export default function App() {
  const gamesList = [
    {
      name: "Tic Tac Toe",
      image: ticTacToe,
      link: "tic-tac-toe",
    },
    {
      name: "Rock Paper Scissors",
      image: rockPaperScissors,
      link: "rock-paper-scissors",
    },
    {
      name: "Memory: Cards Matching",
      image: memoryMatching,
      link: "memory-cards-matching",
    },
    {
      name: "Snake",
      image: snakeGame,
      link: "snake-game",
    },
    {
      name: "2048",
      image: TwoZeroFourEightGame,
      link: "2048-game",
    },
    {
      name: "Puzzle (Tetris)",
      image: puzzleTetris,
      link: "puzzle-tetris",
    },
    {
      name: "Block Breaker",
      image: blockBreaker,
      link: "block-breaker",
    },
  ];

  return (
    <div
      className="bg-gray-800 p-8 min-w-screen min-h-screen flex justify-center items-center flex-col"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #101828, #101828 2px, transparent 4px, transparent 6px), radial-gradient(circle, #364153 0%, #1e2939 100%)",
        backgroundSize: "100vw 100vh",
      }}
    >
      <h1 className="font-semibold uppercase tracking-wide p-3 my-2 animate-bounce">
        <span className="text-2xl">🎮</span>
        <span className="text-3xl text-white align-sub mx-2">Mkk games</span>
        <span className="text-2xl">🎮</span>
      </h1>

      {/* <p className="text-3xl font-bold text-white uppercase text-center p-3 my-3">
        🎮 Mkk games 🎮
      </p> */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {gamesList.map((game, key) => (
          <div
            className="max-w-xs glass border border-white/10 rounded-lg shadow-sm flex flex-col"
            key={key}
          >
            <a href={game.link} target="_blank">
              <img
                className="m-[5%] rounded-lg w-[90%] border border-white/10"
                src={game.image}
                alt={game.name}
              />
            </a>
            <div className="px-2">
              <a href={game.link} target="_blank">
                <h5 className="text-xl font-semibold tracking-tight text-white text-center">
                  {game.name}
                </h5>
              </a>
            </div>
            <div className="text-center mt-auto p-3">
              <a
                href={game.link}
                target="_blank"
                className="text-white font-medium rounded-lg text-sm px-6 py-2 text-center bg-blue-600 hover:bg-blue-700"
              >
                Play Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
