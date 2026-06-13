interface BowProps {
  dragging: boolean;
  bowAngle: number;
  bowSway: number;
  bowScale: number;
  bowStringPoints: string;
  pullDist: number;
  arrowVisible: boolean;
}

export default function Bow({
  dragging,
  bowAngle,
  bowSway,
  bowScale,
  bowStringPoints,
  pullDist,
  arrowVisible,
}: BowProps) {
  const stringPoints = bowStringPoints.split(" ").map((p) => p.split(",").map(Number));
  const stringCenterPoint = stringPoints[1] || [88, 250];

  const rotation = dragging ? (bowAngle * 180) / Math.PI : bowSway;

  return (
    <>
      {/* BOW */}
      <g
        id="bow"
        pointerEvents="none"
        className="origin-[88px_250px]"
        style={{
          transform: `rotate(${rotation}deg) scaleX(${bowScale})`,
        }}
      >
        {/* Bow string */}
        <polyline
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          points={bowStringPoints}
        />
        {/* Serving thread */}
        {dragging && (
          <line
            x1={stringCenterPoint[0]}
            y1={stringCenterPoint[1] - 8}
            x2={stringCenterPoint[0]}
            y2={stringCenterPoint[1] + 8}
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        )}

        {/* Recurve Wood Limbs */}
        <path
          fill="none"
          stroke="url(#targetWood)"
          strokeWidth="5"
          strokeLinecap="round"
          d="M88,300 c0-10.1,14-28,14-50s-14-39.9-14-50"
        />
        <path
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M88,300 c0-10.1,14-28,14-50s-14-39.9-14-50"
          opacity="0.6"
        />

        {/* Stylized golden tips */}
        <circle cx="88" cy="200" r="3.5" fill="#f59e0b" stroke="#783e0d" strokeWidth="1" />
        <circle cx="88" cy="300" r="3.5" fill="#f59e0b" stroke="#783e0d" strokeWidth="1" />

        {/* Wood riser grip */}
        <path
          d="M97,238 Q108,246 107,250 Q108,254 97,262 Z"
          fill="#783e0d"
          stroke="#451a03"
          strokeWidth="1"
        />
        <rect x="96.5" y="244" width="5.5" height="12" rx="1" fill="#b45309" opacity="0.9" />
        <line x1="97" y1="248" x2="102" y2="248" stroke="#451a03" strokeWidth="0.75" />
        <line x1="97" y1="252" x2="102" y2="252" stroke="#451a03" strokeWidth="0.75" />
      </g>

      {/* ARROW ON BOW */}
      {arrowVisible && (
        <g
          className="arrow-angle origin-[100px_250px]"
          style={{
            transform: `rotate(${(bowAngle * 180) / Math.PI}deg)`,
          }}
          pointerEvents="none"
        >
          <use xlinkHref="#arrowDef" x={100 - pullDist} y={250} />
        </g>
      )}
    </>
  );
}
