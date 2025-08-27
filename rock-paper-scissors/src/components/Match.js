import { ReactComponent as Rock } from "../assets/rock.svg";
import { ReactComponent as Paper } from "../assets/paper.svg";
import { ReactComponent as Scissor } from "../assets/scissor.svg";

function Match({ type }) {
  const MyIcon = () => {
    if (type == 1) return <Rock className="w-auto h-full fill-black dark:fill-white" />;
    else if (type == 2)
      return <Paper className="w-auto h-full stroke-black dark:stroke-white" />;
    else if (type == 3)
      return <Scissor className="w-auto h-full fill-black dark:fill-white" />;
    else return <></>;
  };

  return <MyIcon />;
}

export default Match;
