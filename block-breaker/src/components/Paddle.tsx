import { forwardRef } from "react";
import type { Paddle as PaddleType } from "../types/game";

interface PaddleProps {
  paddle: PaddleType;
}

export const Paddle = forwardRef<HTMLDivElement, PaddleProps>(({ paddle }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute rounded-lg border-2 border-neon-pink game-element will-change-transform gpu-accelerated"
      style={{
        left: "0px",
        top: "0px",
        transform: `translate(${paddle.position.x}px, ${paddle.position.y}px)`,
        width: `${paddle.width}px`,
        height: `${paddle.height}px`,
        boxShadow: "0 0 15px rgba(255, 0, 110, 0.8)",
      }}
    />
  );
});

Paddle.displayName = "Paddle";
