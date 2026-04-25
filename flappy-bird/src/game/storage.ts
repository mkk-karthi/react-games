import type { LevelId } from './levels'
import { clampLevelId } from './levels'

const KEY = 'flappy.v1'

export type Persisted = {
  unlockedLevel: LevelId
  bestByLevel: Partial<Record<LevelId, number>>
  muted: boolean
}

const DEFAULTS: Persisted = {
  unlockedLevel: 1,
  bestByLevel: {},
  muted: false,
}

export function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Persisted>
    const unlockedLevel = clampLevelId(Number(parsed.unlockedLevel ?? 1))
    const bestByLevel = (parsed.bestByLevel ?? {}) as Persisted['bestByLevel']
    const muted = Boolean(parsed.muted ?? false)
    return { unlockedLevel, bestByLevel, muted }
  } catch {
    return DEFAULTS
  }
}

export function savePersisted(next: Persisted) {
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function resetPersisted() {
  localStorage.removeItem(KEY)
}
