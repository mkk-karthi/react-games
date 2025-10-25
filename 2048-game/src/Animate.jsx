import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const noRows = 4;
  const StoreKey = "1024.score";
  const initialData = [...Array(noRows).keys()].map((v) =>
    [...Array(noRows).keys()].map((v1) => {
      return {
        id: noRows * v + v1,
        value: null,
      };
    })
  );
  const [boardData, setBoardData] = useState(initialData);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem(StoreKey) || 0);

  const boardDataRef = useRef(boardData);
  useEffect(() => {
    boardDataRef.current = boardData;
  }, [boardData]);

  useEffect(() => {
    if (localStorage.getItem(StoreKey) < score) {
      localStorage.setItem(StoreKey, score);
      setBestScore(score);
    }
  }, [score]);

  const restart = () => {
    setGameOver(false);
    setBoardData(initialData);
    setScore(0);
    setTimeout(() => {
      createNewCell();
    }, 10);
  };

  useEffect(() => {
    // let i = 1;
    // setBoardData(
    //   initialData.map((r) =>
    //     r.map((c) => {
    //       i *= 2;
    //       return {
    //         ...c,
    //         value: i,
    //       };
    //     })
    //   )
    // );

    createNewCell();
    document.body.addEventListener("keydown", handleKeyDown);

    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, []);

  const createNewCell = () => {
    let ids = boardDataRef.current
      .flat()
      .filter((v) => !v.value)
      .map((v) => v.id);

    if (ids.length > 0) {
      let id = ids[Math.floor(Math.random() * ids.length)];

      setBoardData((data) => {
        let newdata = data.map((row) =>
          row.map((val) => {
            if (val.id == id) {
              return {
                ...val,
                value: 2,
                isNew: true,
              };
            }
            return val;
          })
        );
        return newdata;
      });
    } else {
      setGameOver(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      let isReverse = false;
      let isVertical = false;

      if (e.key == "ArrowUp") {
        isReverse = false;
        isVertical = true;
      } else if (e.key == "ArrowDown") {
        isReverse = true;
        isVertical = true;
      } else if (e.key == "ArrowLeft") {
        isReverse = false;
        isVertical = false;
      } else if (e.key == "ArrowRight") {
        isReverse = true;
        isVertical = false;
      }
      const { data, currentScore, isMoved } = rearangeData(isReverse, isVertical);

      if (isMoved) {
        setBoardData(data);
        setScore((oldScore) => oldScore + currentScore);

        setTimeout(() => {
          createNewCell();
          setTimeout(() => {
            checkGameOver();
          }, 10);
        }, 300);
      }
    }
  };

  const checkGameOver = () => {
    if (boardDataRef.current.flat().filter((v) => !v.value).length <= 2) {
      let isGameOver = true;
      for (let i of [0, 1]) {
        for (let j of [0, 1]) {
          const { ismoved } = rearangeData(i, j);
          isGameOver = isGameOver && !ismoved;
        }
      }
      setGameOver(isGameOver);
    }
  };

  const rearangeData = (isReverse, isVertical) => {
    let newArr = [];
    let data = JSON.parse(JSON.stringify(boardDataRef.current));

    const sortArr = (value) => {
      value.sort((a, b) => {
        if (!a.value && !b.value) return 0;
        else if (!a.value) return 1;
        else if (!b.value) return -1;
        else return 0;
      });

      return value;
    };

    if (isVertical) {
      data = data[0].map((_, i) => data.map((row) => row[i]));
    }

    let currentScore = 0;
    let isMoved;
    for (let i in data) {
      let arr = data[i];

      if (isReverse) arr.reverse();

      arr = sortArr(arr);

      for (let n in arr) {
        let next = parseInt(n) + 1;
        arr[n].isMerged = false;
        if (arr[next] && arr[next].value && arr[n].value == arr[next].value) {
          arr[n].isMerged = true;
          arr[n].value = parseInt(arr[n].value) + parseInt(arr[next].value) || null;
          arr[next].value = null;
          currentScore += arr[n].value;
        }
      }

      arr = sortArr(arr);
      if (isReverse) arr.reverse();

      arr = arr.map((v, n) => {
        let id = isVertical
          ? data.length * parseInt(n) + parseInt(i)
          : arr.length * parseInt(i) + parseInt(n);

        isMoved = isMoved || id != v.id;
        return {
          ...v,
          id,
          isNew: false,
        };
      });

      if (isReverse) arr.reverse();
      arr = sortArr(arr);
      if (isReverse) arr.reverse();

      newArr.push(arr);
      data[i] = arr;
    }

    if (isVertical) {
      newArr = newArr[0].map((_, i) => newArr.map((row) => row[i]));
    }
    return { currentScore, isMoved: isMoved || currentScore > 0, data: newArr };
  };

  const getTileBg = (val) => {
    let colors = ["sky", "yellow", "orange", "green"];
    let index = Math.log2(val) - 1;
    let i = Math.floor(index / 4);
    let j = index % 4;
    return `bg-${colors[j]}-${(i + 1) * 100}`;
  };

  return (
    <>
      <div className="p-2 min-h-screen flex place-items-center flex-col bg-stone-300">
        <p className="text-3xl font-bold text-stone-800 capitalize text-center mb-3 p-2 border border-stone-900 rounded bg-stone-50  w-100 sm:w-106">
          2048 Game
        </p>
        <div>
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="min-w-26 bg-stone-400 rounded text-center p-2 mx-2">
                <p className="text-md font-bold text-stone-600">Score</p>
                <p className="text-2xl font-bold text-stone-800">{score}</p>
              </div>
              <div className="min-w-26 bg-stone-400 rounded text-center p-2 mx-2">
                <p className="text-md font-bold text-stone-600">Best</p>
                <p className="text-2xl font-bold text-stone-800">{bestScore}</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => !gameOver && restart()}
                className="bg-stone-600 rounded text-center px-4 py-2 text-lg font-bold text-stone-100 cursor-pointer hover:bg-stone-500"
              >
                reset
              </button>
            </div>
          </div>

          <div className="flex my-3 relative justify-center">
            <div
              className={`grid gap-4 p-3 bg-stone-600 rounded-lg shadow-lg shadow-stone-800`}
              style={{ gridTemplateColumns: `repeat(${initialData.length}, minmax(0, 1fr))` }}
            >
              {boardData.map((row, x) =>
                row.map((col, y) => (
                  <div
                    className={`size-20 rounded-xl text-center font-bold text-stone-900 ${
                      col.value ? getTileBg(col.value) : "bg-stone-200"
                    } ${
                      col.value > 10000
                        ? "text-xl/20"
                        : col.value > 1000
                        ? "text-2xl/20"
                        : "text-3xl/20"
                    } ${col.isNew && "animate-pop"} ${col.isMerged && "animate-merge"}`}
                    key={col.id}
                  >
                    {col.value}
                  </div>
                ))
              )}
            </div>

            {gameOver ? (
              <div className="absolute size-[100%] popup bg-stone-900/60 rounded-lg flex flex-col justify-center items-center">
                <p className="text-3xl font-bold text-white capitalize text-center mt-2 mb-4 text-shadow-[0_0_15px] text-shadow-stone-800">
                  Game Over
                </p>
                <button
                  className="bg-stone-400 rounded text-center px-4 py-2 text-lg font-bold text-stone-900 cursor-pointer hover:bg-stone-200 shadow-[0_0_15px] shadow-stone-800 active:shadow-none"
                  onClick={restart}
                >
                  Play Again!
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mt-4 p-2 border border-stone-900 rounded bg-stone-50 w-100 sm:w-106 text-stone-800">
            <b>How to play:</b> Use your <b>arrow keys</b> to move the tiles. When two tiles with
            the same number touch, they merge into one!
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
