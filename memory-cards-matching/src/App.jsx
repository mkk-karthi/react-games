import { useState, useCallback, useEffect } from "react";
import TitleBar from "./componets/TitleBar";
import StatsBar from "./componets/StatsBar";
import useTimer from "./hooks/useTimer";

import successSound from "./assets/success.mp3";
import swooshSound from "./assets/swoosh.mp3";
import levelUpSound from "./assets/level-up.mp3";

const THEMES = {
  faces: {
    name: "😊 Faces",
    emojis: ["😀", "😎", "🤩", "😂", "🥳", "😍", "🤔", "😴"],
    cardBg: "linear-gradient(to bottom right, #f3e8ff, #fce7f3)",
  },
  animals: {
    name: "🐶 Animals",
    emojis: ["🐶", "🐴", "🐷", "🐹", "🐣", "🦊", "🐻", "🐵"],
    cardBg: "linear-gradient(to bottom right, #dcfce7, #ccfbf1)",
  },
  food: {
    name: "🍕 Food",
    emojis: ["🍕", "🍔", "🌮", "🍿", "🍩", "🍦", "🎂", "🍪"],
    cardBg: "linear-gradient(to bottom right, #fef3c7, #fed7aa)",
  },
  nature: {
    name: "🌸 Nature",
    emojis: ["🌹", "🌸", "🌺", "🌻", "🌷", "🌼", "🌲", "🌵"],
    cardBg: "linear-gradient(to bottom right, #fce7f3, #ffe4e6)",
  },
  space: {
    name: "🚀 Space",
    emojis: ["🚀", "🛸", "⭐", "☄️", "🪐", "🌕", "🌙", "✨"],
    cardBg: "linear-gradient(to bottom right, #e0e7ff, #f3e8ff)",
  },
};

function App() {
  const [theme, setTheme] = useState("faces");
  const [timer, setTimer, clearTimer, resetTimer] = useTimer();
  const [cards, setCards] = useState([]);
  const [load, setLoad] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [muted, setMuted] = useState(false);
  const noCols = 4;
  const noRows = 4;

  const successAudio = new Audio(successSound);
  const swooshAudio = new Audio(swooshSound);
  const LevelUpAudio = new Audio(levelUpSound);

  useEffect(() => {
    const content = Array.from({ length: (noCols * noRows) / 2 }, (_, i) => i);
    dynamicCardGenerator(content);

    setTimer();
    return () => clearTimer();
  }, [theme]);

  useEffect(() => {}, [score]);

  // generate dynamic card
  const dynamicCardGenerator = useCallback((content) => {
    const initialData = [...Array(noRows).keys()].map(() => [...Array(noCols).fill(null)]);
    const tempContent = content.map((i) => {
      return {
        val: i,
        cnt: 0,
      };
    });
    for (let row in initialData) {
      for (let col in initialData[row]) {
        const randomIndex = Math.floor(Math.random() * tempContent.length);

        initialData[row][col] = {
          matched: false,
          revealed: false,
          content: tempContent[randomIndex].val,
        };
        tempContent[randomIndex].cnt += 1;
        if (tempContent[randomIndex].cnt >= 2) {
          tempContent.splice(randomIndex, 1);
        }
      }
    }
    setCards(initialData);
  });

  const handleOpen = (row, col) => {
    if (!load) {
      const tempCards = [...cards];
      if (tempCards[row][col].matched == false) {
        setLoad(true);
        if (!muted && tempCards[row][col].revealed == false) swooshAudio.play();
        tempCards[row][col].revealed = true;
        setCards(tempCards);
        checkMach();
      }
    }
  };

  const checkMach = () => {
    const tempCards = [...cards];
    let revealedCards = tempCards.flat().filter((r) => r.revealed);

    if (revealedCards.length == 2) {
      setMoves((v) => v + 1);

      // check cards are match
      if (revealedCards[0].content == revealedCards[1].content) {
        setScore((v) => v + 1);
        changeCardData("matched");
        setLoad(false);
      } else {
        // when not match, don't close immediately the opened cards
        setTimeout(() => {
          changeCardData("reset");
          setLoad(false);
        }, 600);
      }
    } else {
      setLoad(false);
    }
  };

  const changeCardData = (type) => {
    let newCards = [...cards];

    if (type == "matched") {
      newCards = newCards.map((r) =>
        r.map((v) => {
          if (v.revealed) {
            return {
              ...v,
              revealed: false,
              matched: true,
            };
          } else {
            return v;
          }
        })
      );
    } else {
      newCards = newCards.map((r) =>
        r.map((v) => {
          return {
            ...v,
            revealed: false,
          };
        })
      );
    }
    setCards(newCards);

    // check all cards are matched
    let matchedCards = newCards.flat().filter((r) => r.matched);
    if (matchedCards.length == newCards.flat().length) {
      if (!muted) successAudio.play();
      clearTimer();
      setTimeout(() => setGameOver(true), 500);
    } else if (type == "matched") {
      if (!muted) LevelUpAudio.play();
    }
  };

  const reset = () => {
    setGameOver(false);
    setLoad(false);
    setScore(0);
    setMoves(0);
    setCards((card) =>
      card.map((r) =>
        r.map((v) => {
          return {
            ...v,
            revealed: false,
            matched: false,
          };
        })
      )
    );

    // all cars are closed and reset the card value
    setTimeout(() => {
      const content = Array.from({ length: (noCols * noRows) / 2 }, (_, i) => i);
      dynamicCardGenerator(content);

      resetTimer();
    }, 300);
  };

  const getThemeBgClass = () => {
    const bgClasses = {
      faces: "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400",
      animals: "bg-gradient-to-br from-green-400 via-teal-400 to-blue-400",
      food: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400",
      nature: "bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400",
      space: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
    };
    return bgClasses[theme];
  };

  const currentTheme = THEMES[theme];

  const cardBackStyle = {
    background: currentTheme.cardBg,
    borderRadius: "1rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid rgba(255,255,255,0.5)",
    backfaceVisibility: "hidden",
    position: "absolute",
    width: "100%",
    height: "100%",
  };

  const cardFrontStyle = {
    ...cardBackStyle,
    background: "#fff",
    border: "3px solid rgba(255,255,255,0.8)",
    transform: "rotateY(180deg)",
  };

  return (
    <div className={`relative min-h-screen ${getThemeBgClass()} p-4 sm:p-8`}>
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-slow opacity-20">
          {THEMES[theme].emojis[0]}
        </div>
        <div className="absolute top-10 right-10 text-6xl animate-wiggle opacity-20">
          {THEMES[theme].emojis[1]}
        </div>
        <div className="absolute top-2/5 left-30 text-5xl animate-skew opacity-20">
          {THEMES[theme].emojis[2]}
        </div>
        <div className="absolute top-3/5 right-30 text-5xl animate-bounce opacity-20">
          {THEMES[theme].emojis[3]}
        </div>
        <div className="absolute bottom-10 left-10 text-7xl animate-wiggle opacity-20">
          {THEMES[theme].emojis[4]}
        </div>
        <div className="absolute bottom-10 right-10 text-6xl animate-float opacity-20">
          {THEMES[theme].emojis[5]}
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <TitleBar title="Memory Match" content="Find all the matching pairs!" />

        {/* Stats Bar */}
        <StatsBar
          time={timer}
          moves={moves}
          score={score}
          reset={reset}
          muted={muted}
          setMuted={(v) => setMuted(v)}
        />

        {/* Game Board */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-[70%] mx-auto grid grid-cols-4 gap-3 sm:gap-4 bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-4 shadow-xl border border-white/30">
            {cards.map((row, x) =>
              row.map((col, y) => {
                const isFlipped = col.revealed || col.matched;
                const isMatched = col.matched;

                return (
                  <div
                    key={x + "-" + y}
                    onClick={() => handleOpen(x, y)}
                    className={`aspect-square cursor-pointer transition-all duration-300 transform ${
                      isMatched ? "scale-95 opacity-50" : "hover:scale-105"
                    }`}
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                      }}
                    >
                      {/* Card Back */}
                      <div style={cardBackStyle}>
                        <div className="text-4xl sm:text-5xl opacity-30">❓</div>
                      </div>

                      {/* Card Front */}
                      <div style={cardFrontStyle}>
                        <div className="text-4xl sm:text-5xl">
                          {THEMES[theme].emojis[col.content]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Theme Selector */}
          <div className="w-auto sm:w-[25%] mx-auto bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-4 shadow-2xl border border-white/30">
            <div className="flex flex-wrap gap-3 justify-center content-center h-full">
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    reset();
                    setTimeout(() => {
                      setTheme(key);
                    }, 250);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-110 active:scale-95 ${
                    theme === key
                      ? "bg-white text-gray-800 shadow-xl scale-105 ring-4 ring-white/50"
                      : "bg-white/50 text-white hover:bg-white/70 shadow-lg"
                  }`}
                >
                  {THEMES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">You Won!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-2xl text-gray-600">
                  <span className="font-semibold">Moves:</span> {score}
                </p>
                <p className="text-2xl text-gray-600">
                  <span className="font-semibold">Time:</span> {timer}
                </p>
                {moves === score && (
                  <p className="text-xl text-green-600 font-semibold">🏆 New Best Score!</p>
                )}
              </div>
              <button
                onClick={reset}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
