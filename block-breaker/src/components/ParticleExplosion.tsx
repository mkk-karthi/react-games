import React from "react";

interface ParticleExplosionProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

const EMOJIS = ["⭐", "🌟", "✨", "🍭", "🎉", "💫", "💥"];

export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const particles = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed;
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      return { id: i, tx, ty, emoji };
    });
  }, []);

  return (
    <div className="absolute pointer-events-none z-500" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-xl animate-explode"
          style={
            {
              // @ts-ignore
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              color: color,
              textShadow: "0 0 5px currentColor",
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};
