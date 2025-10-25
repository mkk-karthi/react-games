import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Tiles from "./components/Tiles";
import MobileSwiper from "./components/MobileSwiper";

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
  const [tiles, setTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem(StoreKey) || 0);
  let uuid = useRef(0);

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
    setTiles([]);
    setScore(0);
    setTimeout(() => {
      createNewTile();
    }, 10);
  };

  useEffect(() => {
    // let i = 1;
    // let initData = initialData.map((r) =>
    //   r.map((c) => {
    //     i *= 2;
    //     return {
    //       ...c,
    //       value: i,
    //     };
    //   })
    // );
    // setBoardData(initData);
    // const newTiles = [];
    // initData.flat().forEach((cell) => {
    //   const x = cell.id % noRows;
    //   const y = Math.floor(cell.id / noRows);

    //   uuid.current++;
    //   newTiles.push({
    //     uid: uuid.current,
    //     id: cell.id,
    //     value: cell.value,
    //     x,
    //     y,
    //   });
    // });
    // setTiles(newTiles);

    createNewTile();
    document.body.addEventListener("keydown", handleKeyDown);

    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, []);

  const createNewTile = () => {
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
              };
            }
            return val;
          })
        );
        return newdata;
      });

      setTiles((prevTiles) => {
        if (!prevTiles.find((v) => v.id == id)) {
          uuid.current++;
          prevTiles.push({
            uid: uuid.current,
            id,
            value: 2,
            x: id % noRows,
            y: Math.floor(id / noRows),
            isNew: true,
            isMerged: false,
          });
        }
        return prevTiles;
      });
    } else {
      setGameOver(true);
    }
  };

  const updateTiles = (isReverse, isVertical) => {
    const { data, currentScore, isMoved } = moveTiles(isReverse, isVertical);

    if (isMoved) {
      setBoardData(data);
      setScore((oldScore) => oldScore + currentScore);
      setTiles((prevTiles) => {
        // Map old positions
        const oldMap = {};
        prevTiles.forEach((t) => {
          oldMap[t.id] = t;
        });

        const newTiles = [];
        data.flat().forEach((cell) => {
          if (!cell.value) return;

          const old = oldMap[cell.oldId];
          const x = cell.id % noRows;
          const y = Math.floor(cell.id / noRows);

          newTiles.push({
            uid: old.uid,
            id: cell.id,
            value: cell.value,
            x,
            y,
            isNew: false,
            isMerged: !!cell.merged,
          });

          if (cell.merged) {
            const merged = oldMap[cell.merged.id];
            newTiles.push({
              ...merged,
              id: cell.id,
              x,
              y,
              isNew: false,
              isMerged: false,
            });
          }
        });
        newTiles.sort((a, b) => a.uid - b.uid);
        return newTiles;
      });

      setTimeout(() => {
        createNewTile();
        setTimeout(() => {
          checkGameOver();
        }, 10);
      }, 300);
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
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
        updateTiles(isReverse, isVertical);
      }
    },
    [updateTiles]
  );

  const handleSwipe = useCallback(
    ({ key }) => {
      let isReverse = false;
      let isVertical = false;
      if (key == "ArrowUp") {
        isReverse = false;
        isVertical = true;
      } else if (key == "ArrowDown") {
        isReverse = true;
        isVertical = true;
      } else if (key == "ArrowLeft") {
        isReverse = false;
        isVertical = false;
      } else if (key == "ArrowRight") {
        isReverse = true;
        isVertical = false;
      }
      updateTiles(isReverse, isVertical);
    },
    [updateTiles]
  );

  const checkGameOver = () => {
    if (boardDataRef.current.flat().filter((v) => !v.value).length <= 2) {
      let isGameOver = true;
      for (let i of [0, 1]) {
        for (let j of [0, 1]) {
          const { ismoved } = moveTiles(i, j);
          isGameOver = isGameOver && !ismoved;
        }
      }
      setGameOver(isGameOver);
    }
  };

  const moveTiles = (isReverse, isVertical) => {
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
        arr[n].merged = null;
        if (arr[next] && arr[next].value && arr[n].value == arr[next].value) {
          arr[n].merged = JSON.parse(JSON.stringify(arr[next]));
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
          oldId: v.id,
          id,
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

  useEffect(() => {
    console.log("tiles", tiles, boardData);
  }, [tiles]);

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `repeating-radial-gradient(circle, var(--color-yellow-700), var(--color-amber-800) 30px, var(--color-yellow-700) 40px)`,
        }}
      >
        {/* Main Container */}
        <div className="relative z-10 max-w-2xl w-full">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1
              className="text-8xl font-black text-amber-100 my-4 animate-bounce"
              style={{
                textShadow: "4px 4px 0 rgba(120, 53, 15, 0.8), 8px 8px 16px rgba(0,0,0,0.6)",
                animationDuration: "2s",
              }}
            >
              2048
            </h1>
          </div>

          {/* Game Info Bar */}
          <div className="flex justify-around items-center">
            {/* Score Display */}
            <div className="flex gap-3">
              <div className="min-w-26 bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl p-2 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,200,100,0.3)] border-2 border-amber-700 text-center">
                <div className="text-yellow-200 text-xs font-bold uppercase">Score</div>
                <div className="text-yellow-100 text-xl font-black">{score}</div>
              </div>
              <div className="min-w-26 bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl p-2 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,200,100,0.3)] border-2 border-amber-700 text-center">
                <div className="text-yellow-200 text-xs font-bold uppercase">Best</div>
                <div className="text-yellow-100 text-xl font-black">{bestScore}</div>
              </div>
            </div>

            {/* New Game Button */}
            <button
              className="bg-gradient-to-br from-amber-800 to-amber-900 text-white font-black py-2 px-4 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transform hover:shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-200 border-2 border-amber-700"
              onClick={() => !gameOver && restart()}
            >
              New Game
            </button>
          </div>

          {/* Game Board Container */}
          <MobileSwiper onSwipe={handleSwipe}>
            <div className="flex justify-center relative my-6">
              <div className="relative bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_4px_8px_rgba(101,67,33,0.8),inset_0_-4px_8px_rgba(255,200,100,0.2)] border-4 border-amber-800 p-2">
                {/* Grid Background - Carved wood effect */}
                <div className="grid grid-cols-4 z-1">
                  {Array.from({ length: noRows * noRows }).map((_, i) => (
                    <div
                      key={i}
                      className="size-18 sm:size-20 m-1.5 bg-gradient-to-br from-amber-900 to-amber-950 rounded-xl shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(255,200,100,0.1)] border-amber-950"
                    />
                  ))}
                </div>

                <div className="absolute -inset-1">
                  <div className="grid grid-cols-4 gap-3">
                    {tiles.map((tile) => (
                      <Tiles tile={tile} key={tile.uid} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MobileSwiper>

          {/* Controls Info */}
          <div className="py-4 text-center">
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl px-8 py-4 inline-block shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,200,100,0.3)] border-2 border-amber-700 text-center">
              <p className="text-yellow-100 font-bold mb-2 text-lg">🎯 How to Play</p>
              <p className="text-yellow-200 text-sm">
                Use arrow keys ← ↑ → ↓ to slide wooden tiles
              </p>
              <p className="text-yellow-200 text-sm">Match tiles to create bigger numbers!</p>
            </div>
          </div>
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 popup">
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-amber-600 transform scale-100">
              <h2 className="text-5xl font-black text-yellow-100 mb-4 drop-shadow-2xl">
                Game Over! 💀
              </h2>
              <p className="text-2xl text-yellow-200 mb-6">
                Score: <span className="font-black text-orange-400">{score}</span>
              </p>
              <button
                className="bg-gradient-to-br from-amber-600 to-amber-700 text-white font-black text-xl py-4 px-6 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transform hover:shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-200 border-2 border-amber-700"
                onClick={restart}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
