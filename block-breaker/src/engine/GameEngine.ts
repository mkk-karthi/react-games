import type { GameState, Block, InputState } from "../types/game";
import { CollisionDetector } from "./CollisionDetector";
import { SoundManager } from "../audio/SoundManager";

export class GameEngine {
  private gameState: GameState;
  private soundManager: SoundManager;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private ballAttachedToPaddle = true;
  private onStateChange: ((state: GameState) => void) | null = null;
  private inputState: InputState | null = null;

  constructor(boardWidth: number, boardHeight: number) {
    this.soundManager = new SoundManager();
    const savedLevel =
      typeof localStorage !== "undefined" ? localStorage.getItem("block-breaker-level") : null;
    const initialLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
    this.gameState = this.createInitialState(boardWidth, boardHeight, initialLevel);
  }

  private createInitialState(
    boardWidth: number,
    boardHeight: number,
    level: number = 1
  ): GameState {
    const paddleWidth = Math.min(120, boardWidth * 0.15);
    const paddleHeight = 12;
    const ballRadius = 8;

    const state: GameState = {
      ball: {
        position: {
          x: boardWidth / 2,
          y: boardHeight - paddleHeight - 30 - ballRadius,
        },
        velocity: { x: 0, y: 0 },
        radius: ballRadius,
        speed: 5,
      },
      paddle: {
        position: {
          x: boardWidth / 2 - paddleWidth / 2,
          y: boardHeight - paddleHeight - 20,
        },
        width: paddleWidth,
        height: paddleHeight,
        speed: 8,
      },
      blocks: [], // temporary
      score: 0,
      lives: 3,
      level: level,
      gameStatus: "idle",
      boardWidth,
      boardHeight,
      shake: 0,
    };

    state.blocks = this.createBlocks(boardWidth, boardHeight, level);
    return state;
  }

  private createBlocks(boardWidth: number, _boardHeight: number, level: number): Block[] {
    const blocks: Block[] = [];
    const rows = Math.min(level, 10);
    const cols = 10;
    const blockHeight = 25;
    const padding = 1;
    const totalPadding = (cols + 1) * padding + 10; // extra side padding
    const blockWidth = Math.floor((boardWidth - totalPadding) / cols);
    const offsetX = (boardWidth - (cols * blockWidth + (cols - 1) * padding)) / 2;
    const offsetY = Math.max(120 - (level * 10), 20);

    const colors = [
      "#ff006e", // Pink
      "#bf00ff", // Purple
      "#00f3ff", // Blue
      "#39ff14", // Green
      "#ffea00", // Yellow
      "#ff6b35", // Orange
    ];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const durability = rows - row; // Top rows are stronger
        blocks.push({
          id: `block-${row}-${col}`,
          position: {
            x: offsetX + col * blockWidth + padding,
            y: offsetY + row * (blockHeight + padding),
          },
          width: blockWidth - padding * 2,
          height: blockHeight,
          durability,
          maxDurability: durability,
          color: colors[row%colors.length],
          points: durability * 10,
          isDestroyed: false,
        });
      }
    }

    return blocks;
  }

  start() {
    if (this.gameState.gameStatus === "idle") {
      this.gameState.gameStatus = "playing";
      this.ballAttachedToPaddle = true;
      this.notifyStateChange();
    }
  }

  launch() {
    if (this.ballAttachedToPaddle && this.gameState.gameStatus === "playing") {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4; // Slight random angle
      this.gameState.ball.velocity = {
        x: Math.cos(angle) * this.gameState.ball.speed,
        y: Math.sin(angle) * this.gameState.ball.speed,
      };
      this.ballAttachedToPaddle = false;
      this.soundManager.playSound("launch");
      this.notifyStateChange();
    }
  }

  pause() {
    if (this.gameState.gameStatus === "playing") {
      this.gameState.gameStatus = "paused";
      this.notifyStateChange();
    }
  }

  resume() {
    if (this.gameState.gameStatus === "paused") {
      this.gameState.gameStatus = "playing";
      this.notifyStateChange();
    }
  }

  updatePaddlePosition(targetX: number) {
    const halfWidth = this.gameState.paddle.width / 2;
    this.gameState.paddle.position.x = Math.max(
      0,
      Math.min(this.gameState.boardWidth - this.gameState.paddle.width, targetX - halfWidth)
    );

    // If ball is attached, move it with paddle
    if (this.ballAttachedToPaddle) {
      this.gameState.ball.position.x = this.gameState.paddle.position.x + halfWidth;
    }

    this.notifyStateChange();
  }

  private update(deltaTime: number) {
    if (this.gameState.gameStatus !== "playing") {
      return;
    }

    const dt = Math.min(deltaTime, 0.033); // Cap at ~30fps to prevent large jumps

    // Handle Input
    if (this.inputState && this.inputState.inputMethod === "keyboard") {
      const paddleSpeed = 600 * dt; // Speed in pixels per second
      let newX = this.gameState.paddle.position.x + this.gameState.paddle.width / 2;

      if (this.inputState.keyLeft) {
        newX -= paddleSpeed;
      }
      if (this.inputState.keyRight) {
        newX += paddleSpeed;
      }

      this.updatePaddlePosition(newX);
    }

    // Decay shake
    if (this.gameState.shake > 0) {
      this.gameState.shake *= 0.9;
      if (this.gameState.shake < 0.5) {
        this.gameState.shake = 0;
      }
    }

    // Update ball position
    this.gameState.ball.position.x += this.gameState.ball.velocity.x;
    this.gameState.ball.position.y += this.gameState.ball.velocity.y;

    // Wall collisions
    const { ball, boardWidth, boardHeight } = this.gameState;

    // Left and right walls
    if (ball.position.x - ball.radius <= 0) {
      ball.position.x = ball.radius;
      ball.velocity.x = Math.abs(ball.velocity.x);
      this.soundManager.playSound("wallHit");
    } else if (ball.position.x + ball.radius >= boardWidth) {
      ball.position.x = boardWidth - ball.radius;
      ball.velocity.x = -Math.abs(ball.velocity.x);
      this.soundManager.playSound("wallHit");
    }

    // Top wall
    if (ball.position.y - ball.radius <= 0) {
      ball.position.y = ball.radius;
      ball.velocity.y = Math.abs(ball.velocity.y);
      ball.velocity.y = Math.abs(ball.velocity.y);
      this.soundManager.playSound("wallHit");
    }

    // Bottom wall (lose life)
    if (ball.position.y - ball.radius > boardHeight) {
      this.loseLife();
      return;
    }

    // Paddle collision
    const paddleCollision = CollisionDetector.checkCircleRect(
      ball.position,
      ball.radius,
      this.gameState.paddle.position,
      this.gameState.paddle.width,
      this.gameState.paddle.height
    );

    if (paddleCollision.collided && ball.velocity.y > 0) {
      // Calculate bounce angle based on hit position
      const bounceAngle = CollisionDetector.calculatePaddleBounceAngle(
        ball.position.x,
        this.gameState.paddle.position.x,
        this.gameState.paddle.width
      );

      const speed = CollisionDetector.length(ball.velocity);
      ball.velocity.x = Math.sin(bounceAngle) * speed;
      ball.velocity.y = -Math.cos(bounceAngle) * speed;

      // Move ball above paddle
      ball.position.y = this.gameState.paddle.position.y - ball.radius;

      ball.position.y = this.gameState.paddle.position.y - ball.radius;

      this.soundManager.playSound("paddleHit");
    }

    // Block collisions
    for (const block of this.gameState.blocks) {
      if (block.isDestroyed) continue;

      const collision = CollisionDetector.checkCircleRect(
        ball.position,
        ball.radius,
        block.position,
        block.width,
        block.height
      );

      if (collision.collided && collision.normal) {
        // Reflect ball velocity
        const reflected = CollisionDetector.reflect(ball.velocity, collision.normal);
        ball.velocity = reflected;

        // Move ball out of block
        if (collision.penetration) {
          ball.position.x += collision.normal.x * collision.penetration;
          ball.position.y += collision.normal.y * collision.penetration;
        }

        // Damage block
        block.durability--;
        if (block.durability <= 0) {
          block.isDestroyed = true;
          this.gameState.score += block.points;
          this.soundManager.playSound("blockBreak");

          this.gameState.lastEvent = {
            id: `break-${block.id}-${Date.now()}`,
            type: "blockBreak",
            position: {
              x: block.position.x + block.width / 2,
              y: block.position.y + block.height / 2,
            },
            color: block.color,
          };

          // Check for victory
          if (this.gameState.blocks.every((b) => b.isDestroyed)) {
            this.victory();
          }
          this.gameState.shake = 4;
        } else {
          this.soundManager.playSound("blockHit");
        }

        break; // Only one block collision per frame
      }
    }

    this.notifyStateChange();
  }

  private loseLife() {
    this.soundManager.playSound("loseLife");
    this.gameState.lives--;

    if (this.gameState.lives <= 0) {
      this.gameOver();
    } else {
      // Reset ball and paddle
      this.resetBallAndPaddle();
    }

    this.notifyStateChange();
  }

  private resetBallAndPaddle() {
    const { boardWidth, boardHeight, paddle, ball } = this.gameState;

    paddle.position.x = boardWidth / 2 - paddle.width / 2;
    ball.position.x = boardWidth / 2;
    ball.position.y = boardHeight - paddle.height - 30 - ball.radius;
    ball.velocity = { x: 0, y: 0 };
    this.ballAttachedToPaddle = true;
  }

  private gameOver() {
    this.gameState.gameStatus = "gameOver";
    this.soundManager.playSound("gameOver");
    this.notifyStateChange();
  }

  private victory() {
    this.gameState.gameStatus = "victory";
    this.soundManager.playSound("victory");

    // Level up logic
    const nextLevel = Math.min(this.gameState.level + 1, 10);
    this.gameState.level = nextLevel;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("block-breaker-level", nextLevel.toString());
    }

    this.notifyStateChange();
  }

  resetLevelProgress() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("block-breaker-level", "1");
    }
    this.gameState.level = 1;
    this.reset();
  }

  reset() {
    this.gameState = this.createInitialState(
      this.gameState.boardWidth,
      this.gameState.boardHeight,
      this.gameState.level
    );
    this.ballAttachedToPaddle = true;
    this.notifyStateChange();
  }

  startGameLoop() {
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      this.update(deltaTime);

      this.animationFrameId = requestAnimationFrame(gameLoop);
    };

    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  stopGameLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  onUpdate(callback: (state: GameState) => void) {
    this.onStateChange = callback;
  }

  setInput(input: InputState) {
    this.inputState = input;
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.gameState });
    }
  }

  getState(): GameState {
    return { ...this.gameState };
  }

  getSoundManager(): SoundManager {
    return this.soundManager;
  }
}
