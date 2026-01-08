export interface Vector2D {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  speed: number;
}

export interface Paddle {
  position: Vector2D;
  width: number;
  height: number;
  speed: number;
}

export interface Block {
  id: string;
  position: Vector2D;
  width: number;
  height: number;
  durability: number;
  maxDurability: number;
  color: string;
  points: number;
  isDestroyed: boolean;
}

export interface GameState {
  ball: Ball;
  paddle: Paddle;
  blocks: Block[];
  score: number;
  lives: number;
  level: number;
  gameStatus: "idle" | "playing" | "paused" | "gameOver" | "victory";
  boardWidth: number;
  boardHeight: number;
  shake: number;
  lastEvent?: {
    id: string;
    type: "blockBreak" | "paddleHit";
    position: { x: number; y: number };
    color: string;
  };
}

export interface CollisionResult {
  collided: boolean;
  normal?: Vector2D;
  penetration?: number;
}

export interface InputState {
  mouseX: number;
  touchX: number;
  keyLeft: boolean;
  keyRight: boolean;
  spacePressed: boolean;
  touchActive: boolean;
  inputMethod: "mouse" | "keyboard" | "touch";
}

export type SoundEffect =
  | "paddleHit"
  | "blockHit"
  | "wallHit"
  | "blockBreak"
  | "gameOver"
  | "victory"
  | "launch"
  | "loseLife";
