import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChessPiece } from '../../components/Board/Board';
import type { Piece } from 'chess.js';

const WHITE_PAWN: Piece = { type: 'p', color: 'w' };
const BLACK_KING: Piece = { type: 'k', color: 'b' };

describe('ChessPiece', () => {
  it('renders an SVG with correct aria-label for white pawn', () => {
    render(<ChessPiece piece={WHITE_PAWN} />);
    expect(screen.getByRole('img', { name: 'White Pawn' })).toBeInTheDocument();
  });

  it('renders an SVG with correct aria-label for black king', () => {
    render(<ChessPiece piece={BLACK_KING} />);
    expect(screen.getByRole('img', { name: 'Black King' })).toBeInTheDocument();
  });

  it.each([
    ['p', 'w', 'White Pawn'],
    ['n', 'w', 'White Knight'],
    ['b', 'w', 'White Bishop'],
    ['r', 'w', 'White Rook'],
    ['q', 'w', 'White Queen'],
    ['k', 'w', 'White King'],
    ['p', 'b', 'Black Pawn'],
    ['n', 'b', 'Black Knight'],
    ['b', 'b', 'Black Bishop'],
    ['r', 'b', 'Black Rook'],
    ['q', 'b', 'Black Queen'],
    ['k', 'b', 'Black King'],
  ] as [string, 'w' | 'b', string][])(
    'renders %s (%s) with label "%s"',
    (type, color, label) => {
      render(<ChessPiece piece={{ type: type as Piece['type'], color }} />);
      expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
    },
  );
});
