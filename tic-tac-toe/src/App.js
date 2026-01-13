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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const winner = checkWinner([...boardData]);
    if (winner !== null) {
      setTimeout(() => {
        setWinner(winner);
        setGameOver(true);
      }, 500);
    } else if (mode !== 2 && tern === 1) {
      computerMove();
    }
  }, [tern]);

  useEffect(() => {
    restart();
  }, [mode]);

  const removeHistory = (tempHistory) => {
    let last = tempHistory.shift();
    setHistory(tempHistory);

    let tempData = [...boardData];
    tempData[last.x][last.y] = null;
    setBoardData(tempData);
    setTimeout(() => {
      if (tempHistory.length >= 6) {
        removeHistory(tempHistory);
      }
    }, 100);
  };

  const handleClick = (x, y) => {
    if (((mode !== 2 && tern === 0) || mode === 2) && !gameOver) {
      makeMove(x, y);
    }
  };

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const computerMove = () => {
    const board = structuredClone(boardData);

    if (mode === 1) {
      // Try to win
      let player = tern;
      for (let x in boardData) {
        for (let y in boardData[x]) {
          const boardCopy = structuredClone(board);
          if (boardCopy[x][y] === null) {
            boardCopy[x][y] = player;

            if (checkWinner(boardCopy) === player) {
              setTimeout(() => makeMove(x, y), 300);
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
              setTimeout(() => makeMove(x, y), 300);
              return;
            }
          }
        }
      }
    }

    // Take center
    let center = Math.floor(noRows / 2);
    if (board[center][center] === null) {
      setTimeout(() => makeMove(center, center), 300);
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
        setTimeout(() => makeMove(x, y), 300);
        return;
      }
    }

    // Take sides
    for (let x in board) {
      for (let y in board[x]) {
        if (board[x][y] === null) {
          setTimeout(() => makeMove(x, y), 300);
          return;
        }
      }
    }
  };

  const makeMove = (x, y) => {
    const newBoard = [...boardData];
    if (newBoard[x][y] === null) {
      let tempHistory = [...history];
      tempHistory.push({ x, y, tern });
      setHistory(tempHistory);

      newBoard[x][y] = tern;
      setBoardData(newBoard);
      setTern(tern ? 0 : 1);

      if (tempHistory.length >= 6) {
        removeHistory([...tempHistory]);
      }
    }
  };

  const checkWinner = (board) => {
    let winningPatterns = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[0, 0], [0, 1], [0, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    if (board.length > 0) {
      let players = [0, 1];
      for (let player of players) {
        for (let val of winningPatterns) {
          let status = true;
          for (let [x, y] of val) {
            status = status && board[x][y] === player;
          }
          if (status) return player;
        }
      }
      if (board.every((row) => row.every((col) => col !== null))) return 2;
    }
    return null;
  };

  const restart = () => {
    setWinner(null);
    setGameOver(false);
    setBoardData(initialData);
    setTern(0);
    setHistory([]);
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
          <select value={mode} onChange={(e) => setMode(parseInt(e.target.value))}>
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
        <div className="tips">
          <p>How to Play</p>
          <ul>
            <li>2 players - one is X, the other is O.</li>
            <li>Players take turns to place one mark (X or O) in an empty box.</li>
            <li>
              First to make a straight line of 3 marks (horizontal, vertical, or diagonal) wins.
            </li>
            <li>If all 9 boxes are filled and no one has 3 in a row, it's a draw (nobody wins).</li>
          </ul>
        </div>
      </div>
      {gameOver && (
        <>
          {winner !== 2 && (mode === 2 || (mode !== 2 && winner === 0)) && (
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
