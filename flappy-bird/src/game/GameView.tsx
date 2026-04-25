import { useEffect, useMemo, useRef, useState } from "react";
import { LEVELS, type LevelConfig, type LevelId } from "./levels";
import { createSfx } from "./sfx";
import { loadPersisted, resetPersisted, savePersisted } from "./storage";
import "./flappyTheme.css";
import { Bird } from "./components/Bird";
import { Background } from "./components/background/Background";
import { HUD } from "./components/HUD";
import { Controls } from "./components/Controls";
import { Overlay } from "./components/Overlay";

type GameStatus = "ready" | "running" | "dead" | "paused";

type Pipe = {
  x: number;
  gapY: number;
  passed: boolean;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function GameView() {
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const startingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const persisted0 = useMemo(() => loadPersisted(), []);
  const [muted, setMuted] = useState(persisted0.muted);
  const [unlockedLevel, setUnlockedLevel] = useState<LevelId>(persisted0.unlockedLevel);
  const [bestByLevel, setBestByLevel] = useState(persisted0.bestByLevel);
  const [levelId, setLevelId] = useState<LevelId>(persisted0.unlockedLevel);

  const level: LevelConfig = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];
  const best = bestByLevel[levelId] ?? 0;

  const sfx = useMemo(() => createSfx(), []);

  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const unlockedThisRunRef = useRef(false);
  const [, bump] = useState(0);

  const stateRef = useRef({
    w: 360,
    h: 640,
    birdX: 110,
    birdY: 300,
    birdVy: 0,
    pipes: [] as Pipe[],
    spawnTimer: 0,
    groundX: 0,
  });

  const persist = (next: {
    unlockedLevel?: LevelId;
    bestByLevel?: typeof bestByLevel;
    muted?: boolean;
  }) => {
    savePersisted({ unlockedLevel, bestByLevel, muted, ...next });
  };

  const resetRun = (startRunning: boolean) => {
    const st = stateRef.current;
    st.birdY = st.h * 0.45;
    st.birdVy = 0;
    st.pipes = [];
    st.spawnTimer = 0.6;
    st.groundX = 0;
    unlockedThisRunRef.current = false;
    setScore(0);
    setIsNewBest(false);
    setStatus(startRunning ? "running" : "ready");
    if (startRunning) {
      sfx.play("start", { muted });
      setIsStarting(true);
      if (startingTimeoutRef.current) clearTimeout(startingTimeoutRef.current);
      startingTimeoutRef.current = setTimeout(() => {
        setIsStarting(false);
        startingTimeoutRef.current = null;
      }, 5000);
    }
  };

  const unlockNextLevelIfNeeded = (current: LevelId) => {
    const idx = LEVELS.findIndex((l) => l.id === current);
    const next = LEVELS[idx + 1];
    if (!next || unlockedLevel >= next.id) return;
    setUnlockedLevel(next.id);
    persist({ unlockedLevel: next.id });
    sfx.play("levelUp", { muted });
  };

  // Resize observer
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const parent = stage.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => {
      const rect = parent.getBoundingClientRect();
      const cssW = Math.max(320, Math.floor(rect.width));
      const cssH = Math.max(480, Math.floor(rect.height));
      const st = stateRef.current;
      st.w = cssW;
      st.h = cssH;
      st.birdX = Math.max(92, Math.floor(cssW * 0.28));
      if (status === "ready") st.birdY = cssH * 0.45;
    });
    ro.observe(parent);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Game loop
  useEffect(() => {
    const tick = (tMs: number) => {
      const st = stateRef.current;
      const tPrev = lastTRef.current ?? tMs;
      lastTRef.current = tMs;
      const dt = Math.min(0.033, Math.max(0.001, (tMs - tPrev) / 1000));

      if (status === "running") {
        st.birdVy += level.gravityPxPerSec2 * dt;
        st.birdY += st.birdVy * dt;

        const pipeSpacing = level.pipeDistancePx;
        const pipeWidth = 50;
        const gap = Math.min(level.pipeGapPx, Math.floor(st.h * 0.36));
        const groundH = Math.max(88, Math.floor(st.h * 0.16));
        const groundTopH = 14;
        const playableBottom = st.h - groundH - groundTopH;
        const topBottomPad = Math.max(90, Math.floor(st.h * 0.18));

        st.spawnTimer -= dt;
        if (st.spawnTimer <= 0) {
          st.spawnTimer = Math.max(0.95, pipeSpacing / level.pipeSpeedPxPerSec);
          const gapY = rand(topBottomPad, playableBottom - topBottomPad - gap);
          st.pipes.push({ x: st.w + pipeWidth + 16, gapY, passed: false });
        }

        const dx = level.pipeSpeedPxPerSec * dt;
        for (const p of st.pipes) p.x -= dx;
        st.pipes = st.pipes.filter((p) => p.x > -pipeWidth - 40);

        for (const p of st.pipes) {
          if (!p.passed && p.x + pipeWidth < st.birdX) {
            p.passed = true;
            setScore((s) => s + 1);
            sfx.play("score", { muted });
          }
        }

        st.groundX = (st.groundX + dx) % 64;

        const birdHalfW = 17,
          birdHalfH = 13;
        const birdTop = st.birdY - birdHalfH;
        const birdBottom = st.birdY + birdHalfH;
        const birdLeft = st.birdX - birdHalfW;
        const birdRight = st.birdX + birdHalfW;

        if (birdBottom >= playableBottom || birdTop <= 0) {
          setStatus("dead");
          sfx.play("hit", { muted });
        } else {
          for (const p of st.pipes) {
            const hitX = birdRight > p.x && birdLeft < p.x + pipeWidth;
            const hitY = birdTop < p.gapY || birdBottom > p.gapY + gap;
            if (hitX && hitY) {
              setStatus("dead");
              sfx.play("hit", { muted });
              break;
            }
          }
        }
      }

      bump((v) => (v + 1) % 1000000);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTRef.current = null;
    };
  }, [best, level, muted, score, sfx, status]);

  // Update best on death
  useEffect(() => {
    if (status !== "dead") return;
    setBestByLevel((prev) => {
      const cur = prev[levelId] ?? 0;
      if (score <= cur) return prev;
      setIsNewBest(true);
      const next = { ...prev, [levelId]: score };
      persist({ bestByLevel: next });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Clear starting state if game is interrupted
  useEffect(() => {
    if (status === "paused" || status === "dead") {
      setIsStarting(false);
      if (startingTimeoutRef.current) {
        clearTimeout(startingTimeoutRef.current);
        startingTimeoutRef.current = null;
      }
    }
  }, [status]);

  // Unlock next level milestone
  useEffect(() => {
    if (status !== "running" || unlockedThisRunRef.current || score < 10) return;
    unlockedThisRunRef.current = true;
    unlockNextLevelIfNeeded(levelId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, status]);

  // Input handling
  useEffect(() => {
    const flap = () => {
      const st = stateRef.current;
      if (status === "dead" || status === "paused" || status === "ready") return;
      st.birdVy = level.flapVelocityPxPerSec;
      sfx.play("flap", { muted });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      } else if (e.code === "Enter") {
        if (status !== "running") resetRun(true);
      } else if (e.code === "KeyR") {
        resetRun(false);
      } else if (e.code === "KeyM") {
          const next = !muted;
          setMuted(next);
          persist({ muted: next });
      } else if (e.code === "KeyP" || e.code === "Escape") {
        if (status === "running") setStatus("paused");
        else if (status === "paused") setStatus("running");
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('[data-ui="true"]')) return;
      flap();
      sfx.prime();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [level.flapVelocityPxPerSec, muted, sfx, status]);

  const resetAllProgress = () => {
    resetPersisted();
    const p = loadPersisted();
    setMuted(p.muted);
    setUnlockedLevel(p.unlockedLevel);
    setBestByLevel(p.bestByLevel);
    setLevelId(p.unlockedLevel);
    resetRun(false);
  };

  const canSelectLevel = (id: LevelId) => id <= unlockedLevel;
  const st = stateRef.current;
  const pipeWidth = 56;
  const gap = Math.min(level.pipeGapPx, Math.floor(st.h * 0.36));
  const groundH = Math.max(88, Math.floor(st.h * 0.16));
  const groundTopH = 16;
  const cityH = Math.floor(st.h * 0.22);
  const tilt = Math.max(-18, Math.min(16, (st.birdVy / 800) * 55));

  return (
    <div className="flappyRoot relative h-full w-full overflow-hidden bg-gradient-to-t from-sky-500 to-sky-300">
      {/* stage */}
      <div ref={stageRef} className="absolute inset-0 select-none">
        {/* city + clouds band */}
        <div
          className="absolute inset-x-0"
          style={{ height: `${cityH}px`, bottom: `${groundH + groundTopH}px` }}
        >
          <div className="w-[120vw] h-full flex z-[1]">
            {Array.from({ length: Math.ceil(screenWidth / 100) }).map((_, i) => (
              <Background key={i} />
            ))}
          </div>
        </div>

        {/* pipes */}
        {st.pipes.map((p, i) => {
          const capH = 18;
          const capW = pipeWidth + 12;
          const topH = Math.max(0, Math.floor(p.gapY));
          const botY = Math.floor(p.gapY + gap);
          const playableBottom = st.h - groundH - groundTopH;
          const botH = Math.max(0, playableBottom - botY);
          return (
            <div
              key={i}
              className="absolute left-0 top-0"
              style={{ transform: `translateX(${p.x}px)` }}
            >
              <div
                className="fb-pipe absolute left-0 top-0"
                style={{ width: pipeWidth, height: topH }}
              />
              <div
                className="fb-pipeCap absolute"
                style={{ width: capW, height: capH, left: -6, top: Math.max(0, topH - capH) }}
              />
              <div
                className="fb-pipe absolute left-0"
                style={{ width: pipeWidth, top: botY, height: botH }}
              />
              <div
                className="fb-pipeCap absolute"
                style={{ width: capW, height: capH, left: -6, top: botY }}
              />
            </div>
          );
        })}

        {/* bird */}
        <Bird className="absolute z-[3]" birdX={st.birdX} birdY={st.birdY} tilt={tilt} />

        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 border-t-2 border-yellow-950">
          <div
            className="relative bg-lime-300 border-y-[3px] border-t-lime-300 border-b-lime-700"
            style={{ height: groundTopH }}
          >
            <div
              className="absolute inset-y-0 left-0 right-0"
              style={{
                background: "repeating-linear-gradient(135deg,#5ea500 0 5px,transparent 5px 10px)",
                transform: `translateX(${-Math.floor(st.groundX)}px)`,
              }}
            />
          </div>
          <div
            className="relative bg-amber-200 border-t-[3px] border-t-yellow-500"
            style={{ height: groundH }}
          />
        </div>

        {/* HUD: score centred at top */}
        <HUD score={score} best={best} status={status} />

        {/* TOP-RIGHT: sound + pause */}
        <Controls
          muted={muted}
          setMuted={setMuted}
          status={status}
          setStatus={setStatus}
          persist={persist}
        />

        {/* OVERLAY: Game Over / Paused / Ready */}
        <Overlay
          status={status}
          score={score}
          best={Math.max(best, score)}
          isNewBest={isNewBest}
          levelId={levelId}
          setLevelId={setLevelId}
          canSelectLevel={canSelectLevel}
          resetRun={resetRun}
          resetAllProgress={resetAllProgress}
          setStatus={setStatus}
          isStarting={isStarting}
        />
      </div>
    </div>
  );
}
