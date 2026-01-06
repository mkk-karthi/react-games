import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Button from "./components/Button";
import {
  DownArrow,
  LeftArrow,
  Pause,
  Play,
  Restart,
  RightArrow,
  UpArrow,
} from "./components/Icons";
import MobileSwiper from "./components/MobileSwiper";
import useFaviconTheme from "./hooks/useFaviconTheme";

function App() {
  // set ground
  const groundWidth = 30;
  const groundHeight = 30;
  const speed = 300;
  const ground = [...Array(groundHeight).keys()].map(() => [...Array(groundWidth)]);
  const StoreKey = "snake.score";

  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState(4);
  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem(StoreKey) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [isActive, setActive] = useState(false);

  // state variable does not update as expected within a setInterval callback, So use useRef hook.
  const intervalRef = useRef(null);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const snakeRef = useRef(snake);
  const isActiveRef = useRef(isActive);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    if (localStorage.getItem(StoreKey) < score) {
      localStorage.setItem(StoreKey, score);
      setBestScore(score);
    }
  }, [score]);

  useEffect(() => {
    generateFood();
    intervalRef.current = setInterval(moveSnake, speed);
    reset();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, []);

  const moveSnake = () => {
    if (!gameOverRef.current && isActiveRef.current) {
      const lastIndex = snakeRef.current.length - 1;
      const tempSnake = [...snakeRef.current];

      // check the direction of the snake to move the next step
      let newSnake = [-1, -1];
      if (directionRef.current == 1) {
        newSnake = [tempSnake[lastIndex][0] - 1, tempSnake[lastIndex][1]];
      } else if (directionRef.current == 2) {
        newSnake = [tempSnake[lastIndex][0] + 1, tempSnake[lastIndex][1]];
      } else if (directionRef.current == 3) {
        newSnake = [tempSnake[lastIndex][0], tempSnake[lastIndex][1] - 1];
      } else if (directionRef.current == 4) {
        newSnake = [tempSnake[lastIndex][0], tempSnake[lastIndex][1] + 1];
      }

      // check moves the snake end of the board or self-conflict
      if (
        newSnake[0] >= 0 &&
        newSnake[0] <= groundWidth - 1 &&
        newSnake[1] >= 0 &&
        newSnake[1] <= groundWidth - 1 &&
        tempSnake.filter((v) => v[0] == newSnake[0] && v[1] == newSnake[1]).length <= 0
      ) {
        tempSnake.push(newSnake);
        let tempFood = foodRef.current;

        // check catch the food
        if (tempFood[0] == newSnake[0] && tempFood[1] == newSnake[1]) {
          setScore((v) => v + 1);
          generateFood();
        } else {
          tempSnake.shift();
        }
      } else {
        setGameOver(true);
      }
      setSnake(tempSnake);
    }
  };

  const generateFood = () => {
    let x = Math.floor(Math.random() * groundWidth);
    let y = Math.floor(Math.random() * groundHeight);
    if (snakeRef.current && snakeRef.current.filter((v) => v[0] == x && v[1] == y).length > 0) {
      generateFood();
    } else {
      setFood([x, y]);
    }
  };

  // click events
  const clickArrow = useCallback(
    (type) => {
      if (!gameOverRef.current && isActiveRef.current) {
        if (type == 1) setDirection((old) => (old != 2 ? type : old));
        else if (type == 2) setDirection((old) => (old != 1 ? type : old));
        else if (type == 3) setDirection((old) => (old != 4 ? type : old));
        else if (type == 4) setDirection((old) => (old != 3 ? type : old));
      }
    },
    [setDirection]
  );

  // Key events
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key.startsWith("Arrow") && isActiveRef.current) {
        e.preventDefault();
        if (e.key == "ArrowUp") {
          clickArrow(1);
        } else if (e.key == "ArrowDown") {
          clickArrow(2);
        } else if (e.key == "ArrowLeft") {
          clickArrow(3);
        } else if (e.key == "ArrowRight") {
          clickArrow(4);
        }
      }
      if (e.key == " ") {
        e.preventDefault();
        setActive(!isActiveRef.current);
      }
    },
    [clickArrow]
  );

  const handleSwipe = useCallback(
    ({ key }) => {
      if (key == "ArrowUp") {
        clickArrow(1);
      } else if (key == "ArrowDown") {
        clickArrow(2);
      } else if (key == "ArrowLeft") {
        clickArrow(3);
      } else if (key == "ArrowRight") {
        clickArrow(4);
      }
    },
    [clickArrow]
  );

  const reset = () => {
    setGameOver(false);
    setScore(0);
    setSnake([
      [Math.floor(groundWidth / 2), Math.floor(groundHeight / 2)],
      [Math.floor(groundWidth / 2), Math.floor(groundHeight / 2) + 1],
    ]);
    setDirection(4);
    generateFood();
  };

  useFaviconTheme();

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sky-300 to-green-300 relative">
        {/* Grass Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-green-600 to-green-800 opacity-90">
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(76, 175, 80, 0.1) 2px, rgba(76, 175, 80, 0.1) 4px), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(76, 175, 80, 0.1) 2px, rgba(76, 175, 80, 0.1) 4px)`,
            }}
          />
        </div>
        <h1
          className="animate-bounce text-6xl font-bold text-green-800 my-8 text-center"
          style={{
            textShadow: "3px 3px 0 #fef08a, 5px 5px 10px rgba(0,0,0,0.3)",
            animationDuration: "2s",
          }}
        >
          🐍 Snake 🐍
        </h1>

        <div className="bg-white/30 backdrop-blur-md p-4 m-4 rounded-3xl shadow-2xl">
          {/* Score */}
          <div className="flex justify-between my-2">
            <div className="fs-2xl border-2 rounded-xl px-4 py-2 mx-1 bg-green-200 text-green border-green">
              Score: {score}
            </div>
            <div className="fs-2xl border-2 rounded-xl px-4 py-2 mx-1 bg-green-200 text-green border-green">
              Best: {bestScore}
            </div>
          </div>

          {/* Game Board */}
          <div className="flex justify-center place-items-center flex-col sm:flex-row">
            <div className="relative text-center m-2">
              <MobileSwiper isActive={isActive} onSwipe={handleSwipe}>
                <div
                  className={`bg-radial from-green-200 to-green-300 border-8 border-green-800 ${
                    gameOver &&
                    "before:z-10 before:bg-[rgba(0,0,0,0.5)] before:absolute before:inset-0"
                  }`}
                >
                  {ground.map((row, x) => (
                    <div key={x} className="flex h-[10px]">
                      {row.map((col, y) => (
                        <span
                          key={y}
                          className={`h-[10px] w-[10px] inline-block ${
                            snake.filter((v) => v[0] == x && v[1] == y).length > 0
                              ? snake[snake.length - 1][0] == x && snake[snake.length - 1][1] == y
                                ? "bg-green-800 rounded-sm border-1 border-green"
                                : "bg-green-500"
                              : ""
                          } ${
                            food[0] == x && food[1] == y
                              ? "bg-gradient-to-b from-red-500 to-red-800 rounded-full shadow-lg"
                              : ""
                          }`}
                        ></span>
                      ))}
                    </div>
                  ))}
                </div>
              </MobileSwiper>

              {gameOver ? (
                <div className="absolute top-[50%] left-[50%] translate-[-50%] z-10 popup">
                  <p className="text-2xl font-bold text-white capitalize text-center mt-2 mb-4">
                    Game Over
                  </p>
                  <Button handleClick={reset} className="relative">
                    Play Again!
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between w-50 sm:w-30 flex-row sm:flex-col">
              {!gameOver ? (
                <>
                  <div className="relative w-28 h-28 m-2">
                    <Button
                      handleClick={() => clickArrow(1)}
                      className="absolute top-0 left-[50%] translate-x-[-50%] translate-y-0"
                    >
                      <UpArrow />
                    </Button>
                    <Button
                      handleClick={() => clickArrow(2)}
                      className="absolute bottom-0 left-[50%]  translate-x-[-50%] translate-y-0"
                    >
                      <DownArrow />
                    </Button>
                    <Button
                      handleClick={() => clickArrow(3)}
                      className="absolute left-0 top-[50%] translate-x-0 translate-y-[-50%]"
                    >
                      <LeftArrow />
                    </Button>
                    <Button
                      handleClick={() => clickArrow(4)}
                      className="absolute right-0 top-[50%] translate-x-0 translate-y-[-50%]"
                    >
                      <RightArrow />
                    </Button>
                  </div>
                  <div className=" w-16 sm:w-30 flex flex-col sm:flex-row justify-center items-center m-2">
                    <Button handleClick={() => setActive(!isActive)} className="relative m-1">
                      {isActive ? <Pause /> : <Play />}
                    </Button>
                    <Button handleClick={reset} className="relative m-1">
                      <Restart />
                    </Button>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="bg-green-200 text-green-900 border-2 border-green-900 rounded-md p-2 mt-3">
            <p className="font-bold text-2xl">How to Play</p>
            <ul className="text-sm list-disc my-1 pl-8">
              <li>
                Press the <strong>play</strong> button (or hit the <strong>Spacebar</strong>) to
                start the game.
              </li>
              <li>
                Use the <strong>Arrow keys</strong> (or <strong>Swipe</strong>) to control the
                snake's direction.
              </li>
              <li>
                <strong>Eat the food</strong> to grow longer.
              </li>
              <li>
                <strong>Avoid crashing</strong> into the walls or yourself - doing so will end the
                game!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
