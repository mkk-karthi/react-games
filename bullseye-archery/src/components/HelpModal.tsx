interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm pointer-events-auto">
      <div className="animate-scale-in bg-gradient-to-br from-green-950/95 to-emerald-950/95 border-2 border-lime-500/40 rounded-3xl py-8 px-10 text-center max-w-[420px] w-[90%] shadow-[0_25px_65px_rgba(0,0,0,0.6)]">
        <h2 className="text-2xl font-extrabold text-green-400 font-serif mb-4 tracking-wide">How to Play</h2>
        <p className="text-green-200/80 text-sm mb-4 leading-relaxed text-left">
          1. Click/touch and drag back from the bow string to aim and draw.<br/>
          2. Watch the dotted helper arc (shows first 1/3 of distance) to guide your shot.<br/>
          3. Release to shoot!<br/>
          4. Complete the round in 10 arrows OR 60 seconds. Hitting a Bullseye gives you +1 bonus arrow!
        </p>
        <div className="mb-6 bg-white/5 border border-white/5 rounded-xl p-3 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between"><span className="text-red-400 font-bold">🎯 Bullseye:</span> <span className="text-white">10 pts + 🏹 Bonus Arrow</span></div>
          <div className="flex items-center justify-between"><span className="text-yellow-400 font-bold">🟡 Inner Ring:</span> <span className="text-white">7 pts</span></div>
          <div className="flex items-center justify-between"><span className="text-lime-400 font-bold">🟢 Middle Ring:</span> <span className="text-white">5 pts</span></div>
          <div className="flex items-center justify-between"><span className="text-blue-400 font-bold">🔵 Blue Ring:</span> <span className="text-white">4 pts</span></div>
          <div className="flex items-center justify-between"><span className="text-slate-300 font-bold">⚪ Outer Ring:</span> <span className="text-white">3 pts</span></div>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-white font-bold rounded-lg shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
