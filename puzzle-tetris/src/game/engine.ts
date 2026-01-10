import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GRAVITY_DELAY,
  SCORES_PER_LEVEL,
  LOCK_GRACE_MS,
  PIECE_COLORS,
  PIECE_SHAPES,
} from "./constants";
import type { ActivePiece, Board, GameState, GameStatus, PieceType, Vec } from "./types";

const PIECES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];
const WALL_KICK_OFFSETS: Vec[] = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: -2 },
];

export const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null));

const makePiece = (): PieceType[] => {
  const bag = [...PIECES];
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

const nextQueue = (queue: PieceType[]) => {
  const next = [...queue];
  while (next.length < 5) {
    next.push(...makePiece());
  }
  return next;
};

const spawnPiece = (queue: PieceType[]): [ActivePiece | null, PieceType[]] => {
  const replenished = nextQueue(queue);
  const type = replenished.shift();
  if (!type) return [null, queue];

  const blocks = PIECE_SHAPES[type];
  const position = { x: 4, y: 0 };
  const active: ActivePiece = { type, rotation: 0, position, blocks };
  return [active, replenished];
};

const rotateVec = (vec: Vec, dir: "cw" | "ccw"): Vec =>
  dir === "cw" ? { x: -vec.y, y: vec.x } : { x: vec.y, y: -vec.x };

const rotatedPiece = (piece: ActivePiece, dir: "cw" | "ccw"): ActivePiece => ({
  ...piece,
  rotation: (piece.rotation + (dir === "cw" ? 1 : 3)) % 4,
  blocks: piece.blocks.map((b) => rotateVec(b, dir)),
});

const withPosition = (piece: ActivePiece, delta: Vec): ActivePiece => ({
  ...piece,
  position: { x: piece.position.x + delta.x, y: piece.position.y + delta.y },
});

const cellsForPiece = (piece: ActivePiece): Vec[] =>
  piece.blocks.map((b) => ({ x: b.x + piece.position.x, y: b.y + piece.position.y }));

const isValidPosition = (board: Board, piece: ActivePiece): boolean =>
  cellsForPiece(piece).every(
    (cell) =>
      cell.x >= 0 &&
      cell.x < BOARD_WIDTH &&
      cell.y >= 0 &&
      cell.y < BOARD_HEIGHT &&
      !board[cell.y][cell.x]
  );

const mergePiece = (board: Board, piece: ActivePiece): Board => {
  const next = board.map((row) => [...row]);
  cellsForPiece(piece).forEach(({ x, y }) => {
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      next[y][x] = { type: piece.type, hue: PIECE_COLORS[piece.type] };
    }
  });
  return next;
};

const clearLines = (board: Board) => {
  const remaining: Board = [];
  let cleared = 0;

  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    if (board[y].every((cell) => cell)) {
      cleared += 1;
    } else {
      remaining.push(board[y]);
    }
  }

  while (remaining.length < BOARD_HEIGHT) {
    remaining.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { board: remaining, cleared };
};

const computeLevel = (score: number) => Math.floor(score / SCORES_PER_LEVEL);

const lockAndProceed = (state: GameState) => {
  if (!state.active) return state;

  const merged = mergePiece(state.board, state.active);
  const { board: clearedBoard, cleared } = clearLines(merged);
  const score = state.score + cleared;
  const level = computeLevel(score);

  // Level up logic
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("puzzle-tetris-score", score.toString());
  }

  const [nextActive, nextQueue] = spawnPiece(state.queue);
  const status: GameStatus =
    nextActive && isValidPosition(clearedBoard, nextActive) ? "playing" : "over";

  return {
    ...state,
    board: clearedBoard,
    active: status === "over" ? null : nextActive,
    queue: nextQueue,
    score,
    level,
    status,
    lockUntil: null,
  };
};

export const createInitialState = (): GameState => {
  const board = createEmptyBoard();
  const [active, queue] = spawnPiece([]);
  const status: GameStatus = active && isValidPosition(board, active) ? "ready" : "over";

  const savedScore =
    typeof localStorage !== "undefined" ? localStorage.getItem("puzzle-tetris-score") : null;
  const score = savedScore ? parseInt(savedScore, 10) : 0;
  const level = computeLevel(score);

  return {
    board,
    active,
    queue,
    score,
    level,
    status,
    lockUntil: null,
  };
};

const resetLockTimer = (_state: GameState, wasLocking: boolean): number | null => {
  if (!wasLocking) return null;
  return Date.now() + LOCK_GRACE_MS;
};

const attemptMove = (state: GameState, delta: Vec): GameState => {
  if (!state.active || state.status !== "playing") return state;
  const moved = withPosition(state.active, delta);
  if (!isValidPosition(state.board, moved)) return state;
  return { ...state, active: moved, lockUntil: resetLockTimer(state, state.lockUntil !== null) };
};

const attemptRotate = (state: GameState, dir: "cw" | "ccw"): GameState => {
  if (!state.active || state.status !== "playing") return state;
  const rotated = rotatedPiece(state.active, dir);

  for (const kick of WALL_KICK_OFFSETS) {
    const kicked = withPosition(rotated, kick);
    if (isValidPosition(state.board, kicked)) {
      return {
        ...state,
        active: kicked,
        lockUntil: resetLockTimer(state, state.lockUntil !== null),
      };
    }
  }

  return state;
};

export const stepGravity = (state: GameState): GameState => {
  if (!state.active || state.status !== "playing") return state;
  const moved = withPosition(state.active, { x: 0, y: 1 });
  if (isValidPosition(state.board, moved)) {
    return { ...state, active: moved, lockUntil: resetLockTimer(state, state.lockUntil !== null) };
  }
  const now = Date.now();
  if (state.lockUntil === null) {
    return { ...state, lockUntil: now + LOCK_GRACE_MS };
  }
  if (now >= state.lockUntil) {
    return lockAndProceed(state);
  }
  return state;
};

export const moveLeft = (state: GameState) => attemptMove(state, { x: -1, y: 0 });
export const moveRight = (state: GameState) => attemptMove(state, { x: 1, y: 0 });
export const softDrop = (state: GameState) => attemptMove(state, { x: 0, y: 1 });
export const rotateClockwise = (state: GameState) => attemptRotate(state, "cw");
export const rotateCounter = (state: GameState) => attemptRotate(state, "ccw");

export const hardDrop = (state: GameState): GameState => {
  if (!state.active || state.status !== "playing") return state;

  let test = state.active;
  let distance = 0;
  while (true) {
    const next = withPosition(test, { x: 0, y: 1 });
    if (isValidPosition(state.board, next)) {
      test = next;
      distance += 1;
    } else {
      break;
    }
  }

  const landedState: GameState = {
    ...state,
    active: test,
    lockUntil: Date.now() + LOCK_GRACE_MS,
  };
  return landedState;
};

export const startGame = (state: GameState): GameState => {
  if (state.status === "ready") {
    return { ...state, status: "playing" };
  }
  if (state.status === "over") {
    return { ...createInitialState(), status: "playing" };
  }
  return state;
};

export const togglePause = (state: GameState): GameState => {
  if (state.status === "playing") return { ...state, status: "paused" };
  if (state.status === "paused") return { ...state, status: "playing" };
  return state;
};

export const restartGame = (): GameState => {
  const next = createInitialState();
  next.score = 0;
  next.level = 0;

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("puzzle-tetris-score", "0");
  }

  return { ...next, status: "playing" };
};

export const gravityDelayForLevel = (level: number) => GRAVITY_DELAY(level);

export const projectGhostPiece = (board: Board, active: ActivePiece | null): ActivePiece | null => {
  if (!active) return null;
  let ghost = active;
  while (true) {
    const next = withPosition(ghost, { x: 0, y: 1 });
    if (isValidPosition(board, next)) {
      ghost = next;
    } else {
      break;
    }
  }
  return ghost;
};
