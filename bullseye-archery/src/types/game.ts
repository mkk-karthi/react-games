export interface ArrowRecord {
  x: number;
  y: number;
  angle: number;
}

export interface CloudRecord {
  x: number;
  y: number;
  speed: number;
  scale: number;
}

export interface BirdRecord {
  x: number;
  y: number;
  speed: number;
  flap: number;
}

export interface ScoreRecord {
  score: number;
  date: string;
  name?: string;
}

export interface GameStateRef {
  phase: "idle" | "flying";
  dragging: boolean;
  randomAngle: number;
  bowAngle: number;
  pullDist: number;
  arrowPos: { x: number; y: number };
  arrowAngle: number;
  arcPath: { x: number; y: number }[];
  flyDuration: number;
  flyStart: number;
  arrowsOnGround: ArrowRecord[];
  arrowsOnTarget: ArrowRecord[];
  bowScale: number;
  bowStringPoints: string;
  messageOpacity: number;
  messageType: "bullseye" | "hit" | "miss" | null;
  messageFade: number;
  pulseScale: number;
  targetShake: number;
  arcOpacity: number;
  arcD: string;
  arcDHalf: string; // Halved path for the visual aim guide
  bgClouds: CloudRecord[];
  birds: BirdRecord[];
  bowSway: number;
  gameStartTime: number;
}

