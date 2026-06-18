import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameOverOverlay } from '../../components/overlays/GameOverOverlay';
import type { StoredScores } from '../../types/chess';

const SCORES: StoredScores = { white: 5, black: 3, draws: 1, games: 9 };

describe('GameOverOverlay', () => {
  it('renders the gameState message', () => {
    render(
      <GameOverOverlay gameState="Black wins by checkmate" scores={SCORES} onPlayAgain={vi.fn()} />,
    );
    expect(screen.getByText('Black wins by checkmate')).toBeInTheDocument();
  });

  it('renders current scores', () => {
    render(
      <GameOverOverlay gameState="Draw game" scores={SCORES} onPlayAgain={vi.fn()} />,
    );
    expect(screen.getByText(/White 5/)).toBeInTheDocument();
    expect(screen.getByText(/Black 3/)).toBeInTheDocument();
    expect(screen.getByText(/Draws 1/)).toBeInTheDocument();
  });

  it('renders the Play again button', () => {
    render(
      <GameOverOverlay gameState="Draw game" scores={SCORES} onPlayAgain={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });

  it('calls onPlayAgain when Play again is clicked', async () => {
    const onPlayAgain = vi.fn();
    render(
      <GameOverOverlay gameState="Draw game" scores={SCORES} onPlayAgain={onPlayAgain} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /play again/i }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });

  it('has dialog role and aria-modal attribute', () => {
    render(
      <GameOverOverlay gameState="Draw game" scores={SCORES} onPlayAgain={vi.fn()} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
