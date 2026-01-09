import React, { useEffect, useRef, useState } from "react";
import { GameEngine } from "../engine/GameEngine";
import { InputManager } from "../engine/InputManager";
import type { GameState } from "../types/game";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Block } from "./Block";
import { FloatingText } from "./FloatingText";
import { ParticleExplosion } from "./ParticleExplosion";
import { GameUI } from "./UI/GameUI";
import { StartScreen } from "./UI/StartScreen";
import { GameOverScreen } from "./UI/GameOverScreen";

export const GameBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);

  // Refs for direct DOM manipulation (Performance optimization)
  const paddleRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  // State for UI rendering (Game loop updates this only when necessary)
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Track last rendered state to avoid unnecessary React re-renders
  const lastStateRef = useRef({
    score: -1,
    lives: -1,
    level: -1,
    gameStatus: "idle",
    totalDurability: -1,
  });

  const [floatingTexts, setFloatingTexts] = useState<
    Array<{ id: string; x: number; y: number; text: string; color?: string }>
  >([]);
  const [explosions, setExplosions] = useState<
    Array<{ id: string; x: number; y: number; color: string }>
  >([]);
  const [isMuted, setIsMuted] = useState(false);
  const lastEventIdRef = useRef<string>("");
  const [boardSize, setBoardSize] = useState({ width: 800, height: 600 });
  const [error, setError] = useState<string | null>(null);

  // Initialize game engine and input manager
  useEffect(() => {

    const updateBoardSize = () => {
      // Use window/viewport size for max constraints
      const padding = window.innerWidth < 640 ? 10 : 40;
      const maxWidth = Math.min(window.innerWidth - padding, 900);
      const maxHeight = Math.min(window.innerHeight - padding, 800);

      // maintain aspect ratio based on orientation
      // Mobile = 3:4 (Vertical), Desktop = 4:3 (Horizontal)
      const isMobile = window.innerWidth < 640;
      const aspectRatio = isMobile ? 3 / 4 : 4 / 3;

      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      setBoardSize({ width, height });
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);

    return () => {
      window.removeEventListener("resize", updateBoardSize);
    };
  }, []);

  // Initialize engine when board size is set
  useEffect(() => {
    if (!containerRef.current) {
      console.warn("[GameBoard] Container ref missing, skipping init");
      return;
    }

    if (engineRef.current) {
      return;
    }

    try {
      const engine = new GameEngine(boardSize.width, boardSize.height);
      const inputManager = new InputManager();

      engineRef.current = engine;
      inputManagerRef.current = inputManager;

      // Set up game state updates
      engine.onUpdate((state) => {
        // 1. Direct DOM updates for high-frequency changes (Position)
        if (paddleRef.current) {
          paddleRef.current.style.transform = `translate(${state.paddle.position.x}px, ${state.paddle.position.y}px)`;
        }

        if (ballRef.current) {
          ballRef.current.style.transform = `translate(${state.ball.position.x}px, ${state.ball.position.y}px)`;
        }

        // Apply Screen Shake
        if (containerRef.current) {
          if (state.shake > 0.5) {
            const shakeX = (Math.random() - 0.5) * state.shake;
            const shakeY = (Math.random() - 0.5) * state.shake;
            containerRef.current.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
          } else {
            containerRef.current.style.transform = "none";
          }
        }

        // 2. Selective React State update for UI changes (Score, Lives, Blocks)
        const currentTotalDurability = state.blocks.reduce(
          (sum, b) => sum + (b.isDestroyed ? 0 : b.durability),
          0
        );

        const prev = lastStateRef.current;
        const needsRender =
          state.score !== prev.score ||
          state.lives !== prev.lives ||
          state.level !== prev.level ||
          state.gameStatus !== prev.gameStatus ||
          currentTotalDurability !== prev.totalDurability;

        if (needsRender) {
          setGameState(state);
          lastStateRef.current = {
            score: state.score,
            lives: state.lives,
            level: state.level,
            gameStatus: state.gameStatus,
            totalDurability: currentTotalDurability,
          };
        } else if (!gameState) {
          // Ensure initial render happens
          setGameState(state);
        }
        // Check for score increase to spawn floating text
        if (state.score > prev.score) {
          const gained = state.score - prev.score;
          const textId = Date.now().toString() + Math.random();
          setFloatingTexts((prevTexts) => [
            ...prevTexts,
            {
              id: textId,
              x: state.ball.position.x,
              y: state.ball.position.y,
              text: `+${gained}`,
              color: "#fff", // White text for visibility
            },
          ]);
        }

        // Check for new events (e.g., block destruction) to trigger effects
        if (state.lastEvent && state.lastEvent.id !== lastEventIdRef.current) {
          lastEventIdRef.current = state.lastEvent.id;
          if (state.lastEvent.type === "blockBreak") {
            const { position, color } = state.lastEvent;
            setExplosions((prevExplosions) => [
              ...prevExplosions,
              { id: state.lastEvent!.id, x: position.x, y: position.y, color: color },
            ]);
          }
        }
      });

      // Initialize input manager
      inputManager.initialize(containerRef.current);

      // Subscribe to input changes
      inputManager.subscribe(() => {
        const input = inputManager.getState();

        if (!engine) return;

        // Update engine input state for loop-based controls (keyboard)
        engine.setInput(input);

        // Update paddle position for touch (mouse disabled)
        if (input.inputMethod === "touch") {
          engine.updatePaddlePosition(input.touchX);
        }

        // Launch ball
        if (input.spacePressed) {
          engine.launch();
        }
      });

      // Start game loop
      engine.startGameLoop();

      // Set initial state force (to ensure mapped elements render)
      const initialState = engine.getState();
      setGameState(initialState);

      // Initialize ref tracker
      lastStateRef.current = {
        score: initialState.score,
        lives: initialState.lives,
        level: initialState.level,
        gameStatus: initialState.gameStatus,
        totalDurability: initialState.blocks.reduce((sum, b) => sum + b.durability, 0),
      };
    } catch (err: any) {
      console.error("[GameBoard] Error initializing game:", err);
      setError(err.message || String(err));
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stopGameLoop();
        engineRef.current = null;
      }
      if (inputManagerRef.current) {
        inputManagerRef.current.cleanup();
        inputManagerRef.current = null;
      }
    };
  }, [boardSize]);

  const handleStart = () => {
    if (engineRef.current) {
      engineRef.current.start();
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.reset();
      engineRef.current.start();
    }
  };

  const handleToggleMute = () => {
    if (engineRef.current) {
      const soundManager = engineRef.current.getSoundManager();
      soundManager.toggleMute();
      setIsMuted(soundManager.getMuted());
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-cyber">
        Error: {error}
      </div>
    );
  }

  // Always render the container to ensure ref is attached
  return (
    <div className="flex justify-center items-center min-h-screen p-4 font-cyber overflow-hidden flex-col lg:flex-row">
      <h1 className="text-4xl font-bold m-2 text-glow bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent text-center lg:[writing-mode:sideways-lr]">
        Block Breaker
      </h1>
      <div className="flex items-center lg:items-start justify-center h-full overflow-hidden flex-col lg:flex-row-reverse">
        {/* Game UI */}
        {gameState ? (
          <GameUI
            gameState={gameState}
            onPause={handlePause}
            onResume={handleResume}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
          />
        ) : (
          ""
        )}
        <div
          ref={containerRef}
          className="relative glass-effect rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: `${boardSize.width}px`,
            height: `${boardSize.height}px`,
          }}
        >
          {gameState ? (
            <>
              {/* Game entities */}
              <div className="absolute inset-0 z-10">
                {/* Blocks */}
                {gameState.blocks.map((block) => (
                  <Block key={block.id} block={block} />
                ))}

                {/* Ball */}
                <Ball ref={ballRef} ball={gameState.ball} />

                {/* Paddle */}
                <Paddle ref={paddleRef} paddle={gameState.paddle} />

                {/* Floating Texts */}
                {floatingTexts.map((item) => (
                  <FloatingText
                    key={item.id}
                    item={item}
                    onComplete={(id) => setFloatingTexts((prev) => prev.filter((t) => t.id !== id))}
                  />
                ))}

                {/* Explosions */}
                {explosions.map((ex) => (
                  <ParticleExplosion
                    key={ex.id}
                    x={ex.x}
                    y={ex.y}
                    color={ex.color}
                    onComplete={() => setExplosions((prev) => prev.filter((e) => e.id !== ex.id))}
                  />
                ))}
              </div>

              {/* Start screen */}
              {gameState.gameStatus === "idle" && (
                <StartScreen
                  onStart={handleStart}
                  inputMethod={inputManagerRef.current?.getState().inputMethod || "mouse"}
                />
              )}

              {/* Paused overlay */}
              {gameState.gameStatus === "paused" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                  <div className="text-6xl font-bold text-glow text-neon-blue animate-pulse font-cyber">
                    PAUSED
                  </div>
                </div>
              )}

              {/* Game over screen */}
              {(gameState.gameStatus === "gameOver" || gameState.gameStatus === "victory") && (
                <GameOverScreen
                  score={gameState.score}
                  isVictory={gameState.gameStatus === "victory"}
                  onRestart={handleRestart}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-2xl animate-pulse font-cyber">Loading Game...</div>
            </div>
          )}

          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="retro-grid" />
          </div>
        </div>
      </div>
    </div>
  );
};
