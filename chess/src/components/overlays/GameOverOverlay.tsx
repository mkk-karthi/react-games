import { useMemo } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import type { StoredScores } from '../../types/chess';

const BTN = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-black transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-[1.06]';

interface GameOverOverlayProps {
  gameState: string;
  scores: StoredScores;
  onPlayAgain: () => void;
}

function Confetti() {
  const pieces = useMemo(() => {
    const colors = [
      '#f0c47b', // golden tan
      '#ffe09d', // warm honey
      '#3f7c48', // forest-400
      '#ef4444', // check red
      '#3b82f6', // blue
      '#a855f7', // purple
      '#ec4899', // pink
      '#10b981', // green
    ];
    return Array.from({ length: 120 }).map((_, i) => {
      const left = Math.random() * 100; // percentage
      const delay = Math.random() * 4; // seconds delay
      const duration = 2.5 + Math.random() * 3.5; // seconds duration
      const size = 6 + Math.random() * 7; // px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const spinSpeed = 1 + Math.random() * 2.5; // speed multiplier
      const drift = -40 + Math.random() * 80; // horizontal drift px
      return { id: i, left, delay, duration, size, color, spinSpeed, drift };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-xs opacity-90 animate-confettiFall"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--confetti-drift': `${p.drift}px`,
            '--confetti-spin-speed': `${p.spinSpeed}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/** Full-screen modal shown when the game ends. */
export function GameOverOverlay({ gameState, scores, onPlayAgain }: GameOverOverlayProps) {
  const isVictory = gameState.toLowerCase().includes('wins');

  return (
    <>
      {isVictory && <Confetti />}
      <div
        className="overlay-container fixed inset-0 z-50 flex items-center justify-center perspective-distant backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-label="Game over"
      >
        <div className="wood-card animate-cardFlipIn w-full max-w-sm sm:max-w-md rounded-lg text-panel-card p-4 text-center flex flex-col items-center gap-2">
          <Trophy size={34} />
          <h2 className="mt-0.5 mb-4 font-display text-2xl sm:text-3xl font-black leading-none">
            {gameState}
          </h2>
          <div className="flex flex-wrap justify-center gap-1.5 font-black">
            <span className="badge rounded-lg px-2 py-1">White {scores.white}</span>
            <span className="badge rounded-lg px-2 py-1">Black {scores.black}</span>
            <span className="badge rounded-lg px-2 py-1">Draws {scores.draws}</span>
          </div>
          <button
            id="btn-play-again"
            className={`start-button ${BTN} w-full min-h-12 mt-3.5`}
            onClick={onPlayAgain}
          >
            <RotateCcw size={20} />
            Play again
          </button>
        </div>
      </div>
    </>
  );
}
