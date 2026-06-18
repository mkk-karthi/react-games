import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chess } from 'chess.js';
import { Board } from '../../components/Board/Board';
import type { Move, Square } from 'chess.js';
import type { CapturedBurst, MovingPiece } from '../../types/chess';

// Helper — renders a Board with defaults and returns the rendered result
function makeProps(overrides: Partial<Parameters<typeof Board>[0]> = {}) {
  const chess = new Chess();
  return {
    board: chess.board(),
    selected: null as Square | null,
    legalTargets: [] as Square[],
    lastMove: null as Pick<Move, 'from' | 'to'> | null,
    movingPiece: null as MovingPiece | null,
    capturedBurst: null as CapturedBurst | null,
    moveStyle: undefined,
    onSquareClick: vi.fn(),
    ...overrides,
  };
}

describe('BoardSquare (via Board)', () => {
  it('renders 64 square buttons', () => {
    render(<Board {...makeProps()} />);
    expect(screen.getAllByRole('button')).toHaveLength(64);
  });

  it('square a1 has correct aria-label including piece name', () => {
    render(<Board {...makeProps()} />);
    // a1 = white rook in starting position
    expect(screen.getByRole('button', { name: /a1 white rook/i })).toBeInTheDocument();
  });

  it('square e4 (empty) aria-label is just the square name', () => {
    render(<Board {...makeProps()} />);
    expect(screen.getByRole('button', { name: /^e4$/i })).toBeInTheDocument();
  });

  it('applies square-light class to a8 (rowIndex=0, colIndex=0 → even)', () => {
    render(<Board {...makeProps()} />);
    const a8 = screen.getByRole('button', { name: /^a8/i });
    expect(a8).toHaveClass('square-light');
  });

  it('applies square-dark class to b8 (rowIndex=0, colIndex=1 → odd)', () => {
    render(<Board {...makeProps()} />);
    const b8 = screen.getByRole('button', { name: /^b8/i });
    expect(b8).toHaveClass('square-dark');
  });

  it('renders file coordinate label "e" on row 7 (rank 1)', () => {
    render(<Board {...makeProps()} />);
    // e1 square is in row 7 — file label "e" should be rendered
    expect(screen.getByRole('button', { name: /e1/i }).querySelector('span')).toBeInTheDocument();
    // At least one span shows the file label "e"
    const e1 = screen.getByRole('button', { name: /e1/i });
    expect(e1.textContent).toContain('e');
  });

  it('renders rank coordinate label "8" on col 0 (file a)', () => {
    render(<Board {...makeProps()} />);
    const a8 = screen.getByRole('button', { name: /^a8/i });
    expect(a8.textContent).toContain('8');
  });

  it('shows selected-square class on the selected square', () => {
    render(<Board {...makeProps({ selected: 'e2' as Square })} />);
    expect(screen.getByRole('button', { name: /e2/i })).toHaveClass('selected-square');
  });

  it('shows move-target-dot when square is in legalTargets', () => {
    const { container } = render(
      <Board {...makeProps({ legalTargets: ['e4' as Square] })} />,
    );
    expect(container.querySelector('.move-target-dot')).toBeInTheDocument();
  });

  it('does not show move-target-dot when square is not in legalTargets', () => {
    const { container } = render(<Board {...makeProps()} />);
    expect(container.querySelector('.move-target-dot')).not.toBeInTheDocument();
  });

  it('calls onSquareClick with the correct square when clicked', async () => {
    const onSquareClick = vi.fn();
    render(<Board {...makeProps({ onSquareClick })} />);
    await userEvent.click(screen.getByRole('button', { name: /^d4$/i }));
    expect(onSquareClick).toHaveBeenCalledWith('d4');
  });

  it('applies last-move class to from and to squares', () => {
    render(
      <Board {...makeProps({ lastMove: { from: 'e2' as Square, to: 'e4' as Square } })} />,
    );
    expect(screen.getByRole('button', { name: /e2/i })).toHaveClass('last-move');
    expect(screen.getByRole('button', { name: /e4/i })).toHaveClass('last-move');
  });

  it('hides piece on the from-square while animation is active', () => {
    const chess = new Chess();
    const movingPiece: MovingPiece = {
      id: 1,
      piece: { type: 'p', color: 'w' },
      from: 'e2' as Square,
      to: 'e4' as Square,
    };
    render(<Board {...makeProps({ board: chess.board(), movingPiece })} />);
    // The square's aria-label still includes the piece (logical state unchanged),
    // but the SVG is not rendered inside the button when isHiddenForAnimation=true.
    const e2 = screen.getByRole('button', { name: /e2 white pawn/i });
    expect(e2).toBeInTheDocument();
    expect(e2.querySelector('svg.chess-piece-svg')).not.toBeInTheDocument();
  });
});
