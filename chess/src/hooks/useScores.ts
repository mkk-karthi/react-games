import { useCallback, useEffect, useState } from 'react';
import type { StoredScores } from '../types/chess';
import { SCORE_KEY, INITIAL_SCORES } from '../utils/chess';

function loadScores(): StoredScores {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    if (!raw) return { ...INITIAL_SCORES };
    return { ...INITIAL_SCORES, ...JSON.parse(raw) };
  } catch {
    return { ...INITIAL_SCORES };
  }
}

/** Persists win/draw/game tallies in localStorage. */
export function useScores() {
  const [scores, setScores] = useState<StoredScores>(loadScores);

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  }, [scores]);

  const recordWin = useCallback((winner: 'white' | 'black') => {
    setScores((prev) => ({
      ...prev,
      games: prev.games + 1,
      [winner]: prev[winner] + 1,
    }));
  }, []);

  const recordDraw = useCallback(() => {
    setScores((prev) => ({ ...prev, draws: prev.draws + 1, games: prev.games + 1 }));
  }, []);

  const resetScores = useCallback(() => setScores({ ...INITIAL_SCORES }), []);

  return { scores, recordWin, recordDraw, resetScores };
}
