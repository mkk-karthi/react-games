import { PIECE_COLORS, PIECE_SHAPES } from '../game'
import type { PieceType } from '../game'

const GRID_SIZE = 4

const normalizeShape = (type: PieceType) => {
  const shape = PIECE_SHAPES[type]
  const xs = shape.map((b) => b.x)
  const ys = shape.map((b) => b.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = maxX - minX + 1
  const height = maxY - minY + 1

  const offsetX = Math.floor((GRID_SIZE - width) / 2) - minX
  const offsetY = Math.floor((GRID_SIZE - height) / 2) - minY

  return shape.map((b) => ({ x: b.x + offsetX, y: b.y + offsetY }))
}

const MiniPreview = ({ type }: { type: PieceType }) => {
  const normalized = normalizeShape(type)
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => false)
  normalized.forEach(({ x, y }) => {
    const idx = y * GRID_SIZE + x
    cells[idx] = true
  })

  return (
    <div className="grid grid-cols-4 gap-[3px] rounded-xl bg-gradient-to-b from-white/5 to-white/0 p-3">
      {cells.map((filled, idx) => (
        <div
          key={idx}
          className={`aspect-square rounded-md border border-white/5 ${filled ? '' : 'bg-white/5'}`}
          style={filled ? { backgroundColor: PIECE_COLORS[type] } : undefined}
        >
          {filled && <div className="pointer-events-none h-full w-full rounded-md bg-gradient-to-br from-white/30 to-white/0" />}
        </div>
      ))}
    </div>
  )
}

export const NextQueue = ({ pieces }: { pieces: PieceType[] }) => (
  <div className="glass rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-5 shadow-glow">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">🐟 Next Up 🐟</h2>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
        🌊 Queue
      </span>
    </div>
    <div className="mt-2 lg:mt-4 grid gap-2 grid-cols-3 w-[80%] lg:w-full mx-auto">
      {pieces.map((piece, idx) => (
        <div key={`${piece}-${idx}`} className="rounded-2xl bg-white/5 sm:p-2">
          <MiniPreview type={piece} />
        </div>
      ))}
      {pieces.length === 0 && <p className="text-sm text-sky-100/70">🐠 Pieces will appear once you start diving! 🌊</p>}
    </div>
  </div>
)

