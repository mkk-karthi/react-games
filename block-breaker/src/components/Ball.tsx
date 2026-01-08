import React, { forwardRef } from "react";
import type { Ball as BallType } from "../types/game";

interface BallProps {
  ball: BallType;
}

export const Ball = forwardRef<HTMLDivElement, BallProps>(({ ball }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute game-element will-change-transform gpu-accelerated"
      style={{
        left: "0px",
        top: "0px",
        transform: `translate(${ball.position.x}px, ${ball.position.y}px)`,
        width: "0px",
        height: "0px",
        overflow: "visible",
      }}
    >
      {/* Ball */}
      <div
        className="absolute rounded-full bg-radial-[at_30%_30%] from-white via-neon-blue to-neon-purple shadow-lg"
        style={{
          left: `-${ball.radius}px`,
          top: `-${ball.radius}px`,
          width: `${ball.radius * 2}px`,
          height: `${ball.radius * 2}px`,
          boxShadow: "0 0 15px #00f3ff, 0 0 30px #bf00ff", // Neon glow
        }}
      />

      {/* Ball trail effect */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `-${ball.radius * 1.5}px`,
          top: `-${ball.radius * 1.5}px`,
          width: `${ball.radius * 3}px`,
          height: `${ball.radius * 3}px`,
          background: "radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%)",
          opacity: Math.min(Math.abs(ball.velocity.x) + Math.abs(ball.velocity.y)) / 10,
        }}
      />
    </div>
  );
});

Ball.displayName = "Ball";
