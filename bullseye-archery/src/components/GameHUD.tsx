import React from "react";

interface GameHUDProps {
  isPlaying: boolean;
  arrowsLeft: number;
  timeLeftSec: number;
  score: number;
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHelp: (show: boolean) => void;
  showArrowPopup: boolean;
  arrowPopupKey: number;
  showScorePopup: boolean;
  scorePopupKey: number;
  scorePopupColor: string;
  scorePopupText: string;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  onSkipRound: () => void;
}

export default function GameHUD({
  isPlaying,
  arrowsLeft,
  timeLeftSec,
  score,
  muted,
  setMuted,
  setShowHelp,
  showArrowPopup,
  arrowPopupKey,
  showScorePopup,
  scorePopupKey,
  scorePopupColor,
  scorePopupText,
  paused,
  setPaused,
  onSkipRound,
}: GameHUDProps) {
  if (!isPlaying) return <div />;

  return (
    <div className="w-full flex items-center justify-between pointer-events-auto flex-row gap-1 sm:gap-2 md:gap-0 select-none">
      {/* LEFT CONTAINER (Back/Skip, Arrows, Timer) */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Back (Skip Round) Button */}
        <button
          onClick={onSkipRound}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all text-white border-2 border-white shadow-md cursor-pointer"
          title="Skip Round (End game with current score)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Arrows Counter Pill */}
        <div className="relative flex items-center bg-sky-600 border-2 border-white text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full font-bold shadow-md gap-1 sm:gap-1.5 md:gap-2.5">
          <span className="text-xs sm:text-sm md:text-xl">
            <span className="inline-block scale-110 sm:scale-125 origin-center">🏹</span>
          </span>
          <span className="text-xs sm:text-sm md:text-xl font-mono leading-none">{arrowsLeft}</span>

          {/* Floating "+1 ARROW" Indicator */}
          {showArrowPopup && (
            <div
              key={arrowPopupKey}
              className="absolute text-lime-400 font-extrabold text-xs sm:text-xs md:text-sm tracking-wider font-sans animate-float-up-fade left-1/2 -translate-x-1/2 -top-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            >
              +1 ARROW
            </div>
          )}
        </div>

        {/* Timer Pill */}
        <div
          className={`flex items-center border-2 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full font-bold shadow-md gap-1 sm:gap-1.5 md:gap-2 transition-colors duration-300 ${
            timeLeftSec <= 15
              ? "bg-red-600 border-red-200 text-red-100 animate-timer-pulse"
              : "bg-sky-600 border-white"
          }`}
        >
          <span className="text-xs sm:text-sm md:text-lg leading-none">⏱️</span>
          <span className="text-xs sm:text-sm md:text-xl font-mono leading-none">{timeLeftSec}s</span>
        </div>
      </div>

      {/* CENTER CONTAINER (Stylized Score Display) */}
      <div className="relative flex items-center shrink-0">
        <div
          className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 bg-gradient-to-br from-slate-900/80 to-emerald-950/80 border-2 border-lime-400/65 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 sm:py-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        >
          <span className="text-sm sm:text-lg md:text-xl leading-none">🎯</span>
          <span
            className="font-black font-serif !leading-1 bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent text-sm sm:text-xl md:text-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          >
            {score}
          </span>
          <span
            className="font-bold text-lime-400/80 leading-none uppercase text-xs tracking-widest"
          >
            pts
          </span>
        </div>

        {/* Point Popup */}
        {showScorePopup && (
          <span
            key={scorePopupKey}
            className="absolute left-[105%] text-2xl sm:text-3xl md:text-4xl font-black font-serif animate-float-up-fade drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
            style={{
              color: scorePopupColor,
            }}
          >
            {scorePopupText}
          </span>
        )}
      </div>

      {/* RIGHT CONTAINER (Help, Pause/Play, Mute) */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all text-white border-2 border-white shadow-md font-bold text-xs sm:text-sm md:text-lg cursor-pointer font-serif"
          title="Help"
        >
          i
        </button>

        {/* Pause/Play Button */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all text-white border-2 border-white shadow-md cursor-pointer"
          title={paused ? "Resume Game" : "Pause Game"}
        >
          {paused ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Mute Button */}
        <button
          onClick={() => setMuted((m) => !m)}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all text-white border-2 border-white shadow-md cursor-pointer"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
