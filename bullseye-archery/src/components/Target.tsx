import { ArrowRecord } from "../types/game";

interface TargetProps {
  targetShakeX: number;
  pulseScale: number;
  arrowsOnTarget: ArrowRecord[];
}

export default function Target({ targetShakeX, pulseScale, arrowsOnTarget }: TargetProps) {
  return (
    <>
      {/* TARGET STAND (centered at 900) */}
      <ellipse cx="900" cy="308" rx="32" ry="5" fill="rgba(0,10,2,0.45)" filter="blur(1.5px)" pointerEvents="none" />
      {/* Back Leg */}
      <line x1="900" y1="200" x2="904" y2="308" stroke="#3A1C0A" strokeWidth="4.5" strokeLinecap="round" pointerEvents="none" />
      {/* Left Leg */}
      <line x1="894" y1="200" x2="880" y2="308" stroke="#5C2E0B" strokeWidth="4" strokeLinecap="round" pointerEvents="none" />
      {/* Right Leg */}
      <line x1="906" y1="200" x2="920" y2="308" stroke="#783E0D" strokeWidth="4" strokeLinecap="round" pointerEvents="none" />
      {/* Support Bar */}
      <line x1="883" y1="288" x2="917" y2="288" stroke="#4A2206" strokeWidth="3" pointerEvents="none" />

      {/* TARGET (Moved back to x=900, static) */}
      <g
        transform={`translate(${targetShakeX}, 0)`}
        className="origin-[900px_200px]"
        style={{
          transform: `translate(${targetShakeX}px, 0) scale(${pulseScale})`,
        }}
      >
        {/* Wood Backing Rim (Back Ellipse, offset to the right by 8px for 3D depth) */}
        <ellipse cx="908" cy="200" rx="20" ry="55" fill="url(#targetWood)" stroke="#3A1C0A" strokeWidth="1.5" filter="url(#targetGlow)" />
        
        {/* Wood Side Cylinder Edge */}
        <path d="M 899 144 L 907.16 144 A 56.1 22.44 90 0 1 907.16 256.2 L 899 256.2 A 56.1 22.44 90 0 0 899 144 Z" fill="url(#targetWoodSide)" />
        <path d="M 899 144 L 907.16 144 A 56.1 22.44 90 0 1 907.16 256.2 L 899 256.2 A 56.1 22.44 90 0 0 899 144 Z" fill="rgba(0,0,0,0.15)" />

        {/* Wooden Front Backplate */}
        <ellipse cx="900" cy="200" rx="22" ry="55" fill="url(#targetWood)" stroke="#5C2E0B" strokeWidth="1" />

        {/* Target Rings (Equal width rings covering entire backplate) */}
        {/* White Ring */}
        <ellipse cx="900" cy="200" rx="22" ry="55" fill="url(#ringWhite3d)" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Blue Ring */}
        <ellipse cx="900" cy="200" rx="17.6" ry="44" fill="#1d4ed8" stroke="#1e40af" strokeWidth="0.5" />
        {/* Lime Green Ring */}
        <ellipse cx="900" cy="200" rx="13.2" ry="33" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
        {/* Yellow Inner Ring */}
        <ellipse cx="900" cy="200" rx="8.8" ry="22" fill="url(#ringGold3d)" stroke="#b45309" strokeWidth="0.5" />
        {/* Red Bullseye Center */}
        <ellipse cx="900" cy="200" rx="4.4" ry="11" fill="url(#ringRed3d)" stroke="#991b1b" strokeWidth="0.75" />
        
        {/* Tiny Black Center Pin */}
        <ellipse cx="900" cy="200" rx="1.5" ry="3.5" fill="#0f172a" />

        {/* Target Face Lines */}
        <line x1="878" y1="200" x2="922" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="900" y1="145" x2="900" y2="255" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* ARROWS ON TARGET */}
        {arrowsOnTarget.map((a, i) => (
          <g key={i} transform={`translate(${a.x}, ${a.y}) rotate(${a.angle})`} opacity="0.9">
            <use xlinkHref="#arrowDef" x={0} y={0} />
          </g>
        ))}
      </g>
    </>
  );
}
