export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type GameStatus = "ready" | "playing" | "paused" | "over";

export interface Vec {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: PieceType;
  rotation: number;
  position: Vec;
  blocks: Vec[];
}

export interface Cell {
  type: PieceType;
  hue: string;
}

export type Board = (Cell | null)[][];

export interface GameState {
  board: Board;
  active: ActivePiece | null;
  queue: PieceType[];
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
  lockUntil: number | null;
}
