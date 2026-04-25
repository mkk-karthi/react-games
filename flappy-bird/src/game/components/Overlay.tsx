import { ScoreBoard } from "./ScoreBoard";
import { PixelBtn } from "./PixelBtn";
import { LEVELS, type LevelId } from "../levels";

interface OverlayProps {
  status: string;
  score: number;
  best: number;
  isNewBest: boolean;
  levelId: LevelId;
  setLevelId: (id: LevelId) => void;
  canSelectLevel: (id: LevelId) => boolean;
  resetRun: (startRunning: boolean) => void;
  resetAllProgress: () => void;
  setStatus: (status: any) => void;
  isStarting: boolean;
}

export function Overlay({
  status,
  score,
  best,
  isNewBest,
  levelId,
  setLevelId,
  canSelectLevel,
  resetRun,
  resetAllProgress,
  setStatus,
  isStarting,
}: OverlayProps) {
  const showOverlay = status === "dead" || status === "paused" || status === "ready" || isStarting;

  if (!showOverlay) return null;

  // Vertical position adjustment: Move up to keep bird visible in center
  const containerCls = `fb-overlay absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/${
    isStarting ? "0" : "[0.18]"
  } transition-all duration-500 ${isStarting ? "pointer-events-none" : ""}`;

  const titleText =
    status === "paused"
      ? "Paused"
      : status === "dead"
        ? "Game Over"
        : isStarting
          ? "Get Ready"
          : "Flappy Bird";

  // Animation for "Get Ready"
  const titleAnimationCls = isStarting ? "animate-fadeOut" : "";

  return (
    <div className={containerCls}>
      <div className={`flex flex-col items-center transition-all duration-300 w-full`}>
        {/* Title */}
        <div
          className={`-mt-8 mb-12 font-FlappyBird text-6xl tracking-tight capitalize text-amber-500 text-center ${titleAnimationCls}`}
          style={{
            textShadow:
              "0 2px 0 #fff, -2px -2px 0 #7b3306, 0 -2px 0 #7b3306, 2px -2px 0 #7b3306, 2px 0 0 #7b3306, 2px 4px 0 #7b3306, 0 2px 0 #7b3306,-2px 4px 0 #7b3306,-2px 0 0 #7b3306, -4px -4px 0 #fff, 0 -4px 0 #fff, 4px -4px 0 #fff, 4px 0 0 #fff, 4px 6px 0 #fff, 0 6px 0 #fff, -4px 6px 0 #fff,-4px 0 0 #fff",
          }}
        >
          {titleText}
        </div>

        {!isStarting && (
          <>
            {/* Scoreboard — dead or paused */}
            {status === "dead" && (
              <div className="mb-8 flex justify-center w-full">
                <ScoreBoard score={score} best={best} isNewBest={isNewBest} />
              </div>
            )}

            {/* Level selector - only on start/dead/paused */}
            {status !== "paused" && (
              <div className="my-6 flex max-w-[320px] flex-wrap justify-center gap-2">
                {LEVELS.map((l) => {
                  const locked = !canSelectLevel(l.id);
                  const active = l.id === levelId;
                  return (
                    <PixelBtn
                      key={l.id}
                      variant={active ? "green" : "orange"}
                      small
                      onClick={() => {
                        if (locked) return;
                        setLevelId(l.id);
                        resetRun(false);
                      }}
                    >
                      {locked ? "🔒" : `L${l.id}`}
                    </PixelBtn>
                  );
                })}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <PixelBtn onClick={() => resetRun(true)}>
                {status === "dead" ? "PLAY AGAIN" : (status === "paused" ? "RESTART" : "START")}
              </PixelBtn>
              {status === "dead" && <PixelBtn onClick={resetAllProgress}>RESET</PixelBtn>}
              {status === "paused" && (
                <PixelBtn onClick={() => setStatus("running")}>RESUME</PixelBtn>
              )}
            </div>

            {/* Hint */}
            {status === "paused" && (
              <div className="mt-6 font-['Press_Start_2P'] text-xs text-white/80 text-shadow-md">
                PRESS P TO RESUME
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
