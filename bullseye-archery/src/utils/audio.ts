export const SOUNDS = {
  draw: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sawtooth"; o.frequency.setValueAtTime(120, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      o.start(); o.stop(ctx.currentTime + 0.3);
    } catch(e){}
  },
  release: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "triangle"; o.frequency.setValueAtTime(600, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      o.start(); o.stop(ctx.currentTime + 0.2);
    } catch(e){}
  },
  hit: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      [0,0.06,0.12].forEach((t,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 440 + i*110; o.type = "sine";
        g.gain.setValueAtTime(0.15, ctx.currentTime+t);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime+t+0.25);
        o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.3);
      });
    } catch(e){}
  },
  bullseye: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      [523.25,659.25,783.99,1046.5].forEach((f,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0.18, ctx.currentTime+i*0.08);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime+i*0.08+0.4);
        o.start(ctx.currentTime+i*0.08); o.stop(ctx.currentTime+i*0.08+0.5);
      });
    } catch(e){}
  },
  miss: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sawtooth"; o.frequency.setValueAtTime(200, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      o.start(); o.stop(ctx.currentTime + 0.4);
    } catch(e){}
  },
  gameStart: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      [261.63,329.63,392,523.25].forEach((f,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "triangle";
        g.gain.setValueAtTime(0.15, ctx.currentTime+i*0.1);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime+i*0.1+0.3);
        o.start(ctx.currentTime+i*0.1); o.stop(ctx.currentTime+i*0.1+0.4);
      });
    } catch(e){}
  },
  gameEnd: () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      [523.25,392,329.63,261.63].forEach((f,i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = "sine";
        g.gain.setValueAtTime(0.18, ctx.currentTime+i*0.12);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime+i*0.12+0.4);
        o.start(ctx.currentTime+i*0.12); o.stop(ctx.currentTime+i*0.12+0.5);
      });
    } catch(e){}
  }
};

export function playSound(name: keyof typeof SOUNDS, muted: boolean) {
  if (!muted && SOUNDS[name]) SOUNDS[name]();
}
