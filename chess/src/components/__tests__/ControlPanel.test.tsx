import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlPanel } from '../../components/panels/ControlPanel';

function makeProps(overrides = {}) {
  return {
    gameState: 'White to move',
    computerThinking: false,
    gameStarted: true,
    isGameOver: false,
    moveHistory: [],
    movingPiece: false,
    muted: false,
    onNewGame: vi.fn(),
    onUndo: vi.fn(),
    onToggleMute: vi.fn(),
    ...overrides,
  };
}

describe('ControlPanel', () => {
  it('renders the status text', () => {
    render(<ControlPanel {...makeProps()} />);
    expect(screen.getByText('White to move')).toBeInTheDocument();
  });

  it('shows "Computer thinking" when computerThinking=true', () => {
    render(<ControlPanel {...makeProps({ computerThinking: true })} />);
    expect(screen.getByText('Computer thinking')).toBeInTheDocument();
  });

  it('calls onNewGame when New Game button is clicked', async () => {
    const onNewGame = vi.fn();
    render(<ControlPanel {...makeProps({ onNewGame })} />);
    await userEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('undo button is disabled when moveHistory is empty', () => {
    render(<ControlPanel {...makeProps({ moveHistory: [] })} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });

  it('undo button is enabled when moves exist', () => {
    render(<ControlPanel {...makeProps({ moveHistory: ['e4'] })} />);
    expect(screen.getByRole('button', { name: /undo/i })).not.toBeDisabled();
  });

  it('calls onUndo when Undo is clicked', async () => {
    const onUndo = vi.fn();
    render(<ControlPanel {...makeProps({ moveHistory: ['e4'], onUndo })} />);
    await userEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('calls onToggleMute when sound button is clicked', async () => {
    const onToggleMute = vi.fn();
    render(<ControlPanel {...makeProps({ onToggleMute })} />);
    await userEvent.click(screen.getByRole('button', { name: /toggle sound/i }));
    expect(onToggleMute).toHaveBeenCalledOnce();
  });

  it('shows "Muted" label when muted=true', () => {
    render(<ControlPanel {...makeProps({ muted: true })} />);
    expect(screen.getByText('Muted')).toBeInTheDocument();
  });

  it('shows "No moves yet" when history is empty', () => {
    render(<ControlPanel {...makeProps({ moveHistory: [] })} />);
    expect(screen.getByText('No moves yet')).toBeInTheDocument();
  });

  it('renders up to 8 recent moves in history', () => {
    const moveHistory = ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nc3'];
    render(<ControlPanel {...makeProps({ moveHistory })} />);
    // Only last 8 shown
    expect(screen.queryByText('e4')).not.toBeInTheDocument(); // 9th-from-end is excluded
    expect(screen.getByText('Nc3')).toBeInTheDocument();
  });

  it('undo button is disabled when isGameOver=true', () => {
    render(<ControlPanel {...makeProps({ isGameOver: true, moveHistory: ['e4'] })} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });
});
