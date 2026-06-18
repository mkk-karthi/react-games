import { describe, it, expect } from 'vitest';
import { getSquareStyle, getMoveStyle } from '../../utils/chess';
import type { Square } from 'chess.js';

describe('getSquareStyle', () => {
  it('positions a1 at bottom-left (col 0, row 7)', () => {
    const style = getSquareStyle('a1' as Square);
    expect(style.left).toBe('0%');
    expect(style.top).toBe('87.5%');
    expect(style.width).toBe('12.5%');
    expect(style.height).toBe('12.5%');
  });

  it('positions h8 at top-right (col 7, row 0)', () => {
    const style = getSquareStyle('h8' as Square);
    expect(style.left).toBe('87.5%');
    expect(style.top).toBe('0%');
  });

  it('positions e4 correctly', () => {
    const style = getSquareStyle('e4' as Square);
    expect(style.left).toBe('50%');   // col 4 * 12.5
    expect(style.top).toBe('50%');    // row 4 * 12.5
  });
});

describe('getMoveStyle', () => {
  it('moving e2→e4 produces correct CSS custom props', () => {
    const style = getMoveStyle('e2' as Square, 'e4' as Square) as Record<string, string>;
    // e2 starts at col=4, row=6; e4 is col=4, row=4 → dy = (4-6)*100 = -200%
    expect(style['--move-x']).toBe('0%');
    expect(style['--move-y']).toBe('-200%');
  });

  it('moving a1→h8 produces max diagonal offset', () => {
    const style = getMoveStyle('a1' as Square, 'h8' as Square) as Record<string, string>;
    // col: 7-0=7 → 700%; row: 0-7=-7 → -700%
    expect(style['--move-x']).toBe('700%');
    expect(style['--move-y']).toBe('-700%');
  });

  it('includes origin square position in output', () => {
    const style = getSquareStyle('a1' as Square);
    const moveStyle = getMoveStyle('a1' as Square, 'a2' as Square) as Record<string, unknown>;
    expect(moveStyle.left).toBe(style.left);
    expect(moveStyle.top).toBe(style.top);
  });
});
