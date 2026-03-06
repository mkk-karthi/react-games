import React from "react";

interface GameOverModalProps {
  score: number;
  targetScore: number;
  onTryAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, targetScore, onTryAgain }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md min-w-[80vw] md:min-w-[30vw]"
        style={{ animation: "modalIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
      >
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-4xl font-bold text-purple-600 mb-4">Game Over!</h2>
        <p className="text-2xl text-gray-700 mb-2">Final Score</p>
        <p className="text-5xl font-bold text-purple-600 mb-4">{score}</p>
        <p className="text-xl text-red-500 mb-4 font-bold">Target: {targetScore}</p>
        <button
          onClick={onTryAgain}
          className="candy-btn px-4 py-2 hover:scale-105 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

interface LevelCompleteModalProps {
  score: number;
  onNextLevel: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({ score, onNextLevel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center max-w-md min-w-[80vw] min-w-[30vw]"
        style={{ animation: "modalIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
      >
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-4xl font-bold text-purple-600 mb-4">Level Complete!</h2>
        <p className="text-2xl text-gray-700 mb-2">Score</p>
        <p className="text-5xl font-bold text-purple-600 mb-6">{score}</p>
        <button
          onClick={onNextLevel}
          className="candy-btn px-4 py-2 shadow-lg hover:scale-105 transition-all duration-200"
        >
          Next Level
        </button>
      </div>
    </div>
  );
};
