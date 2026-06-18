import { useAudio } from './hooks/useAudio';
import { useScores } from './hooks/useScores';
import { useChessGame } from './hooks/useChessGame';
import { Board } from './components/Board/Board';
import { ControlPanel } from './components/panels/ControlPanel';
import { InfoPanel } from './components/panels/InfoPanel';
import { StartOverlay } from './components/overlays/StartOverlay';
import { GameOverOverlay } from './components/overlays/GameOverOverlay';
import './App.css';

export default function App() {
  const { muted, toggleMute, playTone } = useAudio();
  const { scores, recordWin, recordDraw, resetScores } = useScores();
  const {
    board, selected, legalTargets, gameState, mode, setMode,
    gameStarted, computerThinking, lastMove, movingPiece, capturedBurst,
    isGameOver, capturedPieces, moveHistory, moveStyle, checkSquare,
    selectSquare, startGame, newGame, undoMove,
  } = useChessGame({ playTone, recordWin, recordDraw });

  return (
    <main className="min-h-dvh overflow-hidden text-panel-text">

      {/* ── Game room — fixed full-screen background ── */}
      <section className="game-room fixed inset-0 flex items-center justify-center p-2 overflow-hidden before:absolute before:inset-0 before:pointer-events-none">

        {/* ── Shell ── */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl h-screen max-h-screen gap-1 py-2 px-0 overflow-hidden lg:gap-2.5 lg:overflow-visible">

          {/* ── Header rail ── */}
          <div className="panel flex items-center justify-center text-center w-full max-w-lg self-center p-2 lg:max-w-3xl">
            <div>
              <p className="panel-label m-0 uppercase text-xs font-black text-panel-text lg:mb-1">Woodland Chess</p>
              <h1 className="font-display text-lg font-bold leading-none sm:text-2xl md:text-3xl">3D Wooden Board</h1>
            </div>
          </div>

          {/* ── Center zone: control card | board | info card ── */}
          <div className="flex flex-col justify-around gap-1 overflow-hidden items-center w-full h-full flex-1 lg:flex-row lg:justify-center lg:gap-4 lg:overflow-visible">

            <ControlPanel
              gameState={gameState}
              computerThinking={computerThinking}
              gameStarted={gameStarted}
              isGameOver={isGameOver}
              moveHistory={moveHistory}
              movingPiece={movingPiece !== null}
              muted={muted}
              onNewGame={newGame}
              onUndo={undoMove}
              onToggleMute={toggleMute}
            />

            {/* ── Chess Board ── */}
            <div className="board-container flex items-center justify-center w-full flex-none h-auto pb-1.5 lg:flex-auto lg:h-full lg:pb-3">
              <div className="board-wrap animate-tableIn relative max-w-full aspect-square p-4 rounded-lg w-[94%] before:absolute before:inset-1 before:rounded-lg before:border-2 sm:max-w-sm md:max-w-xl lg:max-w-full">
                <Board
                  board={board}
                  selected={selected}
                  legalTargets={legalTargets}
                  lastMove={lastMove}
                  movingPiece={movingPiece}
                  capturedBurst={capturedBurst}
                  moveStyle={moveStyle}
                  onSquareClick={selectSquare}
                  checkSquare={checkSquare}
                />
              </div>
            </div>

            <InfoPanel
              scores={scores}
              capturedPieces={capturedPieces}
              onResetScores={resetScores}
            />
          </div>
        </div>
      </section>

      {!gameStarted && (
        <StartOverlay
          mode={mode}
          onSelectMode={setMode}
          onStartGame={() => startGame(mode)}
        />
      )}

      {isGameOver && (
        <GameOverOverlay
          gameState={gameState}
          scores={scores}
          onPlayAgain={newGame}
        />
      )}
    </main>
  );
}
