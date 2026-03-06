import React, { useState } from "react";
import type { Candy as CandyType } from "../types/game";
import {
  PinkCandySvg,
  PurpleCandySvg,
  BlueCandySvg,
  GreenCandySvg,
  YellowCandySvg,
  OrangeCandySvg,
  RedCandySvg,
} from "./CandySvg";

interface CandyProps {
  candy: CandyType;
  isSelected: boolean;
  isSwapping: boolean | null;
  swapDirection?: { row: number; col: number };
  isInvalid: boolean;
  onClick: () => void;
  onSwipe?: (dir: { row: number; col: number }) => void;
}

const CandyIcons: Record<CandyType["type"], React.ReactNode> = {
  pink: <PinkCandySvg />,
  purple: <PurpleCandySvg />,
  blue: <BlueCandySvg />,
  green: <GreenCandySvg />,
  yellow: <YellowCandySvg />,
  orange: <OrangeCandySvg />,
  red: <RedCandySvg />,
};

export const Candy: React.FC<CandyProps> = ({
  candy,
  isSelected,
  isSwapping,
  swapDirection,
  isInvalid,
  onClick,
  onSwipe,
}) => {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStart) return;
    const diffX = e.clientX - dragStart.x;
    const diffY = e.clientY - dragStart.y;

    if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
      if (onSwipe) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          onSwipe({ row: 0, col: diffX > 0 ? 1 : -1 });
        } else {
          onSwipe({ row: diffY > 0 ? 1 : -1, col: 0 });
        }
      }
    } else {
      onClick();
    }
    setDragStart(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const isColorBomb = candy.special === "color-bomb";

  const getTransform = () => {
    if (isSwapping && swapDirection) {
      const x = swapDirection.col * 100;
      const y = swapDirection.row * 100;
      return `translate(${x}%, ${y}%)`;
    }
    return undefined;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragStart(null)}
      className={`
        relative w-full h-full rounded-2xl cursor-pointer
        transition-transform transform touch-none select-none
        ${
          isColorBomb
            ? "bg-gradient-to-br from-gray-800 to-black ring-2 ring-red-500 shadow-xl"
            : "bg-transparent"
        }
        ${
          isSelected
            ? "scale-110 bg-white/20 shadow-2xl z-20 backdrop-blur-sm"
            : "hover:scale-105 z-10"
        }
        ${candy.isMatched ? "animate-pop" : ""}
        ${candy.isFalling ? "animate-fall" : ""}
        ${isInvalid ? "animate-shake" : ""}
        ${isSwapping ? "z-30" : ""}
        flex items-center justify-center
      `}
      style={{
        transform: getTransform(),
        transitionDuration: isSwapping ? "300ms" : "0s",
      }}
    >
      {/* Special Candy Indicators */}
      {candy.special === "striped-h" && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center space-y-2 opacity-80 pointer-events-none drop-shadow-md">
          <div className="w-full h-1.5 bg-white/90" />
          <div className="w-full h-1.5 bg-white/90" />
          <div className="w-full h-1.5 bg-white/90" />
        </div>
      )}
      {candy.special === "striped-v" && (
        <div className="absolute inset-0 z-20 flex justify-center space-x-2 opacity-80 pointer-events-none drop-shadow-md">
          <div className="h-full w-1.5 bg-white/90" />
          <div className="h-full w-1.5 bg-white/90" />
          <div className="h-full w-1.5 bg-white/90" />
        </div>
      )}
      {candy.special === "wrapped" && (
        <div className="absolute inset-0 z-20 border-[6px] border-white/90 rounded-xl m-1 opacity-80 pointer-events-none drop-shadow-md" />
      )}

      {/* Candy SVG */}
      <div className="w-full h-full flex items-center justify-center relative z-10">
        {isColorBomb ? (
          <span className="text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl">💣</span>
        ) : (
          CandyIcons[candy.type]
        )}
      </div>

      {/* Sparkle effect */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl animate-pulse pointer-events-none">
          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
        </div>
      )}
    </div>
  );
};
