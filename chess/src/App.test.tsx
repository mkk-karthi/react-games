import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// ── AudioContext class mock ────────────────────────────────────────────────────
// Arrow functions can't be new-ed, so we use class syntax for the mock.
class MockOscillator {
  type = '';
  frequency = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}
class MockGain {
  gain = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
  connect = vi.fn();
}
class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator() { return new MockOscillator(); }
  createGain() { return new MockGain(); }
}

beforeEach(() => {
  Object.defineProperty(window, 'AudioContext', {
    writable: true,
    configurable: true,
    value: MockAudioContext,
  });
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

// ──────────────────────────────────────────────────────────────────────────────
// Smoke tests — render/layout (no timer interaction needed)
// ──────────────────────────────────────────────────────────────────────────────
describe('App — smoke tests', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Woodland Chess')).toBeInTheDocument();
  });

  it('renders the h1 heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows the start overlay before game begins (dialog role)', () => {
    render(<App />);
    expect(screen.getByRole('dialog', { name: /start a new game/i })).toBeInTheDocument();
  });

  it('renders Single player and Multi player mode cards in start overlay', () => {
    render(<App />);
    expect(screen.getByText('Single player')).toBeInTheDocument();
    expect(screen.getByText('Multi player')).toBeInTheDocument();
  });

  it('renders a Start game button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
  });

  it('does not show game-over overlay on initial load', () => {
    render(<App />);
    expect(screen.queryByRole('dialog', { name: /game over/i })).not.toBeInTheDocument();
  });

  it('renders sound toggle button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /toggle sound/i })).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Mode selection (no game start needed)
// ──────────────────────────────────────────────────────────────────────────────
describe('App — mode selection', () => {
  it('clicking Multi player in the start overlay marks it active', async () => {
    const user = userEvent.setup();
    render(<App />);
    const multiBtn = screen.getByRole('button', { name: /multi player/i });
    await user.click(multiBtn);
    expect(multiBtn).toHaveClass('active');
  });

  it('clicking Single player in the start overlay marks it active', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Default is single, click multi first then single
    await user.click(screen.getByRole('button', { name: /multi player/i }));
    const singleBtn = screen.getByRole('button', { name: /single player/i });
    await user.click(singleBtn);
    expect(singleBtn).toHaveClass('active');
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Sound toggle (no timers)
// ──────────────────────────────────────────────────────────────────────────────
describe('App — sound toggle', () => {
  it('Sound button shows "Sound" label by default', () => {
    render(<App />);
    expect(screen.getByText('Sound')).toBeInTheDocument();
  });

  it('toggles to Muted after one click', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /toggle sound/i }));
    expect(screen.getByText('Muted')).toBeInTheDocument();
  });

  it('toggles back to Sound after two clicks', async () => {
    const user = userEvent.setup();
    render(<App />);
    const btn = screen.getByRole('button', { name: /toggle sound/i });
    await user.click(btn);
    await user.click(btn);
    expect(screen.getByText('Sound')).toBeInTheDocument();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Game start — board appears, overlay disappears
// ──────────────────────────────────────────────────────────────────────────────
describe('App — game start', () => {
  it('hides start overlay after clicking Start game', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.queryByRole('dialog', { name: /start a new game/i })).not.toBeInTheDocument();
  });

  it('shows the chess board grid after starting', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByRole('generic', { name: /chess board/i })).toBeInTheDocument();
  });

  it('renders 64 square buttons on the board', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    const board = screen.getByRole('generic', { name: /chess board/i });
    expect(board.querySelectorAll('button')).toHaveLength(64);
  });

  it('shows "White to move" status after game starts', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByText('White to move')).toBeInTheDocument();
  });

  it('shows "No moves yet" in history panel', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByText('No moves yet')).toBeInTheDocument();
  });

  it('shows "No captures" in captured panel', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByText('No captures')).toBeInTheDocument();
  });

  it('Undo button is disabled at game start', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /start game/i }));
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Board interaction (real timers, multi-player mode)
// ──────────────────────────────────────────────────────────────────────────────
describe('App — board interaction', () => {
  async function startMultiPlayer() {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /multi player/i }));
    await user.click(screen.getByRole('button', { name: /start game/i }));
    return user;
  }

  it('selecting a white pawn shows move target dots', async () => {
    const user = await startMultiPlayer();
    await user.click(screen.getByRole('button', { name: /e2 white pawn/i }));
    expect(document.querySelectorAll('.move-target-dot').length).toBeGreaterThan(0);
  });

  it('clicking a non-target empty square deselects piece', async () => {
    const user = await startMultiPlayer();
    await user.click(screen.getByRole('button', { name: /e2 white pawn/i }));
    // e5 is not a legal target for e2 pawn from start position
    await user.click(screen.getByRole('button', { name: /^e5$/i }));
    expect(document.querySelectorAll('.move-target-dot').length).toBe(0);
  });

  it('Undo remains disabled before any moves', async () => {
    await startMultiPlayer();
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
  });

  it('New Game button is present and clickable', async () => {
    const user = await startMultiPlayer();
    const newGameBtn = screen.getByRole('button', { name: /new game/i });
    await user.click(newGameBtn);
    // After new game, history should still say "No moves yet"
    expect(screen.getByText('No moves yet')).toBeInTheDocument();
    // Start overlay should be displayed again
    expect(screen.getByRole('dialog', { name: /start a new game/i })).toBeInTheDocument();
  });

  it('Reset Scores shows zeroed scores initially', async () => {
    await startMultiPlayer();
    expect(screen.getByLabelText('White score')).toHaveTextContent('0');
    expect(screen.getByLabelText('Black score')).toHaveTextContent('0');
    expect(screen.getByLabelText('Draws score')).toHaveTextContent('0');
  });
});
