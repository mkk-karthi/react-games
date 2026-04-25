export const Bird = ({
  className,
  birdX,
  birdY,
  tilt,
}: {
  birdX: number;
  birdY: number;
  tilt: number;
  className?: string;
}) => {
  return (
    <div
      className={`${className} relative border border-black rounded-full w-[36px] h-[30px]`}
      style={{
        background: "linear-gradient(#fcc800 60%, #ff8904 60%)",
        transform: `translate(${Math.floor(birdX - 17)}px, ${Math.floor(birdY - 13)}px) rotate(${tilt}deg)`,
        willChange: "transform",
      }}
    >
      <div className="absolute border border-black rounded-full w-[50%] h-[50%] right-0 top-0 rotate-45 bg-white">
        <div className="absolute bg-black rounded-full w-[30%] h-[30%] right-[20%] top-[20%] rotate-45"></div>
      </div>
      <div className="absolute border border-black rounded-full rounded-ss-none w-[50%] h-[40%] -left-[10%] top-[50%] bg-yellow-200 animate-flying"></div>

      <div className="absolute border border-black rounded-full rounded-es-none w-[50%] h-[20%] -right-[20%] top-[55%] bg-red-600"></div>
      <div className="absolute border border-black rounded-full rounded-ss-none w-[40%] h-[20%] -right-[10%] top-[70%] bg-red-600"></div>
    </div>
  );
};
