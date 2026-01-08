import React, { useState, useEffect } from "react";
import type { Block as BlockType } from "../types/game";

interface BlockProps {
  block: BlockType;
}

export const Block: React.FC<BlockProps> = ({ block }) => {
  const [isBreaking, setIsBreaking] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (block.isDestroyed && !isBreaking && !hasAnimated) {
      setIsBreaking(true);
    }
  }, [block.isDestroyed, isBreaking, hasAnimated]);

  if (block.isDestroyed && !isBreaking && hasAnimated) {
    return null;
  }

  // If it's destroyed but hasn't animated yet (and isn't breaking), it might be a re-mount or something,
  // but usually we want to render nothing or start break.
  // Actually, if block.isDestroyed is true, isBreaking false, hasAnimated false -> effect will set isBreaking true.
  // We can return null here to avoid a flash of static block before animation starts?
  // No, if we return null, the effect runs and then we render animation. That's fine.
  // Wait, if we return null, then we render... null. The effect runs. Sets isBreaking true.
  // Next render: isBreaking is true. We render the block with animation class.
  // That seems correct.

  // Existing logic was:
  // if (block.isDestroyed && !isBreaking) { return null; }
  // This meant "if destroyed and not animating, show nothing".
  // But if we want to START animating, we need to NOT return null?
  // Actually, if we return null, the effect still runs.
  // So:
  // 1. Destroyed=true, Breaking=false, Animated=false.
  //    Return null? If we return null, we don't see the block.
  //    Effect runs -> Breaking=true.
  // 2. Destroyed=true, Breaking=true, Animated=false.
  //    Render block with animation.
  // 3. Animation ends. Breaking=false, Animated=true.
  // 4. Destroyed=true, Breaking=false, Animated=true.
  //    Return null.

  if (block.isDestroyed && !isBreaking && hasAnimated) {
    return null;
  }
  // What if block.isDestroyed && !isBreaking && !hasAnimated?
  // We want to return null temporarily while effect sets the state?
  // Or just let it render (it will look static for one frame)?
  // If we let it render, we see the static block for 1 frame/react cycle.
  // If we return null, we see nothing for 1 frame.
  // The original code had: if (block.isDestroyed && !isBreaking) return null;
  // This might be why the effect loop happened?

  // Let's keep the return null if destroyed and done animating.
  // If destroyed and NOT done animating (so waiting to start), we should probably let it render?
  // Or return null and let effect start it?

  // I will add the check:
  if (block.isDestroyed && !isBreaking && hasAnimated) {
    return null;
  }

  const opacity = block.durability / block.maxDurability;
  const brightness = 0.6 + opacity * 0.4;

  return (
    <>
      <div
        className={`absolute rounded-md game-element will-change-transform text-center ${
          isBreaking ? "animate-block-break" : ""
        }`}
        onAnimationEnd={() => {
          if (isBreaking) {
            setIsBreaking(false);
            setHasAnimated(true);
          }
        }}
        style={{
          left: `${block.position.x}px`,
          top: `${block.position.y}px`,
          width: `${block.width}px`,
          height: `${block.height}px`,
          opacity: isBreaking ? undefined : opacity,
          filter: `brightness(${brightness})`,
          boxShadow: `0 0 10px ${block.color}80, inset 0 0 20px ${block.color}80`,
          border: `2px solid ${block.color}`,
        }}
      >
        {/* Durability indicator */}
        {block.durability > 1 && (
          <div className="text-white text-[14px] font-bold">{block.durability}</div>
        )}
      </div>

      {/* Particle effects on break */}
      {isBreaking && (
        <>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-particle-burst pointer-events-none"
                style={
                  {
                    left: `${block.position.x + block.width / 2}px`,
                    top: `${block.position.y + block.height / 2}px`,
                    backgroundColor: block.color,
                    "--tx": `${tx}px`,
                    "--ty": `${ty}px`,
                    animationDelay: `${i * 0.02}s`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </>
      )}
    </>
  );
};
