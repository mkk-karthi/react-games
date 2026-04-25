interface ScoreBoardProps {
  score: number;
  best: number;
  isNewBest: boolean;
}

export function ScoreBoard({
  score,
  best,
  isNewBest,
}: ScoreBoardProps) {
  return (
    <div className="fb-scoreboard w-[80%] min-w-[300px] max-w-[300px] px-7 py-5 border-4 border-amber-900 bg-amber-200">
      {/* Medal + scores row */}
      <div className="flex items-start gap-4">
        {/* Medal circle */}
        <div>
          <div className="w-24 h-24 shrink-0 rounded-full flex items-center justify-center text-2xl border-3 border-amber-800 bg-radial from-amber-200 to-amber-600 shadow-xl/30 text-5xl">
            {score >= 20 ? "🥇" : score >= 10 ? "🥈" : score >= 5 ? "🥉" : ""}
          </div>
          <div className="text-center mt-2 font-['Press_Start_2P'] text-xs text-yellow-600 opacity-85">
            <div>MEDAL</div>
            {isNewBest && <div className="text-xs text-amber-800">NEW BEST!</div>}
          </div>
        </div>

        {/* Score / Best */}
        <div className="flex-1">
          <div className="flex justify-end items-center my-2">
            <div className="font-['Press_Start_2P'] text-sm text-amber-800 mr-4">SCORE</div>
            <div className="font-FlappyBird text-lg text-white inline-block px-4 py-2 bg-amber-800">
              {score}
            </div>
          </div>
          <div className="flex justify-end items-center my-2">
            <div className="font-['Press_Start_2P'] text-sm text-amber-800 mr-4">BEST</div>
            <div className="font-FlappyBird text-lg text-white inline-block px-4 py-2 bg-amber-800">
              {best}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
