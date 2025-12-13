import type { PieceType, Vec } from "./types";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 12;
export const LINES_PER_LEVEL = 10;

export const PIECE_COLORS: Record<PieceType, string> = {
  I: "#22d3ee", // Cyan - like ocean water
  O: "#fbbf24", // Gold - like treasure
  T: "#a78bfa", // Purple - like coral
  S: "#34d399", // Emerald - like seaweed
  Z: "#fb7185", // Pink - like coral reef
  J: "#60a5fa", // Blue - like deep ocean
  L: "#f97316", // Orange - like tropical fish
};

export const PIECE_SHAPES: Record<PieceType, Vec[]> = {
  I: [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],
  O: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  T: [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ],
  S: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
  ],
  Z: [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  J: [
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ],
  L: [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
};

export const LINE_CLEAR_VALUES = [0, 100, 300, 500, 800];

export const GRAVITY_DELAY = (level: number) => Math.max(120, 900 - level * 60);

export const LOCK_GRACE_MS = 500;
