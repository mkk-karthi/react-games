export const MobileControls = ({
  primaryLabel,
  handlePrimary,
  moveLeft,
  moveRight,
  hardDrop,
  rotateCW,
  restart,
}: {
  primaryLabel: string;
  handlePrimary: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
  rotateCW: () => void;
  restart: () => void;
}) => {
  return (
    <div className="glass rounded-2xl border border-white/10 p-3 shadow-glow">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-cyan-100/80 mb-2">
        Touch Controls
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button
          className="rounded-full bg-gradient-to-br from-lime-400/80 to-green-500/70 px-3 py-2 text-white font-semibold text-lg"
          onClick={moveLeft}
        >
          ◀
        </button>
        <button
          className="rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 p-2 text-abyss font-semibold text-sm"
          onClick={handlePrimary}
        >
          {primaryLabel}
        </button>
        <button
          className="rounded-full bg-gradient-to-br from-lime-400/80 to-green-500/70 px-3 py-2 text-white font-semibold text-lg"
          onClick={moveRight}
        >
          ▶
        </button>
        <button
          className="rounded-full bg-gradient-to-br from-amber-400/80 to-orange-500/70 px-3 py-2 text-white font-semibold text-lg"
          onClick={rotateCW}
        >
          ↺
        </button>
        <button
          className="rounded-full bg-gradient-to-br from-red-400/80 to-red-500/70 px-3 py-2 text-white font-semibold text-lg"
          onClick={hardDrop}
        >
          ▼
        </button>
        <button
          className="rounded-full bg-gradient-to-br from-pink-500/80 to-rose-500/70 px-3 py-2 text-white font-semibold text-sm"
          onClick={restart}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
