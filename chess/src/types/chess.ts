import type { Piece, Square } from 'chess.js';

export type GameMode = 'single' | 'multi';

export type StoredScores = {
  white: number;
  black: number;
  draws: number;
  games: number;
};

export type MovingPiece = {
  id: number;
  piece: Piece;
  from: Square;
  to: Square;
};

export type CapturedBurst = {
  id: number;
  piece: Piece;
  square: Square;
};
