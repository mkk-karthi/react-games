import type { SoundEffect } from "../types/game";

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private isMuted = false;

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== "undefined") {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  private ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playSound(effect: SoundEffect) {
    if (this.isMuted || !this.audioContext) return;

    this.ensureAudioContext();
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (effect) {
      case "paddleHit":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gainNode.gain.setValueAtTime(this.masterVolume + 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case "blockHit":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(450, now);
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gainNode.gain.setValueAtTime(this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;

      case "wallHit":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(700, now);
        oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.04);
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        oscillator.start(now);
        oscillator.stop(now + 0.04);
        break;

      case "blockBreak":
        // Create a more complex sound with multiple oscillators
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);

        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.exponentialRampToValueAtTime(55, now + 0.2);
        gain2.gain.setValueAtTime(this.masterVolume * 0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
        osc2.start(now);
        osc2.stop(now + 0.2);
        break;

      case "launch":
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.25, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case "loseLife":
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(500, now);
        oscillator.frequency.exponentialRampToValueAtTime(90, now + 0.8);
        gainNode.gain.setValueAtTime(this.masterVolume * 2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
        oscillator.start(now);
        oscillator.stop(now + 1);
        break;

      case "gameOver":
        // Sad melody (Descending: E4 -> D#4 -> D4 -> C#4)
        const notes = [329.63, 311.13, 293.66, 277.18]; // E4, D#4, D4, C#4
        const duration = 0.4;

        // We trigger the first note with the main oscillator
        oscillator.frequency.setValueAtTime(notes[0], now);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        oscillator.start(now);
        oscillator.stop(now + duration);

        // Schedule rest of notes
        notes.slice(1).forEach((freq, i) => {
          const osc = this.audioContext!.createOscillator();
          const gn = this.audioContext!.createGain();
          osc.connect(gn);
          gn.connect(this.audioContext!.destination);

          const startTime = now + (i + 1) * duration;
          osc.frequency.setValueAtTime(freq, startTime);

          // Slight detune for sad effect on the last note
          if (i === notes.length - 2) {
            osc.frequency.linearRampToValueAtTime(freq - 10, startTime + 0.8);
          }

          gn.gain.setValueAtTime(this.masterVolume * 0.3, startTime);
          gn.gain.linearRampToValueAtTime(0, startTime + (i === notes.length - 2 ? 1.0 : duration));

          osc.start(startTime);
          osc.stop(startTime + (i === notes.length - 2 ? 1.0 : duration));
        });
        break;

      case "victory":
        // Victory Fanfare (C Major Arpeggio + High C: C4, E4, G4, C5)
        const vicNotes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
        const vicDuration = 0.15;

        // Play first note
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(vicNotes[0], now);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + vicDuration);
        oscillator.start(now);
        oscillator.stop(now + vicDuration);

        // Schedule remaining notes
        vicNotes.slice(1).forEach((freq, i) => {
          const osc = this.audioContext!.createOscillator();
          const gn = this.audioContext!.createGain();
          osc.connect(gn);
          gn.connect(this.audioContext!.destination);

          osc.type = "triangle";
          const startTime = now + (i + 1) * vicDuration;

          // Last note is longer
          const isLast = i === vicNotes.length - 2;
          const noteDur = isLast ? 0.8 : vicDuration;

          osc.frequency.setValueAtTime(freq, startTime);
          gn.gain.setValueAtTime(this.masterVolume * 0.3, startTime);
          gn.gain.exponentialRampToValueAtTime(0.01, startTime + noteDur);

          osc.start(startTime);
          osc.stop(startTime + noteDur);
        });
        break;
    }
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }
}
