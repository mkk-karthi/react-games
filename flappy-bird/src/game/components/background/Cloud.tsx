export const Cloud = ({ className }: { className?: string }) => {
  return (
    <div
      className={className + " w-[100px] h-[100px] relative"}
      style={{ background: "linear-gradient(transparent 50%, var(--color-sky-100) 50%)" }}
    >
      <div className="w-[80px] h-[80px] bg-sky-100 rounded-full absolute -left-[10px] top-0"></div>
      <div className="w-[50px] h-[50px] bg-sky-100 rounded-full absolute right-0 top-[25px]"></div>
    </div>
  );
};
