const Control = ({ keys, action }: { keys: string; action: string }) => (
  <div className="flex items-center justify-center flex-col text-center rounded-xl border border-white/10 bg-white/5 px-2 py-3">
    <span className="text-sm font-semibold text-white">{keys}</span>
    <span className="text-xs lg:text-[0.6rem] uppercase tracking-[0.2em] text-sky-100/80">{action}</span>
  </div>
)

export const ControlsCard = () => (
  <div className="glass rounded-2xl border border-white/10 p-3 lg:p-5 shadow-glow h-fit">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">🎮 Controls 🎮</h2>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
        ⌨️ Keys
      </span>
    </div>
    <div className="mt-3 grid gap-2 grid-cols-2">
      <Control keys="← → / A D" action="Move" />
      <Control keys="↑ / W" action="Rotate ClockWise" />
      <Control keys="Z / Q" action="Rotate CCW" />
      <Control keys="↓ / S" action="Soft drop" />
      <Control keys="Space" action="Hard drop" />
      <Control keys="Enter" action="Start / Resume" />
      <Control keys="P / Esc" action="Pause" />
    </div>
  </div>
)

