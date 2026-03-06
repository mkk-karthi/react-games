export type CandyType = "pink" | "purple" | "blue" | "green" | "yellow" | "orange" | "red";

export interface Candy {
  id: string;
  type: CandyType;
  row: number;
  col: number;
  isMatched?: boolean;
  isFalling?: boolean;
  special?: "striped-h" | "striped-v" | "wrapped" | "color-bomb";
}

export interface Position {
  row: number;
  col: number;
}

export interface LevelConfig {
  level: number;
  moves: number;
  targetScore: number;
}

export interface GameState {
  board: (Candy | null)[][];
  score: number;
  moves: number;
  selectedCandy: Position | null;
  isAnimating: boolean;
  gameOver: boolean;
  currentLevel: number; // Index in levels array
  targetScore: number;
  levelComplete: boolean;
}
