import { ScoreRecord } from "../types/game";

interface IntroScreenProps {
  startGame: () => void;
  scores: ScoreRecord[];
  showScores: boolean;
  setShowScores: (show: boolean | ((prev: boolean) => boolean)) => void;
  resetScores: () => void;
  maxArrows: number;
}

export default function IntroScreen({
  startGame,
  scores,
  showScores,
  setShowScores,
  resetScores,
  maxArrows,
}: IntroScreenProps) {
  return (
    <div className="absolute inset-0 flex items-start sm:items-center justify-center pointer-events-auto z-40 overflow-y-auto py-8 px-4 custom-scrollbar">
      <div className="my-auto animate-scale-in bg-gradient-to-br from-green-950/95 to-emerald-950/95 border-2 border-lime-500/40 rounded-3xl py-10 px-12 text-center max-w-md w-full backdrop-blur-lg shadow-[0_25px_65px_rgba(0,0,0,0.6)]">
        {/* TARGET LOGO */}
        <div className="flex justify-center mb-5">
          <svg width="100" height="100" viewBox="0 0 120 120" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <circle cx="60" cy="60" r="54" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <circle cx="60" cy="60" r="46" fill="#14532d" />
            <circle cx="60" cy="60" r="38" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="30" fill="#1d4ed8" stroke="#1e40af" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="22" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="6" fill="#dc2626" />
            <g transform="translate(60, 60) rotate(-45)">
              <line x1="0" y1="0" x2="50" y2="0" stroke="#783e0d" strokeWidth="2" strokeLinecap="round" />
              <polygon fill="#cbd5e1" points="0 0 6 2 6 -2" />
              <polygon fill="#10b981" points="50 0 42 -4 38 -4 44 0 38 4 42 4" />
            </g>
          </svg>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-yellow-500 font-serif tracking-wider uppercase drop-shadow-md">BULLSEYE</h1>
        <h2 className="text-base font-semibold text-emerald-400 font-serif tracking-[0.25em] uppercase mb-3">ARCHERY QUEST</h2>

        {/* DIVIDER */}
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-4" />

        {/* DESCRIPTION */}
        <p className="text-green-100/80 text-sm mb-6 leading-relaxed max-w-[320px] mx-auto">
          Shoot <span className="text-yellow-500 font-bold">{maxArrows} arrows</span> at the target within <span className="text-yellow-500 font-bold">60 seconds</span>. Drag the bow string to aim!
        </p>

        {/* SCORE LEGEND */}
        <div className="grid grid-cols-5 gap-1 mb-8">
          {[
            { color: "bg-red-500", score: "10", name: "Bullseye", scoreColor: "text-red-500" },
            { color: "bg-yellow-500", score: "7", name: "Gold", scoreColor: "text-yellow-500" },
            { color: "bg-lime-500", score: "5", name: "Green", scoreColor: "text-lime-500" },
            { color: "bg-blue-600", score: "4", name: "Blue", scoreColor: "text-blue-500" },
            { color: "bg-slate-300", score: "3", name: "Outer", scoreColor: "text-slate-300" }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-6 h-6 rounded-full ${item.color} mx-auto mb-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] border border-white/10`} />
              <div className={`text-[12px] font-extrabold ${item.scoreColor}`}>{item.score} pts</div>
              <div className="text-[10px] text-slate-400 leading-none mt-0.5">{item.name}</div>
            </div>
          ))}
        </div>

        <button
          onClick={startGame}
          className="w-full py-3.5 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white font-extrabold text-lg rounded-xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all transform duration-150 cursor-pointer"
        >
          🏹 Start Shooting
        </button>
        {scores.length > 0 && (
          <button
            onClick={() => setShowScores(s => !s)}
            className="mt-4 text-xs font-semibold text-green-400 border border-green-500/30 hover:border-green-400/50 rounded-lg px-4 py-1.5 transition-colors cursor-pointer"
          >
            {showScores ? "Hide" : "View"} High Scores
          </button>
        )}
        {showScores && scores.length > 0 && (
          <div className="mt-4 max-h-36 overflow-y-auto pr-1">
            {scores.map((sc, i) => (
              <div key={i} className={`flex justify-between py-1.5 border-b border-white/5 text-sm ${i === 0 ? "text-yellow-400" : "text-green-200/70"}`}>
                <span className="font-semibold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`} Score</span>
                <span className="font-bold">{sc.score} pts</span>
                <span className="text-xs text-white/40 font-mono mt-0.5">{sc.date}</span>
              </div>
            ))}
            <button onClick={resetScores} className="mt-3 text-xs text-red-400/60 hover:text-red-400 transition-colors cursor-pointer block mx-auto">Reset High Scores</button>
          </div>
        )}
      </div>
    </div>
  );
}
