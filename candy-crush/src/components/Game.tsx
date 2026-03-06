import React from "react";
import { FallingCandies } from "./FallingCandies";
import { ScoreBoard } from "./ScoreBoard";
import { GameBoard } from "./GameBoard";
import { GameOverModal, LevelCompleteModal } from "./Modals";
import { useGameState } from "../hooks/useGameState";

export const Game: React.FC = () => {
  const {
    gameState,
    swappingCandies,
    invalidSwap,
    isMuted,
    handleCandyClick,
    handleCandySwipe,
    resetGame,
    handleNextLevel,
    toggleMute,
  } = useGameState();

  return (
    <div className="h-[100dvh] w-screen overflow-hidden candy-bg relative">
      <FallingCandies />

      {/* Game Title: Centered at Top */}
      <div className="z-20 w-full text-center pointer-events-none drop-shadow-2xl pt-4">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white animate-bounce-slow inline-block"
          style={{
            textShadow:
              "3px 6px 8px rgba(217, 61, 124, 0.7), -3px -3px 0 #ff89b4, 3px -3px 0 #ff89b4, -3px 3px 0 #ff89b4, 3px 3px 0 #ff89b4, 3px 0 0 #ff89b4, -3px 0 0 #ff89b4, 0 3px 0 #ff89b4, 0 -3px 0 #ff89b4",
          }}
        >
          Candy Crush
        </h1>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 w-full max-w-7xl flex flex-col md:flex-row items-center justify-center p-2 md:p-6 gap-2 md:gap-12 min-h-0 z-10">
        <ScoreBoard
          level={gameState.currentLevel}
          targetScore={gameState.targetScore}
          score={gameState.score}
          moves={gameState.moves}
          isMuted={isMuted}
          onReset={resetGame}
          onToggleMute={toggleMute}
        />

        <GameBoard
          board={gameState.board}
          selectedCandy={gameState.selectedCandy}
          swappingCandies={swappingCandies}
          invalidSwap={invalidSwap}
          onCandyClick={handleCandyClick}
          onCandySwipe={handleCandySwipe}
        />
      </div>

      {gameState.gameOver && (
        <GameOverModal
          score={gameState.score}
          targetScore={gameState.targetScore}
          onTryAgain={resetGame}
        />
      )}

      {gameState.levelComplete && (
        <LevelCompleteModal score={gameState.score} onNextLevel={handleNextLevel} />
      )}
    </div>
  );
};
