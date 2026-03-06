import type { Candy, CandyType, Position, LevelConfig } from "../types/game";

const CANDY_TYPES: CandyType[] = ["pink", "purple", "blue", "green", "yellow", "orange", "red"];
const BOARD_SIZE = 6;

export const createBoard = (): (Candy | null)[][] => {
  const board: (Candy | null)[][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = createCandy(row, col);
    }
  }

  // Ensure no initial matches
  removeInitialMatches(board);

  return board;
};

const createCandy = (row: number, col: number): Candy => {
  const type = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
  return {
    id: `${row}-${col}-${Date.now()}-${Math.random()}`,
    type,
    row,
    col,
  };
};

const removeInitialMatches = (board: (Candy | null)[][]) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const candy = board[row][col];
      if (!candy) continue;

      // Check horizontal matches
      if (
        col >= 2 &&
        board[row][col - 1]?.type === candy.type &&
        board[row][col - 2]?.type === candy.type
      ) {
        let newType: CandyType;
        do {
          newType = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
        } while (newType === candy.type);
        candy.type = newType;
      }

      // Check vertical matches
      if (
        row >= 2 &&
        board[row - 1][col]?.type === candy.type &&
        board[row - 2][col]?.type === candy.type
      ) {
        let newType: CandyType;
        do {
          newType = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
        } while (newType === candy.type);
        candy.type = newType;
      }
    }
  }
};

export const findMatches = (
  board: (Candy | null)[][]
): { matches: Position[]; specialCandies: Candy[] } => {
  const matches: Position[] = [];
  const matchedSet = new Set<string>();
  const specialCandies: Candy[] = [];

  // Helper to add match
  const addMatch = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (!matchedSet.has(key)) {
      matchedSet.add(key);
      matches.push({ row, col });
    }
  };

  // Check horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 2; col++) {
      const candy = board[row][col];
      if (!candy) continue;

      let matchLength = 1;
      while (col + matchLength < BOARD_SIZE && board[row][col + matchLength]?.type === candy.type) {
        matchLength++;
      }

      if (matchLength >= 3) {
        // Check for special candies creation
        if (matchLength >= 5) {
          specialCandies.push({
            ...createCandy(row, col + Math.floor(matchLength / 2)),
            type: "red", // Color bomb has a special type usually, but we'll use a placeholder and the special flag
            special: "color-bomb",
          });
        } else if (matchLength === 4) {
          specialCandies.push({
            ...createCandy(row, col + 1), // Approximate position
            type: candy.type,
            special: "striped-v", // Match in row creates vertical stripe
          });
        }

        for (let i = 0; i < matchLength; i++) {
          addMatch(row, col + i);
        }
        col += matchLength - 1; // Skip ahead
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      const candy = board[row][col];
      if (!candy) continue;

      let matchLength = 1;
      while (row + matchLength < BOARD_SIZE && board[row + matchLength][col]?.type === candy.type) {
        matchLength++;
      }

      if (matchLength >= 3) {
        if (matchLength >= 5) {
          // 5 in a column also makes color bomb
          specialCandies.push({
            ...createCandy(row + Math.floor(matchLength / 2), col),
            type: "red",
            special: "color-bomb",
          });
        } else if (matchLength === 4) {
          specialCandies.push({
            ...createCandy(row + 1, col),
            type: candy.type,
            special: "striped-h", // Match in col creates horizontal stripe
          });
        }

        for (let i = 0; i < matchLength; i++) {
          addMatch(row + i, col);
        }
        row += matchLength - 1;
      }
    }
  }

  return { matches, specialCandies };
};

export const isAdjacent = (pos1: Position, pos2: Position): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const swapCandies = (
  board: (Candy | null)[][],
  pos1: Position,
  pos2: Position
): (Candy | null)[][] => {
  const newBoard = board.map((row) => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;

  // Update positions
  if (newBoard[pos1.row][pos1.col]) {
    newBoard[pos1.row][pos1.col]!.row = pos1.row;
    newBoard[pos1.row][pos1.col]!.col = pos1.col;
  }
  if (newBoard[pos2.row][pos2.col]) {
    newBoard[pos2.row][pos2.col]!.row = pos2.row;
    newBoard[pos2.row][pos2.col]!.col = pos2.col;
  }

  return newBoard;
};

export const removeMatches = (
  board: (Candy | null)[][],
  matches: Position[],
  specialCandiesToAdd: Candy[] = []
): (Candy | null)[][] => {
  const newBoard = board.map((row) => [...row]);

  // Process special effects recursively
  const processedMatches = new Set<string>();
  const matchesToProcess = [...matches];

  while (matchesToProcess.length > 0) {
    const { row, col } = matchesToProcess.pop()!;
    const key = `${row}-${col}`;

    if (processedMatches.has(key)) continue;
    processedMatches.add(key);

    const candy = newBoard[row]?.[col];
    if (!candy) continue;

    // Apply special effects
    if (candy.special === "striped-h") {
      // Clear row
      for (let c = 0; c < BOARD_SIZE; c++) matchesToProcess.push({ row, col: c });
    } else if (candy.special === "striped-v") {
      // Clear col
      for (let r = 0; r < BOARD_SIZE; r++) matchesToProcess.push({ row: r, col });
    } else if (candy.special === "wrapped") {
      // Clear 3x3
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE)
            matchesToProcess.push({ row: r, col: c });
        }
      }
    } else if (candy.special === "color-bomb") {
      // Color bombs usually explode when swapped, handled in swap logic or here if matched naturally (rare)
    }

    newBoard[row][col] = null;
  }

  // Add new special candies
  specialCandiesToAdd.forEach((candy) => {
    newBoard[candy.row][candy.col] = candy;
  });

  return newBoard;
};

export const applyGravity = (board: (Candy | null)[][]): (Candy | null)[][] => {
  const newBoard: (Candy | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  for (let col = 0; col < BOARD_SIZE; col++) {
    let writeRow = BOARD_SIZE - 1;

    // Move existing candies down
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (board[row][col]) {
        const hasMoved = row !== writeRow;
        newBoard[writeRow][col] = { ...board[row][col]!, row: writeRow, col, isFalling: hasMoved };
        writeRow--;
      }
    }

    // Fill empty spaces with new candies
    while (writeRow >= 0) {
      newBoard[writeRow][col] = { ...createCandy(writeRow, col), isFalling: true };
      writeRow--;
    }
  }

  return newBoard;
};

export const BOARD_SIZE_EXPORT = BOARD_SIZE;

export const getLevelConfig = (levelIndex: number): LevelConfig => {
  const baseMoves = 30;
  const baseScore = 100;

  // Moves increase slowly but cap out at 50, otherwise it gets too easy long term
  const moves = Math.min(50, baseMoves + Math.floor(levelIndex * 20));

  // Score requirement grows exponentially to increase challenge
  const targetScore = baseScore + levelIndex * 100;

  return {
    level: levelIndex + 1,
    moves,
    targetScore,
  };
};
