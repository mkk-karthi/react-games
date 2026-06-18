import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScores } from '../../hooks/useScores';
import { INITIAL_SCORES, SCORE_KEY } from '../../utils/chess';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('useScores', () => {
  it('initialises with zeroed scores when localStorage is empty', () => {
    const { result } = renderHook(() => useScores());
    expect(result.current.scores).toEqual(INITIAL_SCORES);
  });

  it('loads existing scores from localStorage on mount', () => {
    const stored = { white: 3, black: 1, draws: 2, games: 6 };
    localStorage.setItem(SCORE_KEY, JSON.stringify(stored));
    const { result } = renderHook(() => useScores());
    expect(result.current.scores).toEqual(stored);
  });

  it('falls back to initial scores when localStorage contains invalid JSON', () => {
    localStorage.setItem(SCORE_KEY, 'not-json');
    const { result } = renderHook(() => useScores());
    expect(result.current.scores).toEqual(INITIAL_SCORES);
  });

  it('recordWin increments the correct player and games', () => {
    const { result } = renderHook(() => useScores());
    act(() => { result.current.recordWin('white'); });
    expect(result.current.scores.white).toBe(1);
    expect(result.current.scores.games).toBe(1);
    expect(result.current.scores.black).toBe(0);
  });

  it('recordDraw increments draws and games', () => {
    const { result } = renderHook(() => useScores());
    act(() => { result.current.recordDraw(); });
    expect(result.current.scores.draws).toBe(1);
    expect(result.current.scores.games).toBe(1);
  });

  it('resetScores resets all values to zero', () => {
    const { result } = renderHook(() => useScores());
    act(() => { result.current.recordWin('black'); });
    act(() => { result.current.resetScores(); });
    expect(result.current.scores).toEqual(INITIAL_SCORES);
  });

  it('persists scores to localStorage after every update', () => {
    const { result } = renderHook(() => useScores());
    act(() => { result.current.recordWin('white'); });
    const stored = JSON.parse(localStorage.getItem(SCORE_KEY)!);
    expect(stored.white).toBe(1);
  });
});
