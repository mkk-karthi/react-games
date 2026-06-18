import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chess } from 'chess.js';
import { Board } from '../../components/Board/Board';

function makeDefaultProps(overrides = {}) {
  const chess = new Chess();
  return {
    board: chess.board(),
    selected: null,
    legalTargets: [],
    lastMove: null,
    movingPiece: null,
    capturedBurst: null,
    moveStyle: undefined,
    onSquareClick: vi.fn(),
    ...overrides,
  };
}

describe('Board', () => {
  it('renders 64 squares (buttons)', () => {
    render(<Board {...makeDefaultProps()} />);
    expect(screen.getAllByRole('button')).toHaveLength(64);
  });

  it('has aria-label "Chess board"', () => {
    render(<Board {...makeDefaultProps()} />);
    expect(screen.getByRole('generic', { name: 'Chess board' })).toBeInTheDocument();
  });

  it('renders all initial 32 pieces', () => {
    render(<Board {...makeDefaultProps()} />);
    // 16 white + 16 black pieces = 32 SVG role=img elements
    expect(screen.getAllByRole('img')).toHaveLength(32);
  });

  it('renders with empty board (no pieces)', () => {
    const chess = new Chess();
    chess.clear();
    render(<Board {...makeDefaultProps({ board: chess.board() })} />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('does not render MovingPieceOverlay when movingPiece is null', () => {
    const { container } = render(<Board {...makeDefaultProps()} />);
    expect(container.querySelector('.animate-movePiece')).not.toBeInTheDocument();
  });

  it('does not render CaptureOverlay when capturedBurst is null', () => {
    const { container } = render(<Board {...makeDefaultProps()} />);
    expect(container.querySelector('.animate-captureOut')).not.toBeInTheDocument();
  });

  it('shows the square a1 with aria-label containing "a1"', () => {
    render(<Board {...makeDefaultProps()} />);
    // a1 has a white rook in the starting position
    const a1 = screen.getByRole('button', { name: /a1/ });
    expect(a1).toBeInTheDocument();
  });
});
