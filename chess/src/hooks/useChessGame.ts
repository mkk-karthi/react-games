import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import type { Move, Piece, Square } from 'chess.js';
import type { GameMode, MovingPiece, CapturedBurst } from '../types/chess';
import { getMoveStyle, MOVE_ANIMATION_MS, CAPTURE_ANIMATION_MS, COMPUTER_DELAY_MS, files, ranks } from '../utils/chess';
import type { ToneKind } from './useAudio';

interface UseChessGameOptions {
  playTone: (kind: ToneKind) => void;
  recordWin: (winner: 'white' | 'black') => void;
  recordDraw: () => void;
}

export function useChessGame({ playTone, recordWin, recordDraw }: UseChessGameOptions) {
  const chessRef = useRef(new Chess());

  // Timer refs — cleaned up on unmount
  const computerTimerRef = useRef<number | null>(null);
  const moveTimerRef = useRef<number | null>(null);
  const burstTimerRef = useRef<number | null>(null);

  // FIX #1: Use a ref for gameOverHandled to avoid stale-closure issues
  // (React 19 Strict Mode double-invokes effects; a ref is always current)
  const gameOverHandledRef = useRef(false);

  const [board, setBoard] = useState(() => chessRef.current.board());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [gameState, setGameState] = useState('Ready to play');
  const [mode, setMode] = useState<GameMode>('single');
  const [gameStarted, setGameStarted] = useState(false);
  const [computerThinking, setComputerThinking] = useState(false);
  const [lastMove, setLastMove] = useState<Pick<Move, 'from' | 'to'> | null>(null);
  const [movingPiece, setMovingPiece] = useState<MovingPiece | null>(null);
  const [capturedBurst, setCapturedBurst] = useState<CapturedBurst | null>(null);

  // Clear all animation timers on unmount
  useEffect(() => {
    return () => {
      if (computerTimerRef.current) window.clearTimeout(computerTimerRef.current);
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  /** Build a human-readable status from the current chess state. */
  const buildGameStatus = useCallback((): string => {
    const chess = chessRef.current;
    const side = chess.turn() === 'w' ? 'White' : 'Black';
    if (chess.isCheckmate()) return `${side === 'White' ? 'Black' : 'White'} wins by checkmate`;
    if (chess.isStalemate()) return 'Draw by stalemate';
    if (chess.isInsufficientMaterial()) return 'Draw by insufficient material';
    if (chess.isThreefoldRepetition()) return 'Draw by threefold repetition';
    if (chess.isDraw()) return 'Draw game';
    // FIX #3: correctly detect check after every status update (including undo)
    return chess.isCheck() ? `${side} to move, king in check` : `${side} to move`;
  }, []);

  /** Updates game state and fires score callbacks if the game just ended. */
  const updateGameStatus = useCallback(() => {
    const chess = chessRef.current;
    const status = buildGameStatus();
    setGameState(status);

    if (chess.isGameOver() && !gameOverHandledRef.current) {
      gameOverHandledRef.current = true;
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'black' : 'white';
        recordWin(winner);
        playTone('victory');
      } else {
        recordDraw();
        playTone('draw');
      }
    }
  }, [buildGameStatus, playTone, recordDraw, recordWin]);

  // Re-evaluate status whenever the board changes
  useEffect(() => { updateGameStatus(); }, [board, updateGameStatus]);

  /** Apply a move on the chess engine and kick off animations. Returns the Move or null. */
  const applyMove = useCallback(
    (from: Square, to: Square): Move | null => {
      const chess = chessRef.current;
      const moving = chess.get(from);
      const target = chess.get(to);
      const move = chess.move({ from, to, promotion: 'q' });
      if (!move || !moving) return null;

      // Cancel any pending animation timers
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);

      setMovingPiece({ id: Date.now(), piece: moving, from, to });
      setSelected(null);
      setLegalTargets([]);
      setLastMove({ from: move.from, to: move.to });

      // Delay board sync + sound until the slide animation completes
      moveTimerRef.current = window.setTimeout(() => {
        setBoard(chess.board());
        setMovingPiece(null);

        if (!chess.isGameOver()) {
          if (chess.isCheck()) {
            playTone('check');
          } else if (move.flags.includes('k') || move.flags.includes('q')) {
            playTone('castle');
          } else if (move.flags.includes('p')) {
            playTone('promotion');
          } else {
            playTone(move.captured ? 'capture' : 'move');
          }
        }

        if (target || move.captured) {
          const capturedColor = move.color === 'w' ? 'b' : 'w';
          setCapturedBurst({
            id: Date.now() + 1,
            piece: target ?? { type: move.captured!, color: capturedColor },
            square: to,
          });
          burstTimerRef.current = window.setTimeout(() => {
            setCapturedBurst(null);
            burstTimerRef.current = null;
          }, CAPTURE_ANIMATION_MS);
        }
        moveTimerRef.current = null;
      }, MOVE_ANIMATION_MS);

      return move;
    },
    [playTone],
  );

  /** Computer picks best-priority move: checks > captures > random. */
  const makeComputerMove = useCallback(() => {
    const chess = chessRef.current;
    if (mode !== 'single' || chess.turn() !== 'b' || chess.isGameOver()) {
      setComputerThinking(false);
      return;
    }
    const moves = chess.moves({ verbose: true }) as Move[];
    const checks = moves.filter((m) => m.san.includes('+') || m.san.includes('#'));
    const captures = moves.filter((m) => m.captured);
    const pool = checks.length ? checks : captures.length ? captures : moves;
    const move = pool[Math.floor(Math.random() * pool.length)];
    if (move) applyMove(move.from, move.to);
    setComputerThinking(false);
  }, [applyMove, mode]);

  // Trigger computer move when it's black's turn in single-player mode
  useEffect(() => {
    const chess = chessRef.current;
    if (!gameStarted || mode !== 'single' || chess.turn() !== 'b' || chess.isGameOver()) return;
    setComputerThinking(true);
    computerTimerRef.current = window.setTimeout(makeComputerMove, COMPUTER_DELAY_MS);
    return () => {
      if (computerTimerRef.current) window.clearTimeout(computerTimerRef.current);
    };
  }, [board, gameStarted, makeComputerMove, mode]);

  /** Handle a player clicking a square. */
  const selectSquare = useCallback(
    (square: Square) => {
      const chess = chessRef.current;
      if (
        movingPiece ||
        !gameStarted ||
        chess.isGameOver() ||
        computerThinking ||
        (mode === 'single' && chess.turn() === 'b')
      ) return;

      const piece = chess.get(square);

      // Move if the clicked square is a legal target
      if (selected && legalTargets.includes(square)) {
        applyMove(selected, square);
        return;
      }

      // Select the clicked piece if it belongs to the current player
      if (piece?.color === chess.turn()) {
        setSelected(square);
        setLegalTargets(
          chess.moves({ square, verbose: true }).map((m) => m.to as Square),
        );
        playTone('select');
        return;
      }

      // If a piece was selected and they click an invalid move target (not own piece, not legal target)
      if (selected) {
        setSelected(null);
        setLegalTargets([]);
        playTone('error');
        return;
      }

      // Clicking empty square / enemy piece with no selection
      playTone('error');
    },
    [applyMove, computerThinking, gameStarted, legalTargets, mode, movingPiece, selected, playTone],
  );

  /** Reset the board to a fresh game. */
  const resetBoard = useCallback(
    (nextMode: GameMode = mode, started = true) => {
      if (computerTimerRef.current) window.clearTimeout(computerTimerRef.current);
      if (moveTimerRef.current) { window.clearTimeout(moveTimerRef.current); moveTimerRef.current = null; }
      if (burstTimerRef.current) { window.clearTimeout(burstTimerRef.current); burstTimerRef.current = null; }

      chessRef.current = new Chess();
      gameOverHandledRef.current = false;

      setMode(nextMode);
      setGameStarted(started);
      setComputerThinking(false);
      setSelected(null);
      setLegalTargets([]);
      setLastMove(null);
      setMovingPiece(null);
      setCapturedBurst(null);
      setBoard(chessRef.current.board());
      setGameState('White to move');
      playTone('start');
    },
    [mode, playTone],
  );

  const startGame = useCallback(
    (nextMode: GameMode = mode) => resetBoard(nextMode, true),
    [mode, resetBoard],
  );

  const newGame = useCallback(() => resetBoard(mode, false), [mode, resetBoard]);

  /** Undo the last move (or last two moves in single-player). */
  const undoMove = useCallback(() => {
    if (movingPiece || computerThinking) return;
    if (computerTimerRef.current) window.clearTimeout(computerTimerRef.current);

    const chess = chessRef.current;
    if (!gameStarted || chess.history().length === 0 || chess.isGameOver()) return;

    chess.undo();
    if (mode === 'single' && chess.history().length > 0 && chess.turn() === 'b') {
      chess.undo();
    }

    setComputerThinking(false);
    setSelected(null);
    setLegalTargets([]);

    const history = chess.history({ verbose: true }) as Move[];
    const prev = history[history.length - 1];
    setLastMove(prev ? { from: prev.from, to: prev.to } : null);
    setBoard(chess.board());
    // FIX #3: re-use buildGameStatus so check is correctly detected after undo
    setGameState(buildGameStatus());
    playTone('undo');
  }, [buildGameStatus, computerThinking, gameStarted, mode, movingPiece, playTone]);

  // ── Derived / memoised values ──────────────────────────────────────────────

  const capturedPieces = useMemo((): Piece[] => {
    const history = chessRef.current.history({ verbose: true }) as Move[];
    return history
      .filter((m) => m.captured)
      .map((m) => ({ type: m.captured!, color: m.color === 'w' ? 'b' : 'w' }));
  }, [board]);

  const moveHistory = useMemo(() => chessRef.current.history(), [board]);

  const moveStyle = movingPiece
    ? getMoveStyle(movingPiece.from, movingPiece.to)
    : undefined;

  const isGameOver = chessRef.current.isGameOver();

  // Find the king's square if currently in check
  const checkSquare = useMemo((): Square | null => {
    const chess = chessRef.current;
    if (!chess.isCheck()) return null;
    const turn = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${files[c]}${ranks[r]}` as Square;
        }
      }
    }
    return null;
  }, [board]);

  return {
    // State
    board,
    selected,
    legalTargets,
    gameState,
    mode,
    setMode,
    gameStarted,
    computerThinking,
    lastMove,
    movingPiece,
    capturedBurst,
    isGameOver,
    checkSquare,
    // Derived
    capturedPieces,
    moveHistory,
    moveStyle,
    // Actions
    selectSquare,
    startGame,
    newGame,
    undoMove,
  };
}
