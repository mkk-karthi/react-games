import { memo, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Move, Piece, Square } from 'chess.js';
import type { CapturedBurst, MovingPiece } from '../../types/chess';
import { files, ranks, PIECE_NAMES, getSquareStyle } from '../../utils/chess';

// ─── SvgDefs (module-private) ─────────────────────────────────────────────────
function SvgDefs() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <linearGradient id="whiteWood" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-wood-50)" />
          <stop offset="48%"  stopColor="var(--color-wood-300)" />
          <stop offset="100%" stopColor="var(--color-wood-450)" />
        </linearGradient>
        <linearGradient id="darkWood" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-wood-450)" />
          <stop offset="52%"  stopColor="var(--color-wood-700)" />
          <stop offset="100%" stopColor="var(--color-wood-900)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── ChessPiece ───────────────────────────────────────────────────────────────
// Exported — also used by InfoPanel for the captured-pieces tray.
export const ChessPiece = memo(function ChessPiece({
  piece,
  isSelected,
  isLastMove,
}: {
  piece: Piece;
  isSelected?: boolean;
  isLastMove?: boolean;
}) {
  const isWhite = piece.color === 'w';
  const fill   = isWhite ? 'url(#whiteWood)' : 'url(#darkWood)';
  const stroke = isWhite ? 'var(--color-piece-stroke-w)' : 'var(--color-piece-stroke-b)';
  const accent = isWhite ? 'var(--color-piece-accent-w)' : 'var(--color-piece-accent-b)';
  const shared = { fill, stroke, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const animationClass = isSelected
    ? 'animate-selectedFloat z-10'
    : isLastMove
    ? 'animate-landPiece'
    : '';

  return (
    <div className={`w-full h-full flex items-center justify-center ${animationClass}`}>
      <svg className="chess-piece-svg relative w-4/5 h-4/5 -translate-y-0.5 transition-transform duration-[180ms] ease-in-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
        viewBox="0 0 100 100" role="img" aria-label={`${isWhite ? 'White' : 'Black'} ${PIECE_NAMES[piece.type]}`}>
        <ellipse cx="50" cy="84" rx="34" ry="9" fill="var(--color-piece-ellipse)" />
        {piece.type === 'p' && <><circle cx="50" cy="28" r="15" {...shared} /><path d="M37 49h26l8 28H29z" {...shared} /><path d="M30 78h40" stroke={accent} strokeWidth="5" strokeLinecap="round" opacity=".65" /></>}
        {piece.type === 'r' && <><path d="M28 21h12v8h20v-8h12v29H28z" {...shared} /><path d="M35 50h30l7 28H28z" {...shared} /><path d="M33 66h34" stroke={accent} strokeWidth="4" opacity=".6" /></>}
        {piece.type === 'n' && <><path d="M35 76h36c-4-23-15-29-27-34 17-2 25-16 15-25-9-8-27 1-31 20l12-4c-4 12-6 24-5 43z" {...shared} /><circle cx="53" cy="28" r="3" fill={accent} /><path d="M39 44c8 1 15 5 20 11" stroke={accent} strokeWidth="4" fill="none" opacity=".55" /></>}
        {piece.type === 'b' && <><path d="M50 14c15 13 16 31 2 41l16 22H32l16-22C34 45 35 27 50 14z" {...shared} /><path d="M50 17v15" stroke={accent} strokeWidth="5" /><path d="M42 39l16-12" stroke={accent} strokeWidth="4" opacity=".62" /></>}
        {piece.type === 'q' && <><path d="M25 30l13 26 12-34 12 34 13-26-9 47H34z" {...shared} /><circle cx="25" cy="27" r="7" {...shared} /><circle cx="50" cy="18" r="7" {...shared} /><circle cx="75" cy="27" r="7" {...shared} /><path d="M35 65h30" stroke={accent} strokeWidth="4" opacity=".6" /></>}
        {piece.type === 'k' && <><path d="M50 14v24M39 25h22" stroke={stroke} strokeWidth="7" strokeLinecap="round" /><path d="M35 44c0-12 30-12 30 0l8 33H27z" {...shared} /><path d="M35 63h30" stroke={accent} strokeWidth="4" opacity=".6" /></>}
      </svg>
    </div>
  );
});

// ─── WoodSplinterBurst ────────────────────────────────────────────────────────
function WoodSplinterBurst({ square }: { square: Square }) {
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const distance = 35 + Math.random() * 45; // distance in px
      const size = 3 + Math.random() * 6; // size in px
      const delay = Math.random() * 0.08; // delay in seconds
      const duration = 0.32 + Math.random() * 0.28; // duration in seconds
      const rot = (Math.random() - 0.5) * 360; // rotation
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size,
        delay,
        duration,
        rot,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30" style={getSquareStyle(square)}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: `${p.size}px`,
            height: `${p.size * (1.2 + Math.random() * 1.5)}px`,
            backgroundColor: p.id % 3 === 0
              ? 'var(--color-wood-200)'
              : p.id % 3 === 1
              ? 'var(--color-wood-300)'
              : 'var(--color-wood-100)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transform: `translate(-50%, -50%)`,
            animation: `splinterBurst ${p.duration}s cubic-bezier(0.15, 0.85, 0.3, 1) ${p.delay}s both`,
            '--splinter-x': `${p.x}px`,
            '--splinter-y': `${p.y}px`,
            '--splinter-rot': `${p.rot}deg`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────
interface BoardProps {
  board: (Piece | null)[][];
  selected: Square | null;
  legalTargets: Square[];
  lastMove: Pick<Move, 'from' | 'to'> | null;
  movingPiece: MovingPiece | null;
  capturedBurst: CapturedBurst | null;
  moveStyle: CSSProperties | undefined;
  onSquareClick: (square: Square) => void;
  checkSquare?: Square | null;
}

export function Board({
  board, selected, legalTargets, lastMove,
  movingPiece, capturedBurst, moveStyle, onSquareClick, checkSquare,
}: BoardProps) {
  return (
    <div className={`board-grid relative flex flex-wrap w-full h-full overflow-hidden rounded-md ${capturedBurst ? 'animate-gridShake' : ''}`} aria-label="Chess board">
      {/* Gradient defs — rendered once, referenced by all ChessPiece SVGs */}
      <SvgDefs />

      {/* 8×8 squares */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const square = `${files[colIndex]}${ranks[rowIndex]}` as Square;
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const isHiddenForAnimation = movingPiece?.from === square;
          const isSelected = square === selected;
          const isLastMoveTo = lastMove?.to === square;
          const isLegalTarget = legalTargets.includes(square);
          const isCheckSquare = square === checkSquare;

          return (
            <button
              key={square}
              className={[
                'group relative flex items-center justify-center border-0 p-0 isolate',
                'before:absolute before:inset-0 before:pointer-events-none',
                isLight ? 'square-light' : 'square-dark',
                isSelected ? 'selected-square' : '',
                (lastMove?.from === square || lastMove?.to === square) ? 'last-move after:rounded-md' : '',
                isLegalTarget ? 'legal-target-square cursor-pointer' : '',
                isCheckSquare ? 'check-glow-square z-[3]' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onSquareClick(square)}
              aria-label={`${square}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${PIECE_NAMES[piece.type]}` : ''}`}
            >
              <span className="absolute z-[6] text-xs font-black pointer-events-none text-coordinate right-1 bottom-0.5">
                {rowIndex === 7 ? files[colIndex] : ''}
              </span>
              <span className="absolute z-[6] text-xs font-black pointer-events-none text-coordinate left-1 top-0.5">
                {colIndex === 0 ? ranks[rowIndex] : ''}
              </span>
              {piece && !isHiddenForAnimation && (
                <ChessPiece
                  piece={piece}
                  isSelected={isSelected}
                  isLastMove={isLastMoveTo}
                />
              )}
              {isLegalTarget && <span className="move-target-dot absolute w-[28%] aspect-square rounded-full z-[4]" />}
            </button>
          );
        }),
      )}

      {/* Moving piece slide animation (outer translates, inner lifts/shadows) */}
      {movingPiece && moveStyle && (
        <div className="animate-movePiece absolute flex items-center justify-center pointer-events-none z-20" style={moveStyle}>
          <div className="animate-movePieceLift w-full h-full flex items-center justify-center">
            <ChessPiece piece={movingPiece.piece} />
          </div>
        </div>
      )}

      {/* Captured piece fly-off animation */}
      {capturedBurst && (
        <div className="animate-beatPiece absolute flex items-center justify-center pointer-events-none z-20" style={getSquareStyle(capturedBurst.square)}>
          <ChessPiece piece={capturedBurst.piece} />
        </div>
      )}

      {/* Wood splinter particle burst */}
      {capturedBurst && (
        <WoodSplinterBurst square={capturedBurst.square} />
      )}
    </div>
  );
}
