interface HUDProps {
  score: number;
  best: number;
  status: string;
}

export function HUD({ score, best, status }: HUDProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center pt-3 sm:pt-5">
      <div className="font-FlappyBird text-4xl text-white text-stroke">{String(score)}</div>
      {status === "running" && (
        <div className="mt-1 font-FlappyBird text-2xl text-white text-stroke">
          BEST {String(best)}
        </div>
      )}
    </div>
  );
}
