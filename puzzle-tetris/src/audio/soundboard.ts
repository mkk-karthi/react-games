const SOUND_FILES = {
  move: 'sfx/move.wav',
  rotate: 'sfx/rotate.wav',
  drop: 'sfx/drop.wav',
  lineClear: 'sfx/line-clear.wav',
  levelUp: 'sfx/level-up.wav',
  gameOver: 'sfx/game-over.wav',
}

export type SoundId = keyof typeof SOUND_FILES

export class SoundBoard {
  private sounds = new Map<SoundId, HTMLAudioElement>()
  private volume: number
  private muted = false

  constructor(defaultVolume = 0.7) {
    this.volume = defaultVolume
    Object.entries(SOUND_FILES).forEach(([id, path]) => {
      const audio = new Audio(`${import.meta.env.BASE_URL}${path}`)
      audio.preload = 'auto'
      this.sounds.set(id as SoundId, audio)
    })
  }

  setVolume(value: number) {
    this.volume = Math.min(1, Math.max(0, value))
    this.syncVolume()
  }

  setMuted(value: boolean) {
    this.muted = value
    this.syncVolume()
  }

  play(id: SoundId) {
    const audio = this.sounds.get(id)
    if (!audio) return

    audio.currentTime = 0
    audio.volume = this.muted ? 0 : this.volume
    void audio.play().catch(() => {
      /* ignore playback errors (e.g., autoplay restrictions) */
    })
  }

  private syncVolume() {
    const volume = this.muted ? 0 : this.volume
    this.sounds.forEach((audio) => {
      audio.volume = volume
    })
  }
}

export const soundBoard = new SoundBoard()

