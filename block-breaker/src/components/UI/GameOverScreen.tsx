import React from "react";

interface GameOverScreenProps {
  score: number;
  isVictory: boolean;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, isVictory, onRestart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 game-element">
      <div className="glass-effect p-8 rounded-2xl max-w-md mx-4 text-center animate-float">
        <h1 className={`text-4xl font-bold mb-4`}>
          {isVictory ? "🎉 " : "💥 "}
          <span
            className={`${
              isVictory
                ? "bg-gradient-to-r from-neon-green via-neon-yellow to-neon-green"
                : "bg-gradient-to-r from-neon-pink via-neon-purple to-neon-pink"
            } text-glow bg-clip-text text-transparent`}
          >
            {isVictory ? "Victory!" : "Game Over"}
          </span>
        </h1>

        <p className="text-gray-300 mb-6">
          {isVictory ? "Congratulations! You cleared all the blocks!" : "Better luck next time!"}
        </p>

        <div className="mb-8 p-6 glass-effect rounded-lg">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Final Score</div>
          <div className="text-5xl font-bold text-glow text-neon-blue">{score}</div>
        </div>

        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-lg font-bold text-lg neon-border border-neon-green text-neon-green hover:bg-neon-green/20 transition-all transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
