import React from "react";
import type { GameState } from "../../types/game";

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
  onResume: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  onPause,
  onResume,
  onToggleMute,
  isMuted,
}) => {
  return (
    <div className="p-4 flex justify-between items-center text-white z-10 game-element gap-2 lg:flex-col">
      {/* Left side - Score and Lives */}
      <div className="glass-effect min-w-[6rem] min-h-[4.5rem] py-2 rounded-lg text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Score</div>
        <div className="text-2xl font-bold text-glow text-neon-blue">{gameState.score}</div>
      </div>

      <div className="glass-effect min-w-[6rem] min-h-[4.5rem] py-2 rounded-lg text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Lives</div>
        <div className="flex gap-1 py-3 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < gameState.lives ? "bg-neon-pink shadow-lg" : "bg-gray-700"
              }`}
              style={{
                boxShadow: i < gameState.lives ? "0 0 10px rgba(255, 0, 110, 0.8)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Center - Level */}
      <div className="glass-effect min-w-[6rem] min-h-[4.5rem] py-2 rounded-lg text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Level</div>
        <div className="text-2xl font-bold text-glow text-neon-purple">{gameState.level}</div>
      </div>

      <div className="flex gap-2">
        {/* Pause/Resume button */}
        {gameState.gameStatus === "playing" && (
          <button
            onClick={onPause}
            className="glass-effect px-2 flex justify-center py-2 rounded-lg hover:bg-white/10 transition-all text-neon-blue"
          >
            <svg className="w-8 h-8 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          </button>
        )}

        {gameState.gameStatus === "paused" && (
          <button
            onClick={onResume}
            className="glass-effect px-2 flex justify-center py-2 rounded-lg hover:bg-white/10 transition-all text-neon-green"
          >
            <svg className="w-8 h-8 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          </button>
        )}

        {/* Mute button */}
        <button
          onClick={onToggleMute}
          className="glass-effect px-2 flex justify-center py-2 rounded-lg hover:bg-white/10 transition-all text-neon-yellow"
        >
          {isMuted ? (
            <svg className="w-8 h-8 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-8 h-8 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
