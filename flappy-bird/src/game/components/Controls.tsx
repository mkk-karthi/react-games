import React from "react";
import { PixelBtn } from "./PixelBtn";
import Volume from "../../assets/volume-full.svg";
import Muted from "../../assets/volume-muted.svg";

interface ControlsProps {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  status: string;
  setStatus: (status: any) => void;
  persist: (next: any) => void;
}

export function Controls({ muted, setMuted, status, setStatus, persist }: ControlsProps) {
  return (
    <div className="absolute right-3 top-3 z-20 flex gap-2 sm:right-5 sm:top-5">
      <PixelBtn
        small
        onClick={() => {
          const next = !muted;
          setMuted(next);
          persist({ muted: next });
        }}
      >
        {muted ? (
          <img src={Muted} className="w-4 invert" alt="Muted" />
        ) : (
          <img src={Volume} className="w-4 invert" alt="Volume" />
        )}
      </PixelBtn>

      <PixelBtn
        small
        onClick={() => {
          if (status === "running") setStatus("paused");
          else if (status === "paused") setStatus("running");
        }}
      >
        {status === "paused" ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="#fff">
            <polygon points="2,1 13,7 2,13" />
          </svg>
        ) : (
          <div className="flex gap-[3px]">
            <div className="h-3 w-[3px] bg-white" />
            <div className="h-3 w-[3px] bg-white" />
          </div>
        )}
      </PixelBtn>
    </div>
  );
}
