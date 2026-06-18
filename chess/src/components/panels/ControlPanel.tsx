import { RotateCcw, Undo2, Volume2, VolumeX } from 'lucide-react';

// ─── Shared Tailwind class strings ───────────────────────────────────────────
const LBL   = 'panel-label m-0 uppercase text-xs font-black text-panel-text lg:mb-1';
const BTN   = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-black transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-[1.06]';
const BTN_SIZE     = 'min-h-6 px-4 py-2 text-xs lg:min-h-9 lg:px-2 lg:py-1.5 lg:text-sm';
const BTN_DISABLED = 'disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none';
const ICON_SM      = 'w-3 h-3 md:w-3.5 md:h-3.5 lg:w-auto lg:h-auto';

interface ControlPanelProps {
  gameState: string;
  computerThinking: boolean;
  gameStarted: boolean;
  isGameOver: boolean;
  moveHistory: string[];
  movingPiece: boolean;
  muted: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onToggleMute: () => void;
}

/** Left panel — status display, action buttons, move history. */
export function ControlPanel({
  gameState,
  computerThinking,
  gameStarted,
  isGameOver,
  moveHistory,
  movingPiece,
  muted,
  onNewGame,
  onUndo,
  onToggleMute,
}: ControlPanelProps) {
  const undoDisabled =
    !gameStarted || isGameOver || moveHistory.length === 0 || computerThinking || movingPiece;

  return (
    <aside className="control-card panel flex flex-row flex-wrap justify-between w-full max-w-sm p-1.5 sm:p-2 gap-1 self-center flex-none md:max-w-lg lg:flex-col lg:shrink lg:basis-[240px] lg:min-w-80 lg:max-h-[80%] lg:gap-2 overflow-hidden lg:p-3 lg:w-80 lg:self-auto lg:mx-8">

      {/* Status (Left) and History (Right) Side-by-Side */}
      <div className="flex sm:flex-col w-full gap-1.5 sm:gap-2">
        {/* Status display */}
        <div className="control-section flex-1 min-w-0">
          <p className={LBL}>Status</p>
          <div
            className="inner-tray rounded-lg flex items-center justify-center text-center font-black min-h-6 px-2 py-1.5 text-xs whitespace-nowrap overflow-scroll lg:min-h-10 lg:text-sm"
            role="status"
            aria-live="polite"
          >
            {computerThinking ? 'Computer thinking' : gameState}
          </div>
        </div>

        {/* Move history */}
        <div className="control-section flex-1 min-w-0">
          <p className={LBL}>History</p>
          <div
            className="inner-tray rounded-lg flex items-center gap-1 overflow-scroll font-black justify-start min-h-6 px-2 py-1.5 text-xs lg:min-h-10 lg:text-sm"
            aria-label="Move history"
          >
            {moveHistory.length
              ? moveHistory.slice(-8).map((move, i) => (
                  <span key={`${move}-${i}`} className="badge shrink-0 rounded-md px-1 py-0.5 sm:px-1.5">
                    {move}
                  </span>
                ))
              : <span className="badge shrink-0 rounded-md px-1.5 py-0.5">No moves yet</span>}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row gap-1.5 grow shrink basis-full w-full mt-0.5 lg:flex-col lg:mt-0 lg:flex-initial lg:w-auto">
        <button
          id="btn-new-game"
          className={`wood-button ${BTN} ${BTN_SIZE} ${BTN_DISABLED} flex-1 lg:flex-initial lg:min-w-max`}
          onClick={onNewGame}
        >
          <RotateCcw size={18} className={ICON_SM} />
          <span className="hidden lg:inline">New game</span>
        </button>
        <button
          id="btn-undo"
          className={`wood-button ${BTN} ${BTN_SIZE} ${BTN_DISABLED} flex-1 lg:flex-initial lg:min-w-max`}
          onClick={onUndo}
          disabled={undoDisabled}
        >
          <Undo2 size={18} className={ICON_SM} />
          <span className="hidden lg:inline">Undo</span>
        </button>
        <button
          id="btn-sound"
          className={`icon-button ${BTN} ${BTN_SIZE} flex-1 lg:flex-initial lg:min-w-max`}
          onClick={onToggleMute}
          aria-label="Toggle sound"
        >
          {muted
            ? <VolumeX size={18} className={ICON_SM} />
            : <Volume2 size={18} className={ICON_SM} />}
          <span className="hidden lg:inline">{muted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>
    </aside>
  );
}
