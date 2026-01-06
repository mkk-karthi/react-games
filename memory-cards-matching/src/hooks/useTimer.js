import { useRef, useState } from "react";

const useTimer = () => {
  const [timer, setTime] = useState("00:00:00");
  const interval = useRef(null);

  const setTimer = () => {
    const curTime = Date.now();
    const curInterval = setInterval(() => getTime(curTime), 1000);
    interval.current = curInterval;
  };

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

  const clearTimer = () => {
    if (interval && interval.current) clearInterval(interval.current);
  };

  const resetTimer = () => {
    setTime("00:00:00");

    clearTimer();
    setTimer();
  };

  return [ timer, setTimer, clearTimer, resetTimer ];
};

export default useTimer;
