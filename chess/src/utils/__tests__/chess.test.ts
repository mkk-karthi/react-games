import { describe, it, expect } from 'vitest';
import { squareToIndex, files, ranks, PIECE_NAMES } from '../../utils/chess';
import type { Square } from 'chess.js';

describe('squareToIndex', () => {
  it('maps a1 to col=0, row=7', () => {
    expect(squareToIndex('a1' as Square)).toEqual({ col: 0, row: 7 });
  });

  it('maps h8 to col=7, row=0', () => {
    expect(squareToIndex('h8' as Square)).toEqual({ col: 7, row: 0 });
  });

  it('maps e4 correctly', () => {
    expect(squareToIndex('e4' as Square)).toEqual({ col: 4, row: 4 });
  });

  it('maps d5 correctly', () => {
    expect(squareToIndex('d5' as Square)).toEqual({ col: 3, row: 3 });
  });
});

describe('files constant', () => {
  it('has 8 entries a–h', () => {
    expect(files).toHaveLength(8);
    expect(files[0]).toBe('a');
    expect(files[7]).toBe('h');
  });
});

describe('ranks constant', () => {
  it('has 8 entries 8–1 (top-to-bottom render order)', () => {
    expect(ranks).toHaveLength(8);
    expect(ranks[0]).toBe('8');
    expect(ranks[7]).toBe('1');
  });
});

describe('PIECE_NAMES', () => {
  it('maps all 6 piece types', () => {
    expect(PIECE_NAMES['p']).toBe('Pawn');
    expect(PIECE_NAMES['n']).toBe('Knight');
    expect(PIECE_NAMES['b']).toBe('Bishop');
    expect(PIECE_NAMES['r']).toBe('Rook');
    expect(PIECE_NAMES['q']).toBe('Queen');
    expect(PIECE_NAMES['k']).toBe('King');
  });
});
