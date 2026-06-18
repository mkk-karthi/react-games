import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InfoPanel } from '../../components/panels/InfoPanel';
import type { StoredScores } from '../../types/chess';
import type { Piece } from 'chess.js';

const DEFAULT_SCORES: StoredScores = { white: 3, black: 1, draws: 2, games: 6 };

describe('InfoPanel', () => {
  it('renders White, Black, and Draws score labels', () => {
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={[]} onResetScores={vi.fn()} />,
    );
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Draws')).toBeInTheDocument();
  });

  it('displays correct score values', () => {
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={[]} onResetScores={vi.fn()} />,
    );
    expect(screen.getByLabelText('White score')).toHaveTextContent('3');
    expect(screen.getByLabelText('Black score')).toHaveTextContent('1');
    expect(screen.getByLabelText('Draws score')).toHaveTextContent('2');
  });

  it('shows "No captures" when captured pieces list is empty', () => {
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={[]} onResetScores={vi.fn()} />,
    );
    expect(screen.getByText('No captures')).toBeInTheDocument();
  });

  it('renders captured piece SVGs when pieces exist', () => {
    const captured: Piece[] = [
      { type: 'p', color: 'b' },
      { type: 'n', color: 'w' },
    ];
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={captured} onResetScores={vi.fn()} />,
    );
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('calls onResetScores when Reset scores button is clicked', async () => {
    const onResetScores = vi.fn();
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={[]} onResetScores={onResetScores} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /reset scores/i }));
    expect(onResetScores).toHaveBeenCalledOnce();
  });

  it('shows at most 12 captured pieces', () => {
    const captured: Piece[] = Array.from({ length: 15 }, () => ({ type: 'p', color: 'b' as const }));
    render(
      <InfoPanel scores={DEFAULT_SCORES} capturedPieces={captured} onResetScores={vi.fn()} />,
    );
    expect(screen.getAllByRole('img')).toHaveLength(12);
  });
});
