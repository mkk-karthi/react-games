import { useCallback, useRef, useState } from 'react';

export type ToneKind =
  | 'start'
  | 'move'
  | 'capture'
  | 'end'
  | 'check'
  | 'castle'
  | 'promotion'
  | 'error'
  | 'select'
  | 'victory'
  | 'draw'
  | 'undo';

/** Helper to play a single oscillator node with volume envelope and optional lowpass filter. */
function playNode(
  ctx: AudioContext,
  now: number,
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  duration: number,
  volume: number,
  delay = 0,
  filterFreq?: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  let lastNode: AudioNode = osc;

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now + delay);
  if (freqStart !== freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + delay + duration);
  }

  if (filterFreq && ctx.createBiquadFilter) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now + delay);
    osc.connect(filter);
    lastNode = filter;
  }

  gain.gain.setValueAtTime(0.0001, now + delay);
  gain.gain.exponentialRampToValueAtTime(volume, now + delay + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

  lastNode.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now + delay);
  osc.stop(now + delay + duration + 0.02);
}

/** Manages Web Audio context and exposes a `playTone` function. */
export function useAudio() {
  const audioRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const playTone = useCallback(
    (kind: ToneKind) => {
      if (muted) return;
      const AudioCtxClass =
        window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      audioRef.current ??= new AudioCtxClass();
      const ctx = audioRef.current;

      // Auto-resume if suspended (helps bypass browser autoplay blocks on user actions)
      if (ctx.state === 'suspended') {
        ctx.resume().catch((err) => console.warn('Failed to resume AudioContext:', err));
      }

      const now = ctx.currentTime;

      switch (kind) {
        case 'start':
          playNode(ctx, now, 'triangle', 420, 700, 0.18, 0.15);
          break;
        case 'move':
          // Warm woody sine sweep with lowpass filter
          playNode(ctx, now, 'sine', 240, 290, 0.08, 0.15, 0, 400);
          break;
        case 'capture':
          // Satisfying double-click woody impact
          playNode(ctx, now, 'sawtooth', 180, 80, 0.09, 0.22, 0, 350);
          playNode(ctx, now, 'sawtooth', 140, 60, 0.09, 0.18, 0.035, 300);
          break;
        case 'check':
          // Warning double chime
          playNode(ctx, now, 'triangle', 784, 784, 0.06, 0.18);
          playNode(ctx, now, 'triangle', 784, 784, 0.12, 0.18, 0.07);
          break;
        case 'castle':
          // Double piece slide chord/succession
          playNode(ctx, now, 'sine', 240, 360, 0.08, 0.15);
          playNode(ctx, now, 'sine', 280, 420, 0.08, 0.15, 0.06);
          break;
        case 'promotion':
          // Magical ascending arpeggio
          playNode(ctx, now, 'triangle', 523, 523, 0.1, 0.14, 0);
          playNode(ctx, now, 'triangle', 659, 659, 0.1, 0.14, 0.06);
          playNode(ctx, now, 'triangle', 784, 784, 0.1, 0.14, 0.12);
          playNode(ctx, now, 'triangle', 1046, 1046, 0.16, 0.14, 0.18);
          break;
        case 'error':
          // Muffled buzz/thud for illegal moves/clicks
          playNode(ctx, now, 'sawtooth', 130, 70, 0.16, 0.20, 0, 200);
          break;
        case 'select':
          // Short crisp wood tap (piece pick up / deselect)
          playNode(ctx, now, 'sine', 480, 240, 0.03, 0.12, 0, 500);
          break;
        case 'victory':
          // Ascending major chime/arpeggio flourish
          playNode(ctx, now, 'sine', 523, 523, 0.15, 0.14, 0);
          playNode(ctx, now, 'sine', 659, 659, 0.15, 0.14, 0.06);
          playNode(ctx, now, 'sine', 784, 784, 0.15, 0.14, 0.12);
          playNode(ctx, now, 'sine', 1046, 1046, 0.2, 0.14, 0.18);
          playNode(ctx, now, 'sine', 1318, 1318, 0.3, 0.14, 0.24);
          break;
        case 'draw':
          // Gentle resolving minor chord
          playNode(ctx, now, 'sine', 440, 440, 0.2, 0.14, 0);
          playNode(ctx, now, 'sine', 554, 554, 0.2, 0.14, 0.08);
          playNode(ctx, now, 'sine', 659, 659, 0.25, 0.14, 0.16);
          break;
        case 'undo':
          // Reverse slide rewind tone
          playNode(ctx, now, 'sine', 200, 320, 0.12, 0.12);
          break;
        case 'end':
          playNode(ctx, now, 'triangle', 520, 320, 0.38, 0.15);
          break;
      }
    },
    [muted],
  );

  const toggleMute = useCallback(() => setMuted((v) => !v), []);

  return { muted, toggleMute, playTone };
}

