import { BOARD_HEIGHT, BOARD_WIDTH, PIECE_COLORS } from '../game'
import type { ActivePiece, Board as BoardState } from '../game'

type RenderCell = { hue: string; ghost?: boolean }

const toCells = (board: BoardState): (RenderCell | null)[][] =>
  board.map((row) => row.map((cell) => (cell ? { hue: cell.hue } : null)))

const placePiece = (grid: (RenderCell | null)[][], piece: ActivePiece | null, ghost = false) => {
  if (!piece) return
  piece.blocks.forEach(({ x, y }) => {
    const px = x + piece.position.x
    const py = y + piece.position.y
    if (py < 0 || py >= BOARD_HEIGHT || px < 0 || px >= BOARD_WIDTH) return

    if (ghost) {
      // Only draw ghost if the cell is empty so it doesn't hide the active piece.
      if (!grid[py][px]) {
        grid[py][px] = { hue: PIECE_COLORS[piece.type], ghost: true }
      }
    } else {
      // Active piece should always be visible and override ghost hint.
      grid[py][px] = { hue: PIECE_COLORS[piece.type], ghost: false }
    }
  })
}

export const Board = ({
  board,
  active,
  ghost,
  className,
}: {
  board: BoardState
  active: ActivePiece | null
  ghost: ActivePiece | null
  className?: string
}) => {
  const grid = toCells(board)
  placePiece(grid, active, false)
  placePiece(grid, ghost, true)

  const containerClass = [
    'relative overflow-hidden rounded-xl border-2 border-cyan-400/30 bg-gradient-to-b from-blue-900/50 via-cyan-900/40 to-teal-900/50 shadow-bubble-glow lg:rounded-2xl',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClass}>
      {/* Ocean background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-5 left-5 text-2xl animate-float">💧</div>
        <div className="absolute bottom-5 right-5 text-xl animate-float" style={{ animationDelay: '1s' }}>🌿</div>
        <div className="absolute top-1/2 left-1/2 text-lg animate-float" style={{ animationDelay: '2s' }}>🐬</div>
      </div>
      <div className="relative grid aspect-[5/6] grid-cols-10 gap-[2px] p-3 lg:aspect-[5/6] lg:gap-[3px] lg:p-3">
        {grid.flatMap((row, y) =>
          row.map((cell, x) => {
            const isGhost = cell?.ghost
            const style = cell && !isGhost ? { backgroundColor: cell.hue } : undefined
            return (
              <div
                key={`${x}-${y}`}
                style={style}
                className={`grid-cell relative rounded-md border border-white/10 transition duration-150 ${
                  cell
                    ? isGhost
                      ? 'border-dashed border-cyan-300/50 bg-cyan-500/10'
                      : 'shadow-[0_8px_24px_rgba(59,130,246,0.4)] border-cyan-300/30'
                    : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5'
                }`}
              >
                {cell && !isGhost && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-md" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-200/20 to-transparent rounded-md" />
                  </>
                )}
                {!cell && (
                  <div className="pointer-events-none absolute inset-0 rounded-md border border-cyan-400/10" />
                )}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

