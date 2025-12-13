import type { GameStatus } from "../game";

export const BoardOverlay = ({
  status,
  onPrimary,
  onRestart,
  className,
}: {
  status: GameStatus;
  onPrimary: () => void;
  onRestart: () => void;
  className?: string;
}) => {
  if (status === "playing") return null;

  const isOver = status === "over";
  const label = isOver ? "↻ Restart" : status === "paused" ? "▶ Resume" : "🚀 Start";
  const title =
    status === "paused"
      ? "Paused beneath the waves 🌊"
      : isOver
      ? "💥 Game over — bubbles burst! 🫧"
      : "🐠 Ready to dive deep! 🌊";

  const description =
    status === "paused"
      ? "🐟 Take a breath, then resume your descent when ready! 💨"
      : isOver
      ? "🦈 Resurface and try again for a cleaner stack! 🌿"
      : "🌊 Press Enter or Space to begin dropping pieces! 🐠";

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className ?? ""}`}
    >
      <div className="pointer-events-auto max-w-sm rounded-2xl border border-white/15 bg-black/60 sm:bg-black/40 p-4 text-center shadow-bubble-glow backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-100/80">{status}</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-sky-100/80">{description}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onPrimary}
            className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-abyss shadow-glow transition hover:scale-[1.02]"
          >
            {label}
          </button>
          {isOver && (
            <button
              onClick={onRestart}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
