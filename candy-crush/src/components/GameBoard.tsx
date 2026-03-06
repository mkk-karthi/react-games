import React from "react";
import { Candy } from "./Candy";
import { BOARD_SIZE_EXPORT } from "../utils/gameLogic";
import type { GameState, Position } from "../types/game";

interface GameBoardProps {
  board: GameState["board"];
  selectedCandy: Position | null;
  swappingCandies: { first: Position; second: Position; reverse?: boolean } | null;
  invalidSwap: [Position, Position] | null;
  onCandyClick: (row: number, col: number) => void;
  onCandySwipe: (row: number, col: number, dir: { row: number; col: number }) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedCandy,
  swappingCandies,
  invalidSwap,
  onCandyClick,
  onCandySwipe,
}) => {
  return (
    <div className="flex items-center justify-center order-1 md:order-2 shrink-0 w-[min(95vw,55vh)] h-[min(95vw,55vh)] md:w-[min(50vw,70vh)] md:h-[min(50vw,70vh)] lg:w-[min(45vw,75vh)] lg:h-[min(45vw,75vh)]">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-1.5 md:p-4 shadow-2xl border-4 border-white/50 w-full h-full">
        <div
          className="grid gap-1 md:gap-2 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE_EXPORT}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE_EXPORT}, 1fr)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) =>
              candy ? (
                <Candy
                  key={candy.id}
                  candy={candy}
                  isSelected={selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex}
                  isSwapping={
                    swappingCandies &&
                    ((swappingCandies.first.row === rowIndex &&
                      swappingCandies.first.col === colIndex) ||
                      (swappingCandies.second.row === rowIndex &&
                        swappingCandies.second.col === colIndex))
                  }
                  swapDirection={
                    swappingCandies
                      ? swappingCandies.reverse
                        ? { row: 0, col: 0 }
                        : swappingCandies.first.row === rowIndex &&
                          swappingCandies.first.col === colIndex
                        ? {
                            row: swappingCandies.second.row - swappingCandies.first.row,
                            col: swappingCandies.second.col - swappingCandies.first.col,
                          }
                        : {
                            row: swappingCandies.first.row - swappingCandies.second.row,
                            col: swappingCandies.first.col - swappingCandies.second.col,
                          }
                      : undefined
                  }
                  isInvalid={
                    invalidSwap !== null &&
                    ((invalidSwap[0].row === rowIndex && invalidSwap[0].col === colIndex) ||
                      (invalidSwap[1].row === rowIndex && invalidSwap[1].col === colIndex))
                  }
                  onClick={() => onCandyClick(rowIndex, colIndex)}
                  onSwipe={(dir) => onCandySwipe(rowIndex, colIndex, dir)}
                />
              ) : (
                <div key={`empty-${rowIndex}-${colIndex}`} className="w-full h-full" />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};
