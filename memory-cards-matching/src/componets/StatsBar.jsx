function StatsBar(props) {
  return (
    <div className="max-w-full bg-white/20 backdrop-blur-lg rounded-2xl p-2 mb-4 shadow-xl border border-white/30">
      <div className="flex flex-wrap justify-around gap-4 items-center text-white">
        <div className="text-center transform hover:scale-110 transition-all">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🚀</span>
            <span className="text-sm font-semibold">Moves</span>
          </div>
          <div className="text-xl font-bold">{props.moves}</div>
        </div>
        <div className="text-center transform hover:scale-110 transition-all">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="text-sm font-semibold">Score</span>
          </div>
          <div className="text-xl font-bold">{props.score || "-"}</div>
        </div>
        <div className="text-center transform hover:scale-110 transition-all">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">⏱️</span>
            <span className="text-sm font-semibold">Time</span>
          </div>
          <div className="text-xl font-bold">{props.time}</div>
        </div>
        <div className="flex">
          <button
            onClick={props.reset}
            className="bg-white/30 hover:bg-white/50 px-6 py-2 rounded-xl font-semibold transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 shadow-lg"
          >
            Reset
          </button>
          <button
            onClick={() => props.setMuted(!props.muted)}
            className="bg-white/30 hover:bg-white/50 px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 shadow-lg ml-2"
          >
            {props.muted ? (
              <span className="w-5 sm:w-6 h-auto scale-[-1_1]">🔇</span>
            ) : (
              <span className="w-5 sm:w-6 h-auto scale-[-1_1]">🔊</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
