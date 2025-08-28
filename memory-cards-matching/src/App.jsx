import { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import TitleBar from "./componets/TitleBar";
import SideBar from "./componets/SideBar";

function App() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [load, setLoad] = useState(false);
  const [cards, setCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    const content = Array.from({ length: (noCols * noRows) / 2 }, (_, i) => i);
    dynamicCardGenerator(content);

    const curTime = Date.now();
    const curInterval = setInterval(() => getTime(curTime), 1000);
    interval.current = curInterval;
    return () => clearInterval(interval.current);
  }, []);

  // running time
  const getTime = (time) => {
    let total = Date.now() - time;
    let sec = Math.floor((total / 1000) % 60);
    let min = Math.floor((total / 1000 / 60) % 60);
    let hrs = Math.floor((total / (1000 * 60 * 60)) % 24);

    sec = sec > 9 ? sec : `0${sec}`;
    min = min > 9 ? min : `0${min}`;
    hrs = hrs > 9 ? hrs : `0${hrs}`;

    setTime(`${hrs}:${min}:${sec}`);
  };

  // generate dynamic card
  const noCols = 4;
  const noRows = 4;
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
      setLoad(true);
      const tempCards = [...cards];
      tempCards[row][col].revealed = true;
      setCards(tempCards);
      checkMach();
    }
  };

  const checkMach = () => {
    const tempCards = [...cards];
    let revealedCards = tempCards.flat().filter((r) => r.revealed);

    if (revealedCards.length == 2) {
      setScore((v) => v + 1);

      // check cards are match
      if (revealedCards[0].content == revealedCards[1].content) {
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
      clearInterval(interval.current);
      setTimeout(() => setGameOver(true), 500);
    }
  };

  const reset = () => {
    setGameOver(false);
    setLoad(false);
    setTime("00:00:00");
    setScore(0);
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

      clearInterval(interval.current);
      const curTime = Date.now();
      const curInterval = setInterval(() => getTime(curTime), 1000);
      interval.current = curInterval;
    }, 300);
  };

  return (
    <>
      <div className="p-4 h-screen flex justify-center place-items-center flex-col bg-blue-200">
        <TitleBar title="Memory: Cards Matching" />
        <div className="flex my-2 flex-col-reverse sm:flex-row">
          <div className="relative">
            <table
              className={`border-separate border-spacing-2 bg-white shadow-2xl rounded-lg ${
                gameOver &&
                "opacity-70 cursor-not-allowed before:z-10 before:bg-[rgba(0,0,0,0.6)] before:absolute before:inset-0"
              }`}
            >
              <tbody>
                {cards.map((row, x) => (
                  <tr key={x}>
                    {row.map((col, y) => (
                      <td
                        key={y}
                        onClick={() => handleOpen(x, y)}
                        className={`size-20  [perspective:50rem] ${
                          gameOver ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <div
                          className={`relative size-full transition duration-500 [transform-style:preserve-3d] ${
                            col.revealed || col.matched ? "[transform:rotateY(180deg)]" : ""
                          }`}
                        >
                          <div className="absolute size-full inset-0 flex justify-center place-items-center rounded-lg bg-gradient-to-b from-blue-600 to-blue-800 [backface-visibility:hidden]">
                            <span className="text-3xl font-bold text-white">?</span>
                          </div>
                          <div className="absolute size-full inset-0 flex justify-center place-items-center rounded-lg bg-white inset-shadow-[0_0_10px] inset-shadow-blue-900 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            <span
                              className={`text-3xl font-bold text-blue-900 confetti ${
                                col.matched && "animate"
                              }`}
                            >
                              {col.content}
                            </span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {gameOver ? (
              <div className="absolute top-[50%] left-[50%] translate-[-50%] popup">
                <p className="text-2xl font-bold text-white capitalize text-center mt-2 mb-4 text-shadow-[0_0_15px] text-shadow-black">
                  Game Over
                </p>
                <button
                  className="text-xl font-bold capitalize border-0 outline-0 bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-md px-4 py-2 cursor-pointer shadow-[0_0_15px] shadow-black active:shadow-none"
                  onClick={reset}
                >
                  Play Again!
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <SideBar time={time} score={score} reset={reset} gameOver={gameOver} />
        </div>
        {/* {gameOver ? (
          <div className="absolute inset-[0]">
            <div className="absolute inset-x-[50%] bottom-[10]">
              <ConfettiExplosion {...confettiProps} />
            </div>
          </div>
        ) : (
          ""
        )} */}
      </div>
    </>
  );
}

export default App;
