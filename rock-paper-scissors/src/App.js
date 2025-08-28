import Card from "./components/Card";
import Button from "./components/Button";
import { useEffect, useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import Match from "./components/Match";
import "./App.css";
import { ReactComponent as Rock } from "./assets/rock.svg";
import { ReactComponent as Paper } from "./assets/paper.svg";
import { ReactComponent as Scissor } from "./assets/scissor.svg";

function App() {
  // 1-Rock, 2-Paper, 3-Scissor
  const initTeam = {
    score: 0,
    picked: 0,
  };
  const [round, setRound] = useState(1);
  const [teamA, setTeamA] = useState(initTeam);
  const [teamB, setTeamB] = useState(initTeam);
  const [lastWinner, setLastWinner] = useState(0);
  const [winner, setWinner] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const maxScore = 3;

  useEffect(() => {
    if (teamA.score == maxScore || teamB.score == maxScore) {
      setLastWinner(teamA.score == maxScore ? 1 : 2);
      setGameOver(true);
    }
  }, [teamA, teamB]);

  const checkWinner = (a, b) => {
    if (a && b) {
      if ((a == 1 && b == 3) || (a == 2 && b == 1) || (a == 3 && b == 2)) {
        return 1;
      } else if (a == b) {
        return 3;
      } else {
        return 2;
      }
    } else {
      return null;
    }
  };

  // 1-Rock, 2-Paper, 3-Scissor
  const options = [1, 2, 3];
  const handleClick = (pick) => {
    const randomIndex = Math.floor(Math.random() * options.length);
    let randomPick = options[randomIndex];

    // avoid continue draws
    if (randomPick == pick && teamA.picked == teamB.picked && teamA.picked > 0) {
      handleClick(pick);
      return;
    }

    const result = checkWinner(pick, randomPick);
    setWinner(result);

    let teamAScore = teamA.score;
    let teamBScore = teamB.score;
    if (result == 1) {
      teamAScore++;
    } else if (result == 2) {
      teamBScore++;
    }
    setTeamA({ ...teamA, picked: pick, score: teamAScore });
    setTeamB({ ...teamB, picked: randomPick, score: teamBScore });
    setRound(round + 1);
  };

  const reset = () => {
    setTeamA(initTeam);
    setTeamB(initTeam);
    setRound(1);
    setGameOver(false);
    setLastWinner(null);
    setWinner(null);
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
      <div className="p-4 h-screen flex justify-center place-items-center flex-col">
        <p className="text-3xl font-bold text-gray-900 dark:text-white capitalize text-center mb-2">
          Rock Paper Scissors
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white uppercase text-center mb-2">
          Round {round}
        </p>

        <div className="flex justify-evenly flex-col sm:flex-row">
          <Card text="Your score" score={teamA.score} />
          <Card text="Opponent score" score={teamB.score} />
        </div>
        <div className="h-20 sm:h-32 my-2 flex justify-evenly flex-row sm:flex-row">
          <div>
            {teamA.picked ? (
              <p className="text-gray-900 dark:text-white text-sm text-center">You</p>
            ) : (
              ""
            )}
            <Match type={teamA.picked} />
          </div>
          <div>
            {teamB.picked ? (
              <p className="text-gray-900 dark:text-white text-sm text-center">Opponent</p>
            ) : (
              ""
            )}
            <Match type={teamB.picked} />
          </div>
        </div>
        <div className="h-9 my-2">
          {winner ? (
            <p className="text-gray-900 dark:text-white text-3xl font-bold text-center capitalize">
              {winner == 1 ? "You win!" : winner == 2 ? "You lose!" : "Draw"}
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="flex justify-center">
          <Button clickHandle={() => handleClick(1)}>
            <Rock className="w-12 sm:w-16 h-auto fill-black dark:fill-white" />
          </Button>
          <Button clickHandle={() => handleClick(2)}>
            <Paper className="w-12 sm:w-16 h-auto stroke-black dark:stroke-white" />
          </Button>
          <Button clickHandle={() => handleClick(3)}>
            <Scissor className="w-12 sm:w-16 h-auto fill-black dark:fill-white" />
          </Button>
        </div>
        <p className="text-lg text-gray-900 dark:text-white text-center mt-3">Tack your pick</p>
      </div>

      {gameOver && (
        <>
          {lastWinner == 1 && (
            <div className="absolute inset-[0]">
              <div className="absolute inset-x-[50%] bottom-[10]">
                <ConfettiExplosion {...confettiProps} />
              </div>
            </div>
          )}
          <div className="fixed top-[0] left-[0] flex justify-center items-center w-screen h-screen overflow-hidden bg-[rgba(0,0,0,0.8)]">
            <div>
              <p className="text-white text-3xl font-bold capitalize text-center [text-shadow:0_0_15px_#0] my-5">
                {lastWinner == 1 ? "You win!" : lastWinner == 2 ? "You lose!" : "Draw"}
              </p>
              <button className="super-button" onClick={reset}>
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
