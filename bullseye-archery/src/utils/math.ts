export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function buildArcPath(d: string): { x: number; y: number }[] {
  try {
    const m = d.match(/M([\d.]+),([\d.]+)c([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+),([\d.]+)/);
    if (!m) return [];
    const x0 = parseFloat(m[1]), y0 = parseFloat(m[2]);
    const dx1 = parseFloat(m[3]), dy1 = parseFloat(m[4]);
    const dx2 = parseFloat(m[5]), dy2 = parseFloat(m[6]);
    const dxe = parseFloat(m[7]), dye = parseFloat(m[8]);
    const x1 = x0 + dx1, y1 = y0 + dy1;
    const x2 = x0 + dx2, y2 = y0 + dy2;
    const xe = x0 + dxe, ye = y0 + dye;
    const pts = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const mt = 1 - t;
      const bx = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * xe;
      const by = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * ye;
      pts.push({ x: bx, y: by });
    }
    return pts;
  } catch {
    return [];
  }
}
