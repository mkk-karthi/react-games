import { Trophy } from 'lucide-react';
import type { Piece } from 'chess.js';
import { ChessPiece } from '../Board/Board';
import type { StoredScores } from '../../types/chess';
import { PIECE_NAMES } from '../../utils/chess';

const SCORE_ROWS = [
  { label: 'White', key: 'white' as const, dot: 'white-dot' },
  { label: 'Black', key: 'black' as const, dot: 'black-dot' },
  { label: 'Draws', key: 'draws' as const, dot: 'draw-dot' },
] as const;

interface InfoPanelProps {
  scores: StoredScores;
  capturedPieces: Piece[];
  onResetScores: () => void;
}

/** Right panel — scores, captured pieces tray, reset button. */
export function InfoPanel({ scores, capturedPieces, onResetScores }: InfoPanelProps) {
  return (
    // FIX #11: removed duplicate `lg:shrink` from original markup
    <aside className="info-card panel flex flex-col justify-center w-full max-w-sm p-2 gap-1 self-center flex-none md:max-w-lg overflow-hidden lg:max-h-[80%] lg:gap-2 lg:p-3 lg:w-80 lg:min-w-80 lg:shrink lg:basis-[240px] lg:self-auto lg:mx-8">

      {/* Scores */}
      <div>
        <p className="panel-label m-0 uppercase text-xs font-black text-panel-text lg:mb-1">Scores</p>
        <div className="flex flex-row gap-1 lg:flex-col">
          {SCORE_ROWS.map(({ label, key, dot }) => (
            <div
              key={key}
              className="inner-tray rounded-lg flex items-center justify-center font-black flex-1 gap-1 px-1.5 py-1 lg:justify-between lg:px-2 lg:py-1 lg:flex-initial" 
            >
              <span className="score-name">
                <span className="hidden lg:inline">{label}</span>
                <span className={`score-icon-dot inline-block align-middle lg:hidden w-3.5 h-3.5 rounded-full ${dot}`} title={label} />
              </span>
              <strong aria-label={`${label} score`}>{scores[key]}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Captured pieces */}
      <div>
        <p className="panel-label m-0 uppercase text-xs font-black text-panel-text lg:mb-1">Captured</p>
        <div
          className="inner-tray rounded-lg flex flex-wrap content-start gap-0.5 p-1 min-h-9 lg:min-h-14"
          aria-label="Captured pieces"
        >
          {capturedPieces.length
            ? capturedPieces.slice(-12).map((piece, i) => (
                <span
                  key={`${piece.color}-${piece.type}-${i}`}
                  className="inline-flex w-4 h-4 lg:w-6 lg:h-6"
                  title={`${piece.color === 'w' ? 'White' : 'Black'} ${PIECE_NAMES[piece.type]}`}
                >
                  <ChessPiece piece={piece} />
                </span>
              ))
            : <span className="flex items-center text-sm font-extrabold text-no-captures">No captures</span>}
        </div>
      </div>

      {/* Reset scores */}
      <button
        id="btn-reset-scores"
        className="wood-button inline-flex items-center justify-center gap-1.5 rounded-lg font-black transition-all duration-150 ease-in-out hover:-translate-y-px hover:brightness-[1.06] min-h-6 px-4 py-2 text-xs lg:min-h-9 lg:px-2 lg:py-1.5 lg:text-sm disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none"
        onClick={onResetScores}
      >
        <Trophy size={18} />
        Reset scores
      </button>
    </aside>
  );
}
