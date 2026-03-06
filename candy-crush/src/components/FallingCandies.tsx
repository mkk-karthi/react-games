import React, { useMemo } from "react";
import {
  PinkCandySvg,
  PurpleCandySvg,
  BlueCandySvg,
  GreenCandySvg,
  YellowCandySvg,
  OrangeCandySvg,
  RedCandySvg,
} from "./CandySvg";

export const FallingCandies = React.memo(() => {
  const candies = [
    <PinkCandySvg />,
    <PurpleCandySvg />,
    <BlueCandySvg />,
    <GreenCandySvg />,
    <YellowCandySvg />,
    <OrangeCandySvg />,
    <RedCandySvg />,
  ];
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        emoji: candies[Math.floor(Math.random() * candies.length)],
        left: `${i * 10}vw`, // Fixed even positions to prevent overlapping
        animationDuration: `${5 + Math.random() * 12}s`,
        animationDelay: `-${Math.random() * 20}s`,
        size: `${Math.floor(Math.random() * 2) + 3}rem`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: "-10%",
            width: p.size,
            height: p.size,
            animation: `falling-bg ${p.animationDuration} linear ${p.animationDelay} infinite`,
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
});
