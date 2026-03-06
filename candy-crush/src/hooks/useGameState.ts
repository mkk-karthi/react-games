import { useState, useEffect, useCallback } from "react";
import type { GameState, Position } from "../types/game";
import {
  createBoard,
  findMatches,
  isAdjacent,
  swapCandies,
  removeMatches,
  applyGravity,
  BOARD_SIZE_EXPORT,
  getLevelConfig,
} from "../utils/gameLogic";
import { audioManager } from "../utils/audioManager";

export const useGameState = () => {
  const getInitialLevel = () => {
    const saved = localStorage.getItem("candy-crush-level");
    return saved ? parseInt(saved, 10) : 0;
  };

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialLevel = getInitialLevel();
    const config = getLevelConfig(initialLevel);
    return {
      board: createBoard(),
      score: 0,
      moves: config.moves,
      selectedCandy: null,
      isAnimating: false,
      gameOver: false,
      currentLevel: initialLevel,
      targetScore: config.targetScore,
      levelComplete: false,
    };
  });

  const [swappingCandies, setSwappingCandies] = useState<{
    first: Position;
    second: Position;
    reverse?: boolean;
  } | null>(null);

  const [invalidSwap, setInvalidSwap] = useState<[Position, Position] | null>(null);

  const [isMuted, setIsMuted] = useState(false);

  const checkAndProcessMatches = useCallback((board: typeof gameState.board) => {
    const { matches, specialCandies } = findMatches(board);

    if (matches.length > 0) {
      audioManager.play("match");

      // Mark candies as matched
      const newBoard = board.map((row) => row.map((candy) => (candy ? { ...candy } : null)));
      matches.forEach(({ row, col }) => {
        if (newBoard[row][col]) {
          newBoard[row][col]!.isMatched = true;
        }
      });

      setGameState((prev) => ({ ...prev, board: newBoard, isAnimating: true }));

      // Remove matches after animation
      setTimeout(() => {
        const boardAfterRemoval = removeMatches(newBoard, matches, specialCandies);
        const boardAfterGravity = applyGravity(boardAfterRemoval);

        setGameState((prev) => ({
          ...prev,
          board: boardAfterGravity,
          score: prev.score + matches.length,
        }));

        audioManager.play("fall");

        // Check for new matches after gravity
        setTimeout(() => {
          // Clear isFalling before continuing checks
          const stableBoard = boardAfterGravity.map((row) =>
            row.map((candy) => (candy ? { ...candy, isFalling: false } : null))
          );
          setGameState((prev) => ({ ...prev, board: stableBoard, isAnimating: false }));
          checkAndProcessMatches(stableBoard);
        }, 500);
      }, 400);

      return true;
    }

    return false;
  }, []);

  const performSwap = useCallback(
    (first: Position, second: Position) => {
      if (
        gameState.isAnimating ||
        gameState.gameOver ||
        gameState.moves <= 0 ||
        swappingCandies ||
        invalidSwap
      )
        return;

      setSwappingCandies({ first, second });
      audioManager.play("swap");

      setTimeout(() => {
        const newBoard = swapCandies(gameState.board, first, second);
        const hasMatches = findMatches(newBoard).matches.length > 0;

        if (hasMatches) {
          // Valid swap: Perform logical update
          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            isAnimating: true,
            selectedCandy: null,
          }));
          setSwappingCandies(null);

          setTimeout(() => {
            checkAndProcessMatches(newBoard);
            setGameState((prev) => ({
              ...prev,
              moves: prev.moves - 1,
            }));
          }, 200);
        } else {
          // Invalid swap: Reverse visual animation or shake
          setSwappingCandies({ first, second, reverse: true });
          audioManager.play("invalid");

          setTimeout(() => {
            setSwappingCandies(null);
            setInvalidSwap([first, second]); // Shake both candies
            setGameState((prev) => ({ ...prev, moves: prev.moves - 1, selectedCandy: null }));

            // Clear invalid state after shake
            setTimeout(() => setInvalidSwap(null), 300);
          }, 300);
        }
      }, 300);
    },
    [gameState, swappingCandies, invalidSwap, checkAndProcessMatches]
  );

  const handleCandyClick = useCallback(
    (row: number, col: number) => {
      if (
        gameState.isAnimating ||
        gameState.gameOver ||
        gameState.moves <= 0 ||
        swappingCandies ||
        invalidSwap
      )
        return;

      const clickedPosition: Position = { row, col };

      if (!gameState.selectedCandy) {
        setGameState((prev) => ({ ...prev, selectedCandy: clickedPosition }));
      } else {
        if (gameState.selectedCandy.row === row && gameState.selectedCandy.col === col) {
          setGameState((prev) => ({ ...prev, selectedCandy: null }));
        } else if (isAdjacent(gameState.selectedCandy, clickedPosition)) {
          performSwap(gameState.selectedCandy, clickedPosition);
        } else {
          setGameState((prev) => ({ ...prev, selectedCandy: clickedPosition }));
        }
      }
    },
    [gameState, swappingCandies, invalidSwap, performSwap]
  );

  const handleCandySwipe = useCallback(
    (row: number, col: number, dir: { row: number; col: number }) => {
      const targetRow = row + dir.row;
      const targetCol = col + dir.col;
      if (
        targetRow >= 0 &&
        targetRow < BOARD_SIZE_EXPORT &&
        targetCol >= 0 &&
        targetCol < BOARD_SIZE_EXPORT
      ) {
        performSwap({ row, col }, { row: targetRow, col: targetCol });
      }
    },
    [performSwap]
  );

  const resetGame = () => {
    const currentLevel = gameState.currentLevel;
    const config = getLevelConfig(currentLevel);

    setGameState({
      board: createBoard(),
      score: 0,
      moves: config.moves,
      selectedCandy: null,
      isAnimating: false,
      gameOver: false,
      levelComplete: false,
      currentLevel: currentLevel,
      targetScore: config.targetScore,
    });
  };

  const handleNextLevel = () => {
    const nextLevelIdx = gameState.currentLevel + 1;
    localStorage.setItem("candy-crush-level", nextLevelIdx.toString());
    const nextLevel = getLevelConfig(nextLevelIdx);

    setGameState({
      board: createBoard(),
      score: 0, // Reset score for new level challenge
      moves: nextLevel.moves,
      selectedCandy: null,
      isAnimating: false,
      gameOver: false,
      levelComplete: false,
      currentLevel: nextLevelIdx,
      targetScore: nextLevel.targetScore,
    });
  };

  const toggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  // Check for game over or level complete
  useEffect(() => {
    if (gameState.moves <= 0 && !gameState.gameOver && !gameState.isAnimating) {
      if (gameState.score < gameState.targetScore) {
        setGameState((prev) => ({ ...prev, gameOver: true }));
      }
    }
    if (gameState.score >= gameState.targetScore && !gameState.levelComplete) {
      setGameState((prev) => ({ ...prev, levelComplete: true }));
    }
  }, [
    gameState.moves,
    gameState.gameOver,
    gameState.score,
    gameState.targetScore,
    gameState.isAnimating,
    gameState.levelComplete,
  ]);

  // Play sound on level complete
  useEffect(() => {
    if (gameState.levelComplete) {
      audioManager.play("levelComplete");
    }
  }, [gameState.levelComplete]);

  return {
    gameState,
    swappingCandies,
    invalidSwap,
    isMuted,
    handleCandyClick,
    handleCandySwipe,
    resetGame,
    handleNextLevel,
    toggleMute,
  };
};
