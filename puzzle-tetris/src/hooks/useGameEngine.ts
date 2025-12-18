import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createInitialState,
  gravityDelayForLevel,
  hardDrop,
  moveLeft,
  moveRight,
  projectGhostPiece,
  restartGame,
  rotateClockwise,
  rotateCounter,
  startGame,
  stepGravity,
  togglePause,
} from "../game/engine";
import type { ActivePiece, GameState, PieceType } from "../game/types";

export interface GameController {
  state: GameState;
  ghost: ActivePiece | null;
  nextPieces: PieceType[];
  start: () => void;
  togglePause: () => void;
  restart: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  rotateCW: () => void;
  rotateCCW: () => void;
}

export const useGameEngine = (): GameController => {
  const [state, setState] = useState<GameState>(() => createInitialState());

  useEffect(() => {
    if (state.status !== "playing") return;
    const delay = gravityDelayForLevel(state.level);
    const id = window.setInterval(() => {
      setState((current) => stepGravity(current));
    }, delay);
    return () => window.clearInterval(id);
  }, [state.status, state.level]);

  const start = useCallback(() => setState((prev) => startGame(prev)), []);
  const toggle = useCallback(() => setState((prev) => togglePause(prev)), []);
  const restart = useCallback(() => setState(restartGame()), []);
  const left = useCallback(() => setState((prev) => moveLeft(prev)), []);
  const right = useCallback(() => setState((prev) => moveRight(prev)), []);
  const soft = useCallback(() => setState((prev) => stepGravity(prev)), []);
  const hard = useCallback(() => setState((prev) => hardDrop(prev)), []);
  const cw = useCallback(() => setState((prev) => rotateClockwise(prev)), []);
  const ccw = useCallback(() => setState((prev) => rotateCounter(prev)), []);

  const ghost = useMemo(
    () => projectGhostPiece(state.board, state.active),
    [state.board, state.active]
  );
  const nextPieces = useMemo(() => state.queue.slice(0, 3), [state.queue]);

  return {
    state,
    ghost,
    nextPieces,
    start,
    togglePause: toggle,
    restart,
    moveLeft: left,
    moveRight: right,
    softDrop: soft,
    hardDrop: hard,
    rotateCW: cw,
    rotateCCW: ccw,
  };
};
