export const Hud = ({
  score,
  level,
  lines,
}: {
  score: number
  level: number
  lines: number
}) => {
  const stats = [
    { label: '🎯 Score', value: score.toLocaleString(), accent: 'from-cyan-400/50 to-cyan-500/20', emoji: '💎' },
    { label: '🌊 Level', value: level + 1, accent: 'from-amber-400/60 to-amber-500/20', emoji: '⭐' },
    { label: '📊 Lines', value: lines, accent: 'from-emerald-400/50 to-emerald-500/20', emoji: '✨' },
  ]

  return (
    <div className="glass rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-5 shadow-glow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">🐠 Dive Stats 🐠</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
          🌊 Live
        </span>
      </div>
      <div className="mt-2 lg:mt-4 grid gap-2 grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.accent} p-2 sm:p-5 lg:p-3 text-center`}
          >
            <p className="text-xs uppercase text-sky-100/70">{stat.label}</p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

