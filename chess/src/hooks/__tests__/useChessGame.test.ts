import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Chess } from 'chess.js';
import { useChessGame } from '../../hooks/useChessGame';

// Helper to create mock options
function makeOptions() {
  return {
    playTone: vi.fn(),
    recordWin: vi.fn(),
    recordDraw: vi.fn(),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useChessGame — initial state', () => {
  it('starts with gameStarted=false', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    expect(result.current.gameStarted).toBe(false);
  });

  it('starts with mode=single', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    expect(result.current.mode).toBe('single');
  });

  it('starts with empty move history', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    expect(result.current.moveHistory).toHaveLength(0);
  });

  it('isGameOver is false at start', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    expect(result.current.isGameOver).toBe(false);
  });
});

describe('useChessGame — startGame', () => {
  it('sets gameStarted to true', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    expect(result.current.gameStarted).toBe(true);
  });

  it('plays the start tone', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useChessGame(opts));
    act(() => { result.current.startGame('multi'); });
    expect(opts.playTone).toHaveBeenCalledWith('start');
  });

  it('resets board to opening position (32 pieces)', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    const pieces = result.current.board.flat().filter(Boolean);
    expect(pieces).toHaveLength(32);
  });
});

describe('useChessGame — selectSquare', () => {
  it('ignores clicks when game has not started', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.selectSquare('e2'); });
    expect(result.current.selected).toBeNull();
  });

  it('selects a white piece on white turn', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    expect(result.current.selected).toBe('e2');
  });

  it('populates legalTargets when a piece is selected', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    // e2 pawn can move to e3 and e4
    expect(result.current.legalTargets).toContain('e3');
    expect(result.current.legalTargets).toContain('e4');
  });

  it('deselects when clicking an empty non-target square', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.selectSquare('e5'); }); // empty non-target
    expect(result.current.selected).toBeNull();
  });
});

describe('useChessGame — applyMove (via selectSquare)', () => {
  it('triggers move animation and updates lastMove', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.selectSquare('e4'); });

    expect(result.current.lastMove).toEqual({ from: 'e2', to: 'e4' });
    expect(result.current.movingPiece).not.toBeNull();
  });

  it('updates board after animation timer fires', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.selectSquare('e4'); });
    act(() => { vi.runAllTimers(); });

    expect(result.current.moveHistory).toContain('e4');
    expect(result.current.movingPiece).toBeNull();
  });
});

describe('useChessGame — undoMove', () => {
  it('does nothing when no moves have been made', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    // no moves yet
    act(() => { result.current.undoMove(); });
    expect(result.current.moveHistory).toHaveLength(0);
  });

  it('removes the last move from history', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    // Make a move
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.selectSquare('e4'); });
    act(() => { vi.runAllTimers(); });
    expect(result.current.moveHistory).toHaveLength(1);
    // Undo
    act(() => { result.current.undoMove(); });
    expect(result.current.moveHistory).toHaveLength(0);
  });
});

describe('useChessGame — newGame', () => {
  it('sets gameStarted to false', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    expect(result.current.gameStarted).toBe(true);
    act(() => { result.current.newGame(); });
    expect(result.current.gameStarted).toBe(false);
  });

  it('clears move history', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.selectSquare('e4'); });
    act(() => { vi.runAllTimers(); });
    act(() => { result.current.newGame(); });
    expect(result.current.moveHistory).toHaveLength(0);
  });

  it('resets selected and legalTargets', () => {
    const { result } = renderHook(() => useChessGame(makeOptions()));
    act(() => { result.current.startGame('multi'); });
    act(() => { result.current.selectSquare('e2'); });
    act(() => { result.current.newGame(); });
    expect(result.current.selected).toBeNull();
    expect(result.current.legalTargets).toHaveLength(0);
  });
});

describe('useChessGame — checkmate detection', () => {
  it('detects Fool\'s mate as checkmate', () => {
    const opts = makeOptions();
    const { result } = renderHook(() => useChessGame(opts));
    act(() => { result.current.startGame('multi'); });

    // Fool's mate sequence
    const moves: [string, string][] = [
      ['f2', 'f3'], ['e7', 'e5'],
      ['g2', 'g4'], ['d8', 'h4'],
    ];
    for (const [from, to] of moves) {
      act(() => { result.current.selectSquare(from as never); });
      act(() => { result.current.selectSquare(to as never); });
      act(() => { vi.runAllTimers(); });
    }

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.gameState).toContain('checkmate');
    expect(opts.recordWin).toHaveBeenCalledWith('black');
  });
});

describe('useChessGame — draw detection (stalemate)', () => {
  it('detects stalemate via FEN setup (chess.js API)', () => {
    // Verify chess.js correctly identifies a known stalemate position.
    // Full UI-based stalemate testing is impractical in unit tests;
    // this validates the chess engine integration used by useChessGame.
    const chess = new Chess();
    chess.load('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(chess.isStalemate()).toBe(true);
  });
});
