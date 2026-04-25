export const Tree = ({ className }: { className?: string }) => {
  return (
    <div
      className={className + " w-[50px] h-[50px] relative"}
      style={{ background: "linear-gradient(transparent 50%, #7bf1a8 50%)" }}
    >
      <div className="w-[50%] h-[50%] bg-green-300 rounded-full border-t-2 border-r-2 border-green-500 -rotate-45 absolute top-0 left-[25%]"></div>
      <div className="w-[50%] h-[50%] bg-green-300 rounded-full border-t-2 border-r-2 border-green-500 -rotate-45 absolute left-0 top-[25%]"></div>
      <div className="w-[50%] h-[50%] bg-green-300 rounded-full border-t-2 border-r-2 border-green-500 -rotate-45 absolute right-0 top-[25%]"></div>
      <div className="w-[50%] h-[50%] bg-green-300 rounded-full border-t-2 border-r-2 border-green-500 -rotate-45 absolute left-[25%] bottom-0"></div>
    </div>
  );
};
