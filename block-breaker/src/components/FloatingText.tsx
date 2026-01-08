import React, { useEffect } from "react";

interface FloatingTextProps {
  item: {
    id: string;
    x: number;
    y: number;
    text: string;
    color?: string;
  };
  onComplete: (id: string) => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ item, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(item.id);
    }, 1000);
    return () => clearTimeout(timer);
  }, [item.id, onComplete]);

  return (
    <div
      className="absolute font-bold text-2xl animate-float-up pointer-events-none z-50 text-glow font-cyber"
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        color: item.color || "#fff",
        textShadow: "0 0 10px currentColor",
        transform: "translate(-50%, -50%)", // Center
      }}
    >
      {item.text}
    </div>
  );
};
