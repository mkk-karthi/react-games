import type { CSSProperties } from 'react';
import type { Square } from 'chess.js';

// ─── Constants ────────────────────────────────────────────────────────────────

/** File labels (columns a–h), left to right */
export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
/** Rank labels (rows 8–1), top to bottom as rendered */
export const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

export type FileChar = (typeof files)[number];
export type RankChar = (typeof ranks)[number];

export const SCORE_KEY = 'woodland-chess-scores';
export const INITIAL_SCORES = { white: 0, black: 0, draws: 0, games: 0 } as const;

export const PIECE_NAMES: Record<string, string> = {
  p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King',
};

/** Number of milliseconds the piece slide animation plays */
export const MOVE_ANIMATION_MS = 390;
/** Number of milliseconds the capture-burst animation plays */
export const CAPTURE_ANIMATION_MS = 360;
/** Delay before the computer makes its move */
export const COMPUTER_DELAY_MS = 620;

// ─── Square helpers ───────────────────────────────────────────────────────────

/** Convert a Square into its { col, row } indices (0-based). */
export function squareToIndex(square: Square): { col: number; row: number } {
  const col = files.indexOf(square[0] as FileChar);
  const row = ranks.indexOf(square[1] as RankChar);
  return { col, row };
}

/** Returns the CSS left/top/width/height percentage style for a given square. */
export function getSquareStyle(square: Square): CSSProperties {
  const { col, row } = squareToIndex(square);
  return { left: `${col * 12.5}%`, top: `${row * 12.5}%`, width: '12.5%', height: '12.5%' };
}

/** Returns the style for the animated moving-piece overlay.
 *  CSS custom properties `--move-x` / `--move-y` drive the `movePiece` keyframe. */
export function getMoveStyle(from: Square, to: Square): CSSProperties {
  const start = squareToIndex(from);
  const end   = squareToIndex(to);
  return {
    ...getSquareStyle(from),
    '--move-x': `${(end.col - start.col) * 100}%`,
    '--move-y': `${(end.row - start.row) * 100}%`,
  } as CSSProperties;
}
