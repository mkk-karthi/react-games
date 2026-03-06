import React from "react";

interface ScoreBoardProps {
  level: number;
  targetScore: number;
  score: number;
  moves: number;
  isMuted: boolean;
  onReset: () => void;
  onToggleMute: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  level,
  targetScore,
  score,
  moves,
  isMuted,
  onReset,
  onToggleMute,
}) => {
  return (
    <div className="w-full md:w-auto order-2 md:order-1 shadow-2xl bg-white/20 backdrop-blur-xl rounded-3xl border-4 border-white/50 p-4 relative">
      <div className="flex justify-between items-center w-full mb-3 px-4 text-white font-bold text-sm md:text-xl drop-shadow-md bg-green-500/60 rounded-full py-1.5 md:py-2 border-2 border-white/40">
        <div>Level {level + 1}</div>
        <div>Target: {targetScore}</div>
      </div>

      {/* Score and Moves */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-2 md:mb-4 text-center px-1">
        <div
          className="rounded-2xl px-2 py-3 md:py-4 shadow-inner border-2 border-red-500/40"
          style={{
            background:
              "linear-gradient(var(--color-red-400) 0%, var(--color-red-300) 30%, var(--color-red-400) 70%)",
          }}
        >
          <div className="text-white/90 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">
            Score
          </div>
          <div className="text-2xl md:text-3xl font-black text-white drop-shadow-md">{score}</div>
        </div>
        <div
          className="rounded-2xl px-2 py-3 md:py-4 shadow-inner border-2 border-orange-500/40"
          style={{
            background:
              "linear-gradient(var(--color-orange-400) 0%, var(--color-orange-300) 30%, var(--color-orange-400) 70%)",
          }}
        >
          <div className="text-white/90 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">
            Moves
          </div>
          <div className="text-2xl md:text-3xl font-black text-white drop-shadow-md">{moves}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <button onClick={onReset} className="candy-btn m-2 py-2 px-4 text-lg">
          New Game
        </button>
        <button
          onClick={onToggleMute}
          className="candy-btn m-2 py-2 px-4 text-lg"
          style={{
            background: "linear-gradient(to bottom, #a072c4, #874ab3)",
            boxShadow: "0 6px 0 #602b85, 0 8px 15px rgba(126, 68, 173, 0.4)",
            borderColor: "white",
          }}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
};
