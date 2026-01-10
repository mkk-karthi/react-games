import { useEffect, useMemo, useRef } from "react";
import { soundBoard } from "./audio";
import { Board } from "./components/Board";
import { BoardOverlay } from "./components/BoardOverlay";
import { ControlsCard } from "./components/ControlsCard";
import { Hud } from "./components/Hud";
import { NextQueue } from "./components/NextQueue";
import { useGameEngine } from "./game";
import { MobileControls } from "./components/MobileControls";
import useFaviconTheme from "./hooks/useFaviconTheme";

export default function App() {
  const {
    state,
    ghost,
    nextPieces,
    start,
    togglePause,
    restart,
    moveLeft,
    moveRight,
    softDrop,
    hardDrop,
    rotateCW,
    rotateCCW,
  } = useGameEngine();

  const stateRef = useRef(state);
  const lastSnapshot = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const prev = lastSnapshot.current;
    if (state.lines > prev.lines) soundBoard.play("lineClear");
    if (state.level > prev.level) soundBoard.play("levelUp");
    if (state.status === "over" && prev.status !== "over") soundBoard.play("gameOver");
    lastSnapshot.current = state;
  }, [state]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if(event.repeat) return
      const current = stateRef.current;
      const key = event.key.toLowerCase();

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "p" || key === "escape") {
        togglePause();
        return;
      }

      if (key === "enter") {
        if (current.status === "over") {
          restart();
        } else {
          start();
        }
        return;
      }

      if (current.status !== "playing") {
        if (key === " ") {
          if (current.status === "paused") togglePause();
          else if (current.status === "over") restart();
          else start();
        }
        return;
      }

      switch (key) {
        case "arrowleft":
        case "a":
          moveLeft();
          soundBoard.play("move");
          break;
        case "arrowright":
        case "d":
          moveRight();
          soundBoard.play("move");
          break;
        case "arrowup":
        case "w":
        case "x":
          rotateCW();
          soundBoard.play("rotate");
          break;
        case "z":
        case "q":
          rotateCCW();
          soundBoard.play("rotate");
          break;
        case "arrowdown":
        case "s":
          softDrop();
          soundBoard.play("drop");
          break;
        case " ":
          hardDrop();
          soundBoard.play("drop");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hardDrop, moveLeft, moveRight, rotateCCW, rotateCW, softDrop, start, togglePause, restart]);

  const statusBadge = useMemo(() => {
    if (state.status === "playing") return "▶ Playing";
    if (state.status === "paused") return "⏸ Paused";
    if (state.status === "over") return "💥 Game Over";
    return "🐠 Ready";
  }, [state.status]);

  const primaryLabel =
    state.status === "playing"
      ? "⏸ Pause"
      : state.status === "paused"
      ? "▶ Resume"
      : state.status === "over"
      ? "↻ Restart"
      : "🚀 Start";

  const handlePrimary = () => {
    if (state.status === "playing") {
      togglePause();
    } else if (state.status === "paused") {
      togglePause();
    } else if (state.status === "over") {
      restart();
    } else {
      start();
    }
  };

  useFaviconTheme();
  
  return (
    <div className="relative flex min-h-screen lg:w-screen overflow-hidden text-ocean-50">
      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-14 lg:top-20 left-1/3 lg:left-40 text-4xl animate-float"
          style={{ animationDelay: "0s" }}
        >
          🐟
        </div>
        <div
          className="absolute top-1/3 left-2 sm:left-10 lg:left-[28.5%] text-2xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          🐠
        </div>
        <div
          className="absolute bottom-1 left-20 lg:left-32 text-4xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          🦈
        </div>
        <div
          className="absolute top-[22%] lg:top-28 right-10 lg:right-28 text-3xl animate-float"
          style={{ animationDelay: "2.5s" }}
        >
          🐳
        </div>
        <div
          className="absolute bottom-[30%] lg:bottom-1/4 left-1/3 text-3xl animate-float"
          style={{ animationDelay: "1.2s" }}
        >
          🐙
        </div>
        <div
          className="absolute top-1/2 right-2 lg:right-[28.5%] text-3xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          🦀
        </div>
        <div
          className="absolute bottom-2 right-10 text-3xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          🐡
        </div>
        {/* Bubbles */}
        <div
          className="absolute top-20 right-1/4 lg:right-1/3 w-3 h-3 rounded-full bg-cyan-300/40 animate-bubble"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/4 sm:top-1/4 lg:top-40 left-1/2 lg:left-1/3 w-4 h-4 rounded-full bg-blue-300/40 animate-bubble"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-2 h-2 rounded-full bg-sky-300/40 animate-bubble"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 sm:top-1/2 lg:top-2/3 left-2 sm:left-20 lg:left-[30%] w-3 h-3 rounded-full bg-cyan-200/40 animate-bubble"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-24 sm:top-20 left-1/4 sm:left-20 lg:left-1/2 w-3 h-3 rounded-full bg-cyan-300/40 animate-bubble"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-10 left-2 sm:left-10 w-4 h-4 rounded-full bg-blue-300/40 animate-bubble"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-32 right-10 w-2 h-2 rounded-full bg-sky-300/40 animate-bubble"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 left-3/4 w-3 h-3 rounded-full bg-cyan-200/40 animate-bubble"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <main className="relative w-full grid sm:grid-cols-2 lg:grid-cols-7 lg:grid-rows-5 gap-2 lg:gap-3 p-4 z-10">
        {/* Header */}
        <div className="sm:col-span-2 lg:row-span-1 flex items-center justify-center">
          <h1 className="font-semibold uppercase tracking-[0.2em] my-2">
            <span className="text-xl sm:text-2xl">🐬</span>
            <span className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 align-sub mx-2">
              Puzzle Tetris
            </span>
            <span className="text-xl sm:text-2xl">🌊</span>
          </h1>
        </div>

        {/* Board */}
        <div className="sm:col-span-2 lg:col-span-3 lg:row-span-5 lg:col-start-3 relative mx-auto w-full">
          <Board
            board={state.board}
            active={state.active}
            ghost={ghost}
            className="mx-auto max-w-[90%] md:max-w-[70%] lg:max-w-[75%] sm:my-3"
          />
          <BoardOverlay
            status={state.status}
            onPrimary={handlePrimary}
            className="mx-auto max-w-[80%]"
          />
        </div>

        {/* Stat */}
        <div className="lg:col-span-2 lg:row-span-1 lg:col-start-6 hidden lg:block">
          <div className="flex justify-center items-center gap-3 lg:mt-3 py-3 h-full">
            <span className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
              {statusBadge}
            </span>
            <button
              onClick={handlePrimary}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-abyss shadow-glow transition hover:scale-[1.02]"
            >
              {primaryLabel}
            </button>
            <button
              onClick={restart}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35"
            >
              ↻ Reset
            </button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="sm:col-span-2 lg:hidden mx-auto">
          <MobileControls
            primaryLabel={primaryLabel}
            handlePrimary={handlePrimary}
            moveLeft={moveLeft}
            moveRight={moveRight}
            hardDrop={hardDrop}
            rotateCW={rotateCW}
            restart={restart}
          />
        </div>
        <div className="sm:col-span-1 lg:col-span-2 lg:row-span-2 lg:col-start-6 row-start-2 content-center">
          <Hud score={state.score} level={state.level} lines={state.lines} />
        </div>
        <div className="sm:col-span-1 lg:col-span-2 lg:row-span-2 lg:col-start-6 lg:row-start-4 sm:row-start-2 content-center">
          <NextQueue pieces={nextPieces} />
        </div>
        <div className="hidden lg:grid gap-3 lg:col-span-2 lg:row-span-4 lg:row-start-2">
          <ControlsCard />
        </div>
      </main>
    </div>
  );
}
