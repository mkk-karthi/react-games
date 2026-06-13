import { useState } from "react";
import { ScoreRecord } from "../types/game";

interface GameOverScreenProps {
  finalScore: number;
  endReason: "arrows" | "timer";
  scores: ScoreRecord[];
  startGame: () => void;
  resetScores: () => void;
  onSaveScore: (name: string) => void;
  scoreSaved: boolean;
}

export default function GameOverScreen({
  finalScore,
  endReason,
  scores,
  startGame,
  resetScores,
  onSaveScore,
  scoreSaved,
}: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    const trimmed = playerName.trim();
    if (!trimmed) return;
    setSaving(true);
    onSaveScore(trimmed);
  }

  const emoji = finalScore >= 70 ? "🏆" : finalScore >= 40 ? "🎉" : "😅";
  const tagline =
    finalScore >= 80 ? "🎯 Legendary master archer!" :
    finalScore >= 60 ? "🏹 Excellent precision shooting!" :
    finalScore >= 40 ? "👍 Decent round, keep practicing!" :
    "🌱 A fresh sprout, draw again!";

  return (
    <div className="absolute inset-0 flex items-start sm:items-center justify-center pointer-events-auto z-40 overflow-y-auto py-8 px-4 custom-scrollbar">
      <div className="my-auto bg-gradient-to-br from-green-950/95 to-emerald-950/95 border-2 border-lime-500/40 rounded-3xl py-6 px-8 sm:py-9 sm:px-11 text-center max-w-md w-full backdrop-blur-xl shadow-[0_28px_72px_rgba(0,0,0,0.65)]">
        {/* Header */}
        <div className="text-5xl mb-1.5">{emoji}</div>
        <h2 className="text-3xl font-extrabold text-green-400 font-serif tracking-wide">Game Over</h2>
        <div className="text-xs uppercase tracking-widest text-green-300/50 font-bold mt-1 mb-3">
          {endReason === "timer" ? "⏱️ Timer Expired!" : "🏹 All Arrows Shot!"}
        </div>

        {/* Score display */}
        <div className="text-6xl font-black text-yellow-400 my-3 font-serif drop-shadow-[0_2px_20px_rgba(251,191,36,0.35)]">{finalScore}</div>
        <div className="text-sm font-semibold text-green-200/50 mb-1">Total Points</div>
        <div className="text-green-300/65 text-sm mb-5 italic">{tagline}</div>

        {/* ── NAME INPUT FORM (only shown before saving) ── */}
        {!scoreSaved && finalScore > 0 && (
          <div className="mb-5">
            <div className="text-xs uppercase tracking-widest text-green-400/70 font-bold mb-3">
              📝 Save Your Score
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSave()}
                placeholder="Enter your name…"
                maxLength={20}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none border-2 transition-all bg-white/5 text-white font-sans ${
                  playerName.trim() ? "border-lime-500/70" : "border-white/10"
                }`}
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={!playerName.trim() || saving}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none text-white ${
                  playerName.trim()
                    ? "bg-gradient-to-br from-lime-500 to-green-700 shadow-[0_4px_16px_rgba(132,204,22,0.35)]"
                    : "bg-white/10 shadow-none"
                }`}
              >
                {saving ? "✓" : "Save"}
              </button>
            </div>
            <p className="text-xs text-white/25 mt-2">Press Enter or click Save to record your score</p>
          </div>
        )}

        {/* Saved confirmation */}
        {scoreSaved && (
          <div className="mb-5 py-2.5 px-4 rounded-xl text-sm font-semibold text-lime-400 border border-lime-500/30 bg-lime-500/5">
            ✅ Score saved to leaderboard!
          </div>
        )}

        {/* ── LEADERBOARD (SCROLLABLE) ── */}
        {scores.length > 0 && (
          <div className="mb-5 bg-white/5 border border-white/5 rounded-xl p-4 text-left">
            <div className="text-xs uppercase tracking-wider text-green-400/60 font-bold mb-3">🏆 Leaderboard</div>
            <div className="max-h-32 overflow-y-auto pr-1.5 space-y-1 custom-scrollbar">
              {scores.map((sc, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-1.5 border-b border-white/5 text-xs gap-2 ${
                    i === 0 ? "text-yellow-400" : "text-green-200/65"
                  }`}
                >
                  <span className="font-bold w-6 text-center shrink-0">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                  </span>
                  <span className="flex-1 text-left font-semibold truncate max-w-32">
                    {sc.name || "Anonymous"}
                  </span>
                  <span className="font-bold">{sc.score} pts</span>
                  <span className="text-white/25 font-mono shrink-0">{sc.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-3 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white font-extrabold rounded-xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all cursor-pointer"
          >
            🏹 Play Again
          </button>
          <button
            onClick={resetScores}
            className="px-5 py-3 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
