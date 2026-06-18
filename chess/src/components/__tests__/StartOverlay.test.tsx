import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartOverlay } from '../../components/overlays/StartOverlay';

describe('StartOverlay', () => {
  it('renders the title text', () => {
    render(
      <StartOverlay mode="single" onSelectMode={vi.fn()} onStartGame={vi.fn()} />,
    );
    expect(screen.getByText(/Start a wooden match/i)).toBeInTheDocument();
  });

  it('renders Single player and Multi player buttons', () => {
    render(
      <StartOverlay mode="single" onSelectMode={vi.fn()} onStartGame={vi.fn()} />,
    );
    expect(screen.getByText('Single player')).toBeInTheDocument();
    expect(screen.getByText('Multi player')).toBeInTheDocument();
  });

  it('renders the Start game button', () => {
    render(
      <StartOverlay mode="single" onSelectMode={vi.fn()} onStartGame={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
  });

  it('calls onSelectMode("multi") when Multi player is clicked', async () => {
    const onSelectMode = vi.fn();
    render(
      <StartOverlay mode="single" onSelectMode={onSelectMode} onStartGame={vi.fn()} />,
    );
    await userEvent.click(screen.getByText('Multi player'));
    expect(onSelectMode).toHaveBeenCalledWith('multi');
  });

  it('calls onSelectMode("single") when Single player is clicked', async () => {
    const onSelectMode = vi.fn();
    render(
      <StartOverlay mode="multi" onSelectMode={onSelectMode} onStartGame={vi.fn()} />,
    );
    await userEvent.click(screen.getByText('Single player'));
    expect(onSelectMode).toHaveBeenCalledWith('single');
  });

  it('calls onStartGame when Start game button is clicked', async () => {
    const onStartGame = vi.fn();
    render(
      <StartOverlay mode="single" onSelectMode={vi.fn()} onStartGame={onStartGame} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /start game/i }));
    expect(onStartGame).toHaveBeenCalledOnce();
  });

  it('has dialog role and aria-modal attribute', () => {
    render(
      <StartOverlay mode="single" onSelectMode={vi.fn()} onStartGame={vi.fn()} />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
