import { CloudRecord, BirdRecord } from "../types/game";

interface BackgroundProps {
  bgClouds: CloudRecord[];
  birds: BirdRecord[];
  renderTick: number;
  isMobileOrTablet?: boolean;
}

export default function Background({ bgClouds, birds, renderTick, isMobileOrTablet = false }: BackgroundProps) {
  const groundY = isMobileOrTablet ? 265 : 295;
  const groundHeight = 400 - groundY + 30;

  return (
    <g id="background-elements" data-tick={renderTick}>
      {/* CLOUDS */}
      {bgClouds.map((c, i) => (
        <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.scale})`} opacity="0.8" pointerEvents="none">
          <ellipse cx="0" cy="0" rx="38" ry="16" fill="white" />
          <ellipse cx="-20" cy="5" rx="24" ry="14" fill="white" />
          <ellipse cx="20" cy="5" rx="28" ry="12" fill="white" />
          <ellipse cx="0" cy="8" rx="36" ry="12" fill="white" />
        </g>
      ))}

      {/* BIRDS */}
      {birds.map((b, i) => {
        const flapY = Math.sin(b.flap) * 5;
        return (
          <g key={i} transform={`translate(${b.x}, ${b.y})`} opacity="0.65" pointerEvents="none">
            <path d={`M0,0 Q-10,${-flapY} -18,3`} fill="none" stroke="#334155" strokeWidth="1.75" strokeLinecap="round" />
            <path d={`M0,0 Q10,${-flapY} 18,3`} fill="none" stroke="#334155" strokeWidth="1.75" strokeLinecap="round" />
          </g>
        );
      })}

      {/* GROUND */}
      <rect x="-50" y={groundY} width="1100" height={groundHeight} fill="url(#groundGrad)" pointerEvents="none" />

      {/* Decorative Grass Tufts */}
      {[50, 120, 200, 300, 420, 530, 640, 720, 800, 870, 950].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${groundY})`}>
          <line x1="0" y1="0" x2="-5" y2="-11" stroke="#4d7c0f" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="-14" stroke="#84cc16" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="5" y2="-10" stroke="#4d7c0f" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      ))}

      {/* TREE LEFT decoration */}
      <g transform={`translate(30, ${isMobileOrTablet ? 170 : 200})`} opacity="0.9" pointerEvents="none">
        <rect x="-5" y="60" width="10" height="75" fill="#5c3d1e" rx="2" />
        <ellipse cx="0" cy="45" rx="28" ry="32" fill="#2d6e20" />
        <ellipse cx="-8" cy="38" rx="18" ry="22" fill="#3d8a2f" />
        <ellipse cx="8" cy="40" rx="16" ry="20" fill="#3d8a2f" />
      </g>

      {/* TREE RIGHT decoration */}
      <g transform={`translate(975, ${isMobileOrTablet ? 180 : 210})`} opacity="0.85" pointerEvents="none">
        <rect x="-4" y="55" width="8" height="70" fill="#5c3d1e" rx="2" />
        <ellipse cx="0" cy="40" rx="22" ry="28" fill="#2d6e20" />
        <ellipse cx="-6" cy="32" rx="14" ry="18" fill="#3d8a2f" />
      </g>
    </g>
  );
}
