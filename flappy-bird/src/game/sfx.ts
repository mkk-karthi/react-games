type SfxName = 'flap' | 'score' | 'hit' | 'start' | 'levelUp'

type SfxOptions = {
  muted: boolean
}

export function createSfx() {
  let ctx: AudioContext | null = null

  const ensure = async () => {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state !== 'running') await ctx.resume()
    return ctx
  }

  const tone = async (
    name: SfxName,
    opts: SfxOptions,
  ) => {
    if (opts.muted) return
    const c = await ensure()
    const now = c.currentTime

    const o = c.createOscillator()
    const g = c.createGain()
    const filter = c.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1600, now)

    o.type = name === 'hit' ? 'sawtooth' : 'square'

    const [freqA, freqB, dur, vol] = (() => {
      switch (name) {
        case 'flap':
          return [880, 520, 0.08, 0.10] as const
        case 'score':
          return [1046, 1318, 0.07, 0.11] as const
        case 'hit':
          return [180, 90, 0.18, 0.14] as const
        case 'start':
          return [660, 990, 0.10, 0.10] as const
        case 'levelUp':
          return [660, 1320, 0.14, 0.11] as const
      }
    })()

    o.frequency.setValueAtTime(freqA, now)
    o.frequency.exponentialRampToValueAtTime(freqB, now + dur)

    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(vol, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    o.connect(filter)
    filter.connect(g)
    g.connect(c.destination)

    o.start(now)
    o.stop(now + dur + 0.02)
  }

  return {
    play: (name: SfxName, opts: SfxOptions) => void tone(name, opts),
    // prime now just ensures context is active without playing a sound
    prime: async () => {
      await ensure();
    },
  }
}
