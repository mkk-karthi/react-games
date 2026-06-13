import { useState, useEffect, useRef, useCallback } from "react";
import { GameStateRef, ScoreRecord } from "./types/game";
import { playSound } from "./utils/audio";
import { lerp, easeOut, buildArcPath } from "./utils/math";
import HelpModal from "./components/HelpModal";
import IntroScreen from "./components/IntroScreen";
import GameOverScreen from "./components/GameOverScreen";
import Background from "./components/Background";
import GameHUD from "./components/GameHUD";
import Target from "./components/Target";
import Bow from "./components/Bow";

const SCORES_KEY = "bullseye_scores_v1";
const MAX_ARROWS = 10;
const GAME_DURATION = 60000; // 60 seconds

export default function BullseyeGame() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animRef = useRef<number | null>(null);
  
  const stateRef = useRef<GameStateRef>({
    phase: "idle",
    dragging: false,
    randomAngle: 0,
    bowAngle: 0,
    pullDist: 0,
    arrowPos: { x: 0, y: 0 },
    arrowAngle: 0,
    arcPath: [],
    flyDuration: 500,
    flyStart: 0,
    arrowsOnGround: [],
    arrowsOnTarget: [],
    bowScale: 1,
    bowStringPoints: "88,200 88,250 88,300",
    messageOpacity: 0,
    messageType: null,
    messageFade: 0,
    pulseScale: 1,
    targetShake: 0,
    arcOpacity: 0,
    arcD: "",
    arcDHalf: "",
    bgClouds: [
      { x: 80, y: 40, speed: 0.008, scale: 1.2 },
      { x: 320, y: 70, speed: 0.005, scale: 0.8 },
      { x: 560, y: 30, speed: 0.007, scale: 1.0 },
      { x: 750, y: 55, speed: 0.006, scale: 0.9 },
      { x: 900, y: 25, speed: 0.009, scale: 0.7 },
    ],
    birds: [
      { x: 200, y: 60, speed: 0.4, flap: 0 },
      { x: 500, y: 80, speed: 0.3, flap: 1.2 },
      { x: 750, y: 50, speed: 0.5, flap: 0.6 },
    ],
    bowSway: 0,
    gameStartTime: 0,
  });

  const [gameState, setGameState] = useState<"intro" | "playing" | "ended">("intro");
  const [score, setScore] = useState(0);
  const [arrowsLeft, setArrowsLeft] = useState(MAX_ARROWS);
  const [muted, setMuted] = useState(false);
  const [scores, setScores] = useState<ScoreRecord[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.score - a.score);
      }
      return [];
    } catch {
      return [];
    }
  });
  const [renderTick, setRenderTick] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [endReason, setEndReason] = useState<"arrows" | "timer">("arrows");
  const [showHelp, setShowHelp] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Floating notifications states
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scorePopupText, setScorePopupText] = useState("");
  const [scorePopupColor, setScorePopupColor] = useState("");
  const [scorePopupKey, setScorePopupKey] = useState(0);

  const [showArrowPopup, setShowArrowPopup] = useState(false);
  const [arrowPopupKey, setArrowPopupKey] = useState(0);

  const triggerScorePopup = useCallback((text: string, color: string) => {
    setScorePopupText(text);
    setScorePopupColor(color);
    setScorePopupKey(prev => prev + 1);
    setShowScorePopup(true);
    setTimeout(() => {
      setShowScorePopup(false);
    }, 1200);
  }, []);

  const triggerArrowPopup = useCallback(() => {
    setArrowPopupKey(prev => prev + 1);
    setShowArrowPopup(true);
    setTimeout(() => {
      setShowArrowPopup(false);
    }, 1200);
  }, []);

  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);


  const lastTickTimeRef = useRef(performance.now());
  const wasPausedBeforeHelpRef = useRef(false);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  useEffect(() => {
    const checkSize = () => setIsMobileOrTablet(window.innerWidth <= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);
  const arrowsLeftRef = useRef(arrowsLeft);
  useEffect(() => { arrowsLeftRef.current = arrowsLeft; }, [arrowsLeft]);

  const triggerGameEnd = useCallback((reason: "arrows" | "timer") => {
    if (gameStateRef.current === "ended") return;
    setGameState("ended");
    gameStateRef.current = "ended";
    setEndReason(reason);
    const final = scoreRef.current;
    setFinalScore(final);
    setScoreSaved(false); // reset so name form shows
    playSound("gameEnd", mutedRef.current);
  }, []);

  const checkGameEnd = useCallback(() => {
    const newLeft = arrowsLeftRef.current - 1;
    setArrowsLeft(newLeft);
    arrowsLeftRef.current = newLeft;
    if (newLeft <= 0) {
      setTimeout(() => {
        triggerGameEnd("arrows");
      }, 1200);
    } else {
      // Also check if timer has expired
      const elapsed = performance.now() - stateRef.current.gameStartTime;
      if (GAME_DURATION - elapsed <= 0) {
        setTimeout(() => {
          triggerGameEnd("timer");
        }, 1200);
      }
    }
  }, [triggerGameEnd]);

  const handleSkipRound = useCallback(() => {
    triggerGameEnd("arrows");
  }, [triggerGameEnd]);

  const tick = useCallback(() => {
    const s = stateRef.current;
    const now = performance.now();
    const delta = now - lastTickTimeRef.current;
    lastTickTimeRef.current = now;

    if (pausedRef.current) {
      s.gameStartTime += delta;
      s.flyStart += delta;
      s.messageFade += delta;
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    // Drifting clouds & birds
    s.bgClouds.forEach(c => {
      c.x += c.speed * 0.6;
      if (c.x > 1050) c.x = -120;
    });
    s.birds.forEach(b => {
      b.x += b.speed;
      b.flap += 0.08;
      if (b.x > 1050) b.x = -40;
    });
    s.bowSway = Math.sin(now * 0.0008) * 1.5;

    // Decay target shake and scale animation
    if (s.targetShake > 0) {
      s.targetShake = Math.max(0, s.targetShake - 0.08);
    }
    if (s.pulseScale > 1) {
      s.pulseScale = Math.max(1, s.pulseScale - 0.02);
    }
    // Decay message opacity
    if (s.messageOpacity > 0) {
      if (now > s.messageFade) {
        s.messageOpacity = Math.max(0, s.messageOpacity - 0.05);
      }
    }



    // Game duration timer check
    if (gameStateRef.current === "playing") {
      const elapsed = now - s.gameStartTime;
      const timeLeftMs = Math.max(GAME_DURATION - elapsed, 0);
      if (timeLeftMs <= 0) {
        if (s.phase === "flying") {
          // Allow flying arrow to finish
        } else {
          s.dragging = false;
          s.pullDist = 0;
          s.bowScale = 1;
          s.bowStringPoints = "88,200 88,250 88,300";
          s.arcOpacity = 0;
          triggerGameEnd("timer");
        }
      }
    }

    if (s.phase === "flying") {
      const elapsed = now - s.flyStart;
      const raw = Math.min(elapsed / s.flyDuration, 1);
      const t = easeOut(raw);

      // Save previous position of the arrow to compute previous tip
      const prevPos = { ...s.arrowPos };
      const prevAngle = s.arrowAngle;

      if (s.arcPath.length > 1) {
        const idx = Math.floor(t * (s.arcPath.length - 1));
        const frac = t * (s.arcPath.length - 1) - idx;
        const p0 = s.arcPath[Math.min(idx, s.arcPath.length - 1)];
        const p1 = s.arcPath[Math.min(idx + 1, s.arcPath.length - 1)];
        s.arrowPos = { x: lerp(p0.x, p1.x, frac), y: lerp(p0.y, p1.y, frac) };
        const dx = p1.x - p0.x; const dy = p1.y - p0.y;
        s.arrowAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      }

      // Compute exact tip coordinates for previous and current frame (using true arrow length = 64)
      const radiansPrev = prevAngle * Math.PI / 180;
      const prevTipX = prevPos.x + Math.cos(radiansPrev) * 64;
      const prevTipY = prevPos.y + Math.sin(radiansPrev) * 64;

      const radiansCurr = s.arrowAngle * Math.PI / 180;
      const currTipX = s.arrowPos.x + Math.cos(radiansCurr) * 64;
      const currTipY = s.arrowPos.y + Math.sin(radiansCurr) * 64;

      // Check collision with the target plane (x = 900)
      const hitInfo = checkHit(prevTipX, prevTipY, currTipX, currTipY, s.pulseScale);



      if (hitInfo) {
        s.phase = "idle";

        // Store impact coordinates
        const finalImpactX = hitInfo.x;
        const finalImpactY = hitInfo.y;

        // Calculate tail position so that the arrowDef tip (at x=64) lands exactly at (finalImpactX, finalImpactY)
        // This removes visual/logical offset and guarantees visual tip position == physics tip position (0 px difference)
        const radians = s.arrowAngle * Math.PI / 180;
        const tailX = finalImpactX - Math.cos(radians) * 64;
        const tailY = finalImpactY - Math.sin(radians) * 64;
        s.arrowsOnTarget.push({ x: tailX, y: tailY, angle: s.arrowAngle });


        const hResult = hitInfo.ring;
        const pts = hResult === "bullseye" ? 10 : hResult === "inner" ? 7 : hResult === "middle" ? 5 : hResult === "blue" ? 4 : 3;
        const newScore = scoreRef.current + pts;
        setScore(newScore);
        scoreRef.current = newScore;
        s.messageType = hResult === "bullseye" ? "bullseye" : "hit";
        s.messageOpacity = 1;
        s.messageFade = now + 2200;
        s.pulseScale = 1;
        s.targetShake = 1;
        playSound(hResult === "bullseye" ? "bullseye" : "hit", mutedRef.current);

        // Score popup trigger - only show for points > 0
        if (pts > 0) {
          triggerScorePopup(`+${pts}`, hResult === "bullseye" ? "#ef4444" : hResult === "inner" ? "#facc15" : hResult === "middle" ? "#84cc16" : hResult === "blue" ? "#3b82f6" : "#cbd5e1");
        }

        // Bullseye bonus: +1 arrow
        if (hResult === "bullseye") {
          setArrowsLeft(prev => Math.min(prev + 1, MAX_ARROWS));
          arrowsLeftRef.current = Math.min(arrowsLeftRef.current + 1, MAX_ARROWS);
          triggerArrowPopup();
        }

        checkGameEnd();
      } else {
        const radians = s.arrowAngle * Math.PI / 180;
        const tipY = s.arrowPos.y + Math.sin(radians) * 64;

        if (tipY >= (isMobileOrTablet ? 265 : 295)) {
          // Pinned in land! Stop flying and pin arrow at its actual landing ground level and flight angle
          s.phase = "idle";
          s.arrowsOnGround.push({ x: s.arrowPos.x, y: s.arrowPos.y, angle: s.arrowAngle });
          s.messageType = "miss";
          s.messageOpacity = 1;
          s.messageFade = now + 1800;
          playSound("miss", mutedRef.current);


          checkGameEnd();
        } else if (raw >= 1) {
          // Reached end of Bezier trajectory without hitting target or ground
          s.phase = "idle";
          s.arrowsOnGround.push({ x: s.arrowPos.x, y: s.arrowPos.y, angle: s.arrowAngle });
          s.messageType = "miss";
          s.messageOpacity = 1;
          s.messageFade = now + 1800;
          playSound("miss", mutedRef.current);


          checkGameEnd();
        }
      }
    }

    setRenderTick(t => t + 1);
    animRef.current = requestAnimationFrame(tick);
  }, [checkGameEnd, triggerGameEnd]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [tick]);

  function checkHit(
    prevTipX: number,
    prevTipY: number,
    currTipX: number,
    currTipY: number,
    scale: number
  ): { ring: "bullseye" | "inner" | "middle" | "blue" | "outer"; x: number; y: number; dist: number } | null {
    const targetCenterX = 900;
    const targetCenterY = 200;

    // Check if the arrow tip crossed the target vertical center plane (x = 900)
    if (prevTipX < targetCenterX && currTipX >= targetCenterX) {
      const t = (targetCenterX - prevTipX) / (currTipX - prevTipX);
      const iy = prevTipY + t * (currTipY - prevTipY);

      // Convert impact point to target local coordinates (Step 5)
      // Since target is centered at (900, 200) and we check at targetCenterX, localX = 0
      const localX = 0;
      const localY = iy - targetCenterY;
      const dist = Math.sqrt(localX * localX + localY * localY);

      // Target scaling verification (Step 8): radius scaled by current target scale (max scoreable face is extended to 55 for White Ring)
      if (dist <= 55 * scale) {
        let ring: "bullseye" | "inner" | "middle" | "blue" | "outer";
        if (dist <= 11 * scale) {
          ring = "bullseye";
        } else if (dist <= 22 * scale) {
          ring = "inner";
        } else if (dist <= 33 * scale) {
          ring = "middle";
        } else if (dist <= 44 * scale) {
          ring = "blue";
        } else {
          ring = "outer";
        }
        return { ring, x: targetCenterX, y: iy, dist };
      }
    }
    return null;
  }

  function getSVGPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  }

  function startDraw(e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) {
    if (pausedRef.current) return;
    if (gameStateRef.current !== "playing") return;
    const s = stateRef.current;
    if (s.phase === "flying") return;
    if (arrowsLeftRef.current <= 0) return;

    // Check timer boundary
    const elapsed = performance.now() - s.gameStartTime;
    if (GAME_DURATION - elapsed <= 0) return;

    s.dragging = true;
    s.randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
    playSound("draw", mutedRef.current);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    updateAim(clientX, clientY);
  }

  function updateAim(clientX: number, clientY: number) {
    if (pausedRef.current) return;
    const s = stateRef.current;
    if (!s.dragging) return;
    const pt = getSVGPoint(clientX, clientY);
    const pivot = { x: 100, y: 250 };
    pt.x = Math.min(pt.x, pivot.x - 7);
    pt.y = Math.max(pt.y, pivot.y + 7);
    const dx = pt.x - pivot.x, dy = pt.y - pivot.y;
    const rawAngle = Math.atan2(dy, dx) + s.randomAngle;
    s.bowAngle = rawAngle - Math.PI;
    s.pullDist = Math.min(Math.sqrt(dx*dx + dy*dy), 50);
    s.bowScale = Math.min(Math.max(s.pullDist / 30, 1), 2);
    s.arcOpacity = s.pullDist / 60;

    const radius = s.pullDist * 9;
    const offX = Math.cos(s.bowAngle) * radius;
    const offY = Math.sin(s.bowAngle) * radius;
    const arcW = offX * 3;
    s.arcD = `M100,250c${offX},${offY},${arcW-offX},${offY+50},${arcW},50`;

    // Dynamic trajectory guide calculation (subtle dotted indicator showing first 1/3 of path for challenge)
    const fullPath = buildArcPath(s.arcD);
    const guidePoints = fullPath.slice(0, Math.floor(fullPath.length / 3) + 1);
    if (guidePoints.length > 0) {
      s.arcDHalf = `M ${guidePoints[0].x},${guidePoints[0].y} ` + guidePoints.slice(1).map(p => `L ${p.x},${p.y}`).join(" ");
    } else {
      s.arcDHalf = "";
    }

    const inv = 1/s.bowScale;
    s.bowStringPoints = `88,200 ${Math.min(pivot.x - inv*s.pullDist, 88)},250 88,300`;
  }

  function releaseArrow() {
    if (pausedRef.current) return;
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.pullDist < 5) { s.pullDist = 0; s.bowScale = 1; s.bowStringPoints = "88,200 88,250 88,300"; return; }
    playSound("release", mutedRef.current);
    const path = buildArcPath(s.arcD);
    s.arcPath = path;
    if (path.length > 0) {
      s.arrowPos = path[0];
      s.arrowAngle = 0;
    }
    s.flyStart = performance.now();
    s.flyDuration = 550 - s.pullDist * 2;
    s.phase = "flying";
    s.pullDist = 0; s.bowScale = 1;
    s.bowStringPoints = "88,200 88,250 88,300";
    s.arcOpacity = 0;
  }

  function startGame() {
    const s = stateRef.current;
    s.phase = "idle";
    s.dragging = false;
    s.arrowsOnGround = [];
    s.arrowsOnTarget = [];
    s.messageOpacity = 0;
    s.messageType = null;
    s.gameStartTime = performance.now();
    lastTickTimeRef.current = performance.now();
    setPaused(false);
    pausedRef.current = false;
    scoreRef.current = 0;
    arrowsLeftRef.current = MAX_ARROWS;
    setScore(0);
    setArrowsLeft(MAX_ARROWS);
    setGameState("playing");
    gameStateRef.current = "playing";

    playSound("gameStart", mutedRef.current);
  }

  function resetScores() {
    localStorage.removeItem(SCORES_KEY);
    setScores([]);
  }

  const s = stateRef.current;

  // Active round timer math
  let timeLeftSec = 60;
  let timeLeftMs = GAME_DURATION;
  if (gameState === "playing") {
    const elapsed = performance.now() - s.gameStartTime;
    timeLeftMs = Math.max(GAME_DURATION - elapsed, 0);
    timeLeftSec = Math.ceil(timeLeftMs / 1000);
  }

  const arrowVisible = s.dragging && s.pullDist > 2;

  const targetShakeX = Math.sin(performance.now() * 0.05) * s.targetShake;

  const isPlaying = gameState === "playing";
  const isIntro = gameState === "intro";
  const isEnded = gameState === "ended";



  return (
    <div
      className="relative w-full select-none font-sans bg-transparent h-svh min-h-[360px] overflow-hidden"
      onMouseMove={e => isPlaying && s.dragging && updateAim(e.clientX, e.clientY)}
      onMouseUp={() => isPlaying && s.dragging && releaseArrow()}
      onTouchMove={e => { e.preventDefault(); isPlaying && s.dragging && updateAim(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={() => isPlaying && s.dragging && releaseArrow()}
    >
      {/* LANDSCAPE ORIENTATION WARNING */}
      <div className="hidden portrait:flex fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex-col items-center justify-center text-center p-8 backdrop-blur-md pointer-events-auto">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Decorative ambient glow */}
          <div className="absolute w-32 h-32 bg-lime-500/10 rounded-full blur-2xl animate-pulse" />
          
          {/* Rotating Phone */}
          <div className="w-24 h-24 bg-slate-900/80 border border-lime-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(132,204,22,0.15)] animate-rotate-phone">
            <svg className="w-12 h-12 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2.5" ry="2.5" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-black font-serif text-yellow-500 tracking-wide uppercase mb-3">
          Landscape Mode Required
        </h3>
        <p className="text-green-100/70 text-sm max-w-[280px] leading-relaxed">
          Please rotate your device to landscape mode for the best archery experience.
        </p>
      </div>

      {/* SKY GRADIENT BACKGROUND */}
      <div className="absolute inset-0 animate-fade-in pointer-events-none bg-[linear-gradient(180deg,#7DD3FC_0%,#BAE6FD_50%,#F1F5F9_90%,#a3e635_95%,#15803d_100%)]" />

      {/* SUN */}
      <div className="absolute pointer-events-none rounded-full bottom-[60%] right-[15%] w-14 h-14 bg-[radial-gradient(circle,#FFF176_40%,#FFD740_100%)] shadow-[0_0_30px_12px_rgba(255,235,100,0.35)]" />

      {/* MAIN SVG GAME AREA */}
      <svg
        ref={svgRef}
        className={`absolute inset-0 w-full h-full overflow-visible ${
          isPlaying ? (s.dragging ? "cursor-grabbing" : "cursor-crosshair") : "cursor-default"
        }`}
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMax meet"
        onMouseDown={e => isPlaying && startDraw(e)}
        onTouchStart={e => { e.preventDefault(); isPlaying && startDraw(e); }}
      >
        <defs>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <filter id="targetGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Arrow definition with stylized feathers */}
          <g id="arrowDef">
            <line x1="0" y1="0" x2="60" y2="0" fill="none" stroke="#783E0D" strokeWidth="2.5" strokeLinecap="round" />
            {/* Arrow Tip */}
            <polygon fill="#475569" points="64 0 57 3 55 0 57 -3" />
            {/* Fletching */}
            <polygon fill="#84cc16" points="2 -3 -5 -3 -2 0 -5 3 2 3 5 0" />
            <polygon fill="#4f8a10" points="4 -2 -3 -2 -0.5 0 -3 2 4 2 6.5 0" opacity="0.8" />
          </g>

          {/* 3D Gradients for target rings */}
          <radialGradient id="targetWood" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="70%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#5C2E0B" />
          </radialGradient>
          <linearGradient id="targetWoodSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2E0B" />
            <stop offset="50%" stopColor="#3A1C0A" />
            <stop offset="100%" stopColor="#5C2E0B" />
          </linearGradient>
          
          <radialGradient id="ringWhite3d" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>
          <radialGradient id="ringGold3d" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="80%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
          <radialGradient id="ringRed3d" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="80%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
        </defs>

        {/* BACKGROUND Component */}
        <Background
          bgClouds={s.bgClouds}
          birds={s.birds}
          renderTick={renderTick}
          isMobileOrTablet={isMobileOrTablet}
        />

        {/* SUBTLE DOTTED AIM GUIDE (One-third distance only) */}
        {s.arcOpacity > 0.01 && (
          <path
            id="arc"
            fill="none"
            stroke="#ffffff" // Clean white guide line
            strokeWidth="2"
            strokeDasharray="3, 5"
            strokeLinecap="round"
            d={s.arcDHalf}
            opacity="0.6"
            pointerEvents="none"
            className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          />
        )}

        {/* TARGET Component */}
        <Target
          targetShakeX={targetShakeX}
          pulseScale={s.pulseScale}
          arrowsOnTarget={s.arrowsOnTarget}
        />

        {/* BOW Component */}
        <Bow
          dragging={s.dragging}
          bowAngle={s.bowAngle}
          bowSway={s.bowSway}
          bowScale={s.bowScale}
          bowStringPoints={s.bowStringPoints}
          pullDist={s.pullDist}
          arrowVisible={arrowVisible}
        />

        {/* FLYING ARROW */}
        {s.phase === "flying" && (
          <g
            transform={`translate(${s.arrowPos.x}, ${s.arrowPos.y}) rotate(${s.arrowAngle})`}
            pointerEvents="none"
          >
            <use xlinkHref="#arrowDef" x={0} y={0} />
          </g>
        )}

        {/* ARROWS ON GROUND */}
        {s.arrowsOnGround.map((a, i) => (
          <g key={i} transform={`translate(${a.x}, ${a.y}) rotate(${a.angle})`} opacity="0.8">
            <use xlinkHref="#arrowDef" x={0} y={0} />
          </g>
        ))}

        {/* HIT EFFECT RIPPLES (elliptical, centered at 900) */}
        {s.messageType === "bullseye" && s.messageOpacity > 0.1 && (
          <g opacity={s.messageOpacity * 0.65}>
            {[20, 35, 50].map((r, i) => (
              <ellipse key={i} cx="900" cy="200" rx={r * (2 - s.messageOpacity) * 0.4} ry={r * (2 - s.messageOpacity)} fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity={0.8 - i * 0.25} />
            ))}
          </g>
        )}

        {/* MESSAGE TEXT — MISS */}
        {s.messageType === "miss" && s.messageOpacity > 0.05 && (
          <g opacity={s.messageOpacity} transform="translate(500, 110)" className="pointer-events-none">
            <text textAnchor="middle" x="0" y="0" fill="#EF4444" fontSize="38" fontWeight="900" fontFamily="'Outfit', sans-serif" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] tracking-[4px] uppercase">MISS!</text>
          </g>
        )}

        {/* MESSAGE TEXT — HIT */}
        {s.messageType === "hit" && s.messageOpacity > 0.05 && (
          <g opacity={s.messageOpacity} transform="translate(500, 110)" className="pointer-events-none">
            <text textAnchor="middle" x="0" y="0" fill="#FBBF24" fontSize="42" fontWeight="900" fontFamily="'Outfit', sans-serif" className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)] tracking-[4px] uppercase">HIT! 🏹</text>
          </g>
        )}

        {/* MESSAGE TEXT — BULLSEYE */}
        {s.messageType === "bullseye" && s.messageOpacity > 0.05 && (
          <g opacity={s.messageOpacity} transform="translate(500, 105)" className="pointer-events-none">
            <text textAnchor="middle" x="0" y="0" fill="#EF4444" fontSize="52" fontWeight="900" fontFamily="'Outfit', sans-serif" className="drop-shadow-[0_3px_12px_rgba(239,68,68,0.7)] tracking-[6px] uppercase">BULLSEYE! 🎯</text>
          </g>
        )}

        {/* DRAW HINT */}
        {isPlaying && !s.dragging && s.phase === "idle" && s.arrowsOnGround.length === 0 && s.arrowsOnTarget.length === 0 && (
          <text x="100" y="370" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="14" fontWeight="500" fontFamily="sans-serif" opacity="0.5">
            ☝️ Drag the bow string to aim & draw
          </text>
        )}
        {/* Render tick dummy to guarantee SVG updates */}
        <g data-tick={renderTick} />
      </svg>

      {/* TIME BAR OVERLAY */}
      {isPlaying && (
        <div 
          className={`absolute top-0 left-0 h-1 z-10 transition-[width,background-color,box-shadow] duration-[100ms,500ms] ease-[linear,ease] ${
            timeLeftSec <= 15
              ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_8px_#ef4444]"
              : "bg-gradient-to-r from-emerald-500 to-lime-400"
          }`}
          style={{
            width: `${(timeLeftMs / GAME_DURATION) * 100}%`,
          }} 
        />
      )}

      {/* UI OVERLAY */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
        {/* STYLIZED HUD */}
        <GameHUD
          isPlaying={isPlaying}
          arrowsLeft={arrowsLeft}
          timeLeftSec={timeLeftSec}
          score={score}
          muted={muted}
          setMuted={setMuted}
          setShowHelp={(show) => {
            if (show) {
              wasPausedBeforeHelpRef.current = pausedRef.current;
              setPaused(true);
            }
            setShowHelp(show);
          }}
          showArrowPopup={showArrowPopup}
          arrowPopupKey={arrowPopupKey}
          showScorePopup={showScorePopup}
          scorePopupKey={scorePopupKey}
          scorePopupColor={scorePopupColor}
          scorePopupText={scorePopupText}
          paused={paused}
          setPaused={setPaused}
          onSkipRound={handleSkipRound}
        />

        {/* bottom spacer */}
        <div />
      </div>

      {/* FULL-SCREEN BACKDROP for intro & game over */}
      {(isIntro || isEnded) && (
        <div className="absolute inset-0 bg-[rgba(5,15,30,0.72)] backdrop-blur-[6px] z-30" />
      )}

      {/* HELP MODAL */}
      {showHelp && <HelpModal onClose={() => {
        setShowHelp(false);
        if (!wasPausedBeforeHelpRef.current) {
          setPaused(false);
        }
      }} />}

      {/* PAUSED OVERLAY */}
      {isPlaying && paused && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center pointer-events-auto">
          <div className="animate-scale-in bg-gradient-to-br from-green-950/95 to-emerald-950/95 border-2 border-lime-500/40 rounded-3xl py-8 px-10 text-center max-w-[380px] w-[90%] shadow-[0_25px_65px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-extrabold text-green-400 font-serif mb-2 tracking-wide">Game Paused</h2>
            <p className="text-green-200/80 text-sm mb-5 leading-relaxed">Your arrows and timer are on hold. Ready to resume shooting?</p>
            <button
              onClick={() => setPaused(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white font-bold rounded-lg shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}

      {/* INTRO SCREEN */}
      {isIntro && (
        <IntroScreen
          startGame={startGame}
          scores={scores}
          showScores={showScores}
          setShowScores={setShowScores}
          resetScores={resetScores}
          maxArrows={MAX_ARROWS}
        />
      )}

      {/* GAME OVER SCREEN */}
      {isEnded && (
        <GameOverScreen
          finalScore={finalScore}
          endReason={endReason}
          scores={scores}
          startGame={startGame}
          resetScores={resetScores}
          scoreSaved={scoreSaved}
          onSaveScore={(name: string) => {
            if (finalScore <= 0) {
              setScoreSaved(true);
              return;
            }
            try {
              const prev: ScoreRecord[] = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
              const updated = [{ score: finalScore, date: new Date().toLocaleDateString(), name }, ...prev]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
              localStorage.setItem(SCORES_KEY, JSON.stringify(updated));
              setScores(updated);
              setScoreSaved(true);
            } catch (e) {
              console.error(e);
            }
          }}
        />
      )}

      {/* MUTE BUTTON (non-gameplay screens) */}
      {!isPlaying && (
        <button
          className="absolute top-[18px] right-[18px] bg-slate-900/45 border border-white/15 rounded-lg px-3 py-1.5 text-white cursor-pointer z-20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          onClick={() => setMuted(m => !m)}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}