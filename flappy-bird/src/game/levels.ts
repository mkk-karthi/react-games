export type LevelId = 1 | 2 | 3 | 4 | 5

export type LevelConfig = {
  id: LevelId
  name: string
  pipeGapPx: number
  pipeDistancePx: number
  pipeSpeedPxPerSec: number
  gravityPxPerSec2: number
  flapVelocityPxPerSec: number
}

export const LEVELS: readonly LevelConfig[] = [
  {
    id: 1,
    name: 'Kids',
    pipeGapPx: 200,
    pipeDistancePx: 550,
    pipeSpeedPxPerSec: 110,
    gravityPxPerSec2: 1000,
    flapVelocityPxPerSec: -400,
  },
  {
    id: 2,
    name: 'Amateur',
    pipeGapPx: 175,
    pipeDistancePx: 500,
    pipeSpeedPxPerSec: 150,
    gravityPxPerSec2: 1250,
    flapVelocityPxPerSec: -440,
  },
  {
    id: 3,
    name: 'Pro',
    pipeGapPx: 155,
    pipeDistancePx: 440,
    pipeSpeedPxPerSec: 200,
    gravityPxPerSec2: 1600,
    flapVelocityPxPerSec: -500,
  },
  {
    id: 4,
    name: 'Master',
    pipeGapPx: 140,
    pipeDistancePx: 380,
    pipeSpeedPxPerSec: 260,
    gravityPxPerSec2: 1950,
    flapVelocityPxPerSec: -560,
  },
  {
    id: 5,
    name: 'Legend',
    pipeGapPx: 125,
    pipeDistancePx: 320,
    pipeSpeedPxPerSec: 340,
    gravityPxPerSec2: 2350,
    flapVelocityPxPerSec: -630,
  },
] as const

export function clampLevelId(id: number): LevelId {
  if (id <= 1) return 1
  if (id >= 5) return 5
  return id as LevelId
}
