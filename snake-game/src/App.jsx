import { useState, useEffect, useRef } from "react";
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

function App() {
  // set ground
  const groundWidth = 30;
  const groundHeight = 30;
  const ground = [...Array(groundHeight).keys()].map(() => [...Array(groundWidth)]);

  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState(4);
  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isActive, setActive] = useState(false);

  // state variable does not update as expected within a setInterval callback, So use useRef hook.
  const intervalRef = useRef(null);
  const directionRef = useRef(direction);
  const foodRef = useRef(food);
  const snakeRef = useRef(snake);
  const isActiverRef = useRef(isActive);
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
    isActiverRef.current = isActive;
  }, [isActive]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    generateFood();
    intervalRef.current = setInterval(moveSnake, 250);
    reset();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, []);

  const moveSnake = () => {
    if (!gameOverRef.current && isActiverRef.current == true) {
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
  const clickArrow = (type) => {
    if (!gameOverRef.current && isActiverRef.current == true) {
      if (type == 1) setDirection((old) => (old != 2 ? type : old));
      else if (type == 2) setDirection((old) => (old != 1 ? type : old));
      else if (type == 3) setDirection((old) => (old != 4 ? type : old));
      else if (type == 4) setDirection((old) => (old != 3 ? type : old));
    }
  };

  // Key events
  const handleKeyDown = (e) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      clickArrow(1);
    } else if (e.key == "ArrowDown") {
      e.preventDefault();
      clickArrow(2);
    } else if (e.key == "ArrowLeft") {
      e.preventDefault();
      clickArrow(3);
    } else if (e.key == "ArrowRight") {
      e.preventDefault();
      clickArrow(4);
    } else if (e.key == " ") {
      e.preventDefault();
      setActive(!isActiverRef.current);
    }
  };

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

  return (
    <>
      <div className="p-4 min-h-screen flex place-items-center flex-col bg-green-100">
        <p className="text-3xl font-bold text-green-900 capitalize text-center my-2">Snake Game</p>

        {/* Score */}
        <div className="flex justify-between my-2">
          <div className="fs-xl border-2 rounded-xl px-4 py-2 mx-1 text-green-900 border-green-900">
            Score: {score}
          </div>
        </div>

        {/* Board */}
        <div className="flex justify-center place-items-center flex-col sm:flex-row">
          <div className="relative text-center m-2">
            <div
              className={`bg-green-200 border-8 border-gray-800 ${
                gameOver && "before:z-10 before:bg-[rgba(0,0,0,0.5)] before:absolute before:inset-0"
              }`}
            >
              {ground.map((row, x) => (
                <div key={x} className="flex h-2">
                  {row.map((col, y) => (
                    <span
                      key={y}
                      className={`h-2 w-2 inline-block ${
                        snake.filter((v) => v[0] == x && v[1] == y).length > 0
                          ? snake[snake.length - 1][0] == x && snake[snake.length - 1][1] == y
                            ? "bg-green-800 rounded-xs"
                            : "bg-green-500"
                          : ""
                      } ${
                        food[0] == x && food[1] == y
                          ? "rounded-xl bg-gradient-to-b from-red-500 to-red-800"
                          : ""
                      }`}
                    ></span>
                  ))}
                </div>
              ))}
            </div>

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
          <div className="flex justify-between w-50">
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
                <div className=" w-16 flex flex-col justify-center items-center m-2">
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

        <div className="text-green-900 border-2 border-green-900 rounded-md p-2 mt-3">
          <p className="font-bold text-2xl">How to Play</p>
          <ul className="text-sm list-disc my-1 pl-8">
            <li>Use the arrow keys to move the snake.</li>
            <li>Eat the food to grow longer.</li>
            <li>Avoid hitting the walls or yourself - or the game ends!</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
