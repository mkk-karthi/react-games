import React from "react";

interface StartScreenProps {
  onStart: () => void;
  inputMethod: "mouse" | "keyboard" | "touch";
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, inputMethod }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20 game-element">
      <div className="glass-effect p-8 rounded-2xl max-w-md mx-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-glow bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
          Block Breaker
        </h1>

        <p className="text-gray-300 mb-6">Break all the blocks to win! Don't let the ball fall.</p>

        <div className="mb-6 p-4 glass-effect rounded-lg">
          <h3 className="text-neon-blue font-semibold mb-3">Controls</h3>
          <div className="text-sm text-gray-300 space-y-2">
            {inputMethod === "touch" ? (
              <>
                <div>
                  👆 <span className="text-neon-green">Drag</span> to move paddle
                </div>
                <div>
                  👆 <span className="text-neon-green">Tap</span> to launch ball
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-neon-green">Arrow Keys</span> to move paddle
                </div>
                <div>
                  <span className="text-neon-green">Space / Click</span> to launch ball
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onStart}
          className="px-4 py-2 rounded-lg font-bold text-lg neon-border border-neon-pink text-neon-pink hover:bg-neon-pink/20 transition-all transform hover:scale-105 animate-pulse-glow"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
