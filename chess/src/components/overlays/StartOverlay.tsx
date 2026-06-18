import { Play, User, Users } from 'lucide-react';
import type { GameMode } from '../../types/chess';

const LBL = 'panel-label m-0 uppercase text-xs font-black text-panel-text lg:mb-1';
const BTN = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-black transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-[1.06]';

interface StartOverlayProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
}

/** Full-screen modal shown before the first game starts. */
export function StartOverlay({ mode, onSelectMode, onStartGame }: StartOverlayProps) {
  return (
    <div
      className="overlay-container fixed inset-0 z-50 flex items-center justify-center perspective-distant backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Start a new game"
    >
      <div className="wood-card animate-cardFlipIn w-full max-w-sm sm:max-w-md rounded-lg text-panel-card p-4 text-center">
        <p className={LBL}>Choose mode</p>
        <h2 className="mt-0.5 mb-4 font-display text-2xl sm:text-3xl font-black leading-none">
          Start a wooden match
        </h2>
        <div className="flex gap-1.5">
          <button
            id="btn-start-single"
            className={`mode-card ${BTN} flex-1 min-h-20 flex-col${mode === 'single' ? ' active' : ''}`}
            onClick={() => onSelectMode('single')}
          >
            <User size={22} />
            Single player
          </button>
          <button
            id="btn-start-multi"
            className={`mode-card ${BTN} flex-1 min-h-20 flex-col${mode === 'multi' ? ' active' : ''}`}
            onClick={() => onSelectMode('multi')}
          >
            <Users size={22} />
            Multi player
          </button>
        </div>
        <button
          id="btn-start-game"
          className={`start-button ${BTN} w-full min-h-12 mt-3.5`}
          onClick={onStartGame}
        >
          <Play size={20} />
          Start game
        </button>
      </div>
    </div>
  );
}
