import { useEffect } from "react";
import { useState } from "react";

function Tiles({ tile }) {
  const getPositions = (x, y) => {
    let space = 0.25;
    let padding = 3;
    let gab = 1.5;
    let boxSize = window.matchMedia("(min-width: 640px)").matches ? 20 : 18;
    let postionX = 0;
    let postionY = 0;

    if (typeof x === "number" && typeof y === "number") {
      postionX = boxSize * x + gab * (x * 2 + 1) + padding;
      postionY = boxSize * y + gab * (y * 2 + 1) + padding;
    }

    return { x: postionX * space, y: postionY * space };
  };
  const [curPos, setCurPos] = useState(getPositions(tile.x, tile.y));

  useEffect(() => {
    setCurPos(getPositions(tile.x, tile.y));
  }, [tile]);

  const getTileBg = (val) => {
    let colors = ["sky", "yellow", "orange", "green"];
    let index = Math.log2(val) - 1;
    let i = Math.floor(index / 4);
    let j = index % 4;
    return `bg-gradient-to-br from-${colors[j]}-${(i + 1) * 100} to-${colors[j]}-${(i + 2) * 100}`;
  };

  return (
    <div
      className={`absolute size-18 sm:size-20 ease-linear ${getTileBg(
        tile.value
      )} rounded-xl text-center z-1 text-3xl/20 font-black text-black ${
        tile.isNew && "animate-pop"
      } ${tile.isMerged ? "animate-merge z-2" : "z-1"} ${
        tile.value > 10000 ? "text-xl/20" : tile.value > 1000 ? "text-2xl/20" : "text-3xl/20"
      } shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] sm:shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)]`}
      id={`${tile.x}-${tile.y}`}
      style={{
        top: `${curPos.y}rem`,
        left: `${curPos.x}rem`,
        transitionDuration: "0.3s",
      }}
    >
      {tile.value}
    </div>
  );
}

export default Tiles;
