import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import "./App.scss";
import "./Button.scss";

function App() {
  const noRows = 3;
  const modes = [
    {
      label: "Easy",
      value: 0,
    },
    {
      label: "Hard",
      value: 1,
    },
    {
      label: "Play With Friend",
      value: 2,
    },
  ];
  const initialData = [...Array(noRows).keys()].map(() => [...Array(noRows).fill(null)]);
  const [tern, setTern] = useState(0); // 0-user, 1-computer
  const [boardData, setBoardData] = useState(initialData); // 0-O, 1-X
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(0);

  useEffect(() => {
    const winner = checkWinner(boardData);
    if (winner !== null) {
      setTimeout(() => {
        setWinner(winner);
        setGameOver(true);
      }, 500);
    } else if (mode != 2 && tern === 1) {
      computerMove();
    }
  }, [boardData, tern]);

  useEffect(() => {
    setTern(0);
    setBoardData(initialData);
  }, [mode]);

  const handleClick = (x, y) => {
    if (((mode != 2 && tern === 0) || mode == 2) && !gameOver) {
      const newBoard = [...boardData];
      if (newBoard[x][y] === null) {
        newBoard[x][y] = tern;
        setBoardData(newBoard);
        setTern(tern ? 0 : 1);
      }
    }
  };

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const computerMove = () => {
    const board = structuredClone(boardData);

    if (mode == 1) {
      // Try to win
      let player = tern;
      for (let x in boardData) {
        for (let y in boardData[x]) {
          const boardCopy = structuredClone(board);
          if (boardCopy[x][y] === null) {
            boardCopy[x][y] = player;

            if (checkWinner(boardCopy) === player) {
              makeMove(x, y);
              return;
            }
          }
        }
      }

      // Block player win
      player = tern ? 0 : 1;
      for (let x in boardData) {
        for (let y in boardData[x]) {
          const boardCopy = structuredClone(board);

          if (boardCopy[x][y] === null) {
            boardCopy[x][y] = player;

            if (checkWinner(boardCopy) === player) {
              makeMove(x, y);
              return;
            }
          }
        }
      }
    }

    // Take center
    let center = Math.floor(noRows / 2);
    if (board[center][center] === null) {
      makeMove(center, center);
      return;
    }

    // Take a corner
    let corners = [
      [0, 0],
      [0, noRows - 1],
      [noRows - 1, 0],
      [noRows - 1, noRows - 1],
    ];
    for (let [x, y] of shuffle(corners)) {
      if (board[x][y] === null) {
        makeMove(x, y);
        return;
      }
    }

    // Take sides
    for (let x in board) {
      for (let y in board[x]) {
        if (board[x][y] === null) {
          makeMove(x, y);
          return;
        }
      }
    }
  };

  const makeMove = (x, y) => {
    const newBoard = [...boardData];
    if (newBoard[x][y] === null) {
      setTimeout(() => {
        newBoard[x][y] = tern;
        setBoardData(newBoard);
        setTern(tern ? 0 : 1);
      }, 300);
    }
  };

  const checkWinner = (board) => {
    let tempDatas = {};
    let datas = {};

    for (let x in board) {
      for (let y in board[x]) {
        let player = board[x][y] === 0 ? 0 : board[x][y] === 1 ? 1 : null;

        if (player !== null) {
          if (!datas[player]) datas[player] = [];
          datas[player].push([x, y]);

          if (!tempDatas[player]) {
            tempDatas[player] = { x: {}, y: {} };
          }
          tempDatas[player]["x"][x] = tempDatas[player]["x"][x] ? tempDatas[player]["x"][x] + 1 : 1;
          tempDatas[player]["y"][y] = tempDatas[player]["y"][y] ? tempDatas[player]["y"][y] + 1 : 1;

          if (tempDatas[player]["x"][x] === noRows || tempDatas[player]["y"][y] === noRows) {
            return player;
          } else {
            let diagonalX = Object.values(tempDatas[player]["x"]).length;
            let diagonalY = Object.values(tempDatas[player]["y"]).length;

            if (diagonalX === noRows && diagonalY === noRows) {
              if (
                datas[player].reduce((t, v) => (v[0] == t && v[1] == t ? t + 1 : t), 0) >= noRows
              ) {
                return player;
              } else if (
                datas[player].reduce(
                  (t, v) => (v[0] == noRows - t && v[1] == t - 1 ? t - 1 : t),
                  noRows
                ) === 0
              ) {
                return player;
              }
            }
          }
        }
      }
    }
    if (board.every((row) => row.every((col) => col !== null))) return 2;
    return null;
  };

  const restart = () => {
    setWinner(null);
    setGameOver(false);
    setBoardData(initialData);
    setTern(0);
  };

  const confettiProps = {
    force: 0.6,
    duration: 3000,
    particleCount: 180,
    floorheight: 1600,
    floorwidth: 1600,
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Tic Tac Toe</h1>
        <div>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {modes.map((item, key) => (
              <option value={item.value} key={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <table className="board">
            <tbody>
              {boardData.map((row, x) => (
                <tr key={x}>
                  {row.map((col, y) => (
                    <td key={y} onClick={() => handleClick(x, y)}>
                      <p>{col === 0 ? "O" : col === 1 ? "X" : ""}</p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button onClick={() => !gameOver && restart()}>reset</button>
        </div>
      </div>
      {gameOver && (
        <>
          {winner !== 2 && (mode == 2 || (mode != 2 && winner == 0)) && (
            <div className="confetti-container">
              <div className="confetti-source">
                <ConfettiExplosion {...confettiProps} />
              </div>
            </div>
          )}
          <div className="winner-container">
            <div>
              {winner !== null && (
                <p>{winner === 2 ? "Match Draw" : `${winner ? "X" : "O"} is winner!`}</p>
              )}
              <button className="super-button" onClick={restart}>
                Play Again
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
