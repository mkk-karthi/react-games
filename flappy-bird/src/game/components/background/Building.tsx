export const Building = ({ className }: { className?: string }) => {
  return (
    <div className={className + " flex items-end"}>
      <div
        className="w-[16px] h-[60px] bg-green-200 border border-sky-300 left-[20px] bottom-[20px]"
        style={{
          background:
            "linear-gradient(0deg, #b9f8cf 50%, transparent 25%),linear-gradient(90deg, transparent 25%, #b8e6fe 25%, #b8e6fe 75%, transparent 75%)",
          backgroundSize: "4px 8px",
          backgroundColor: "#b9f8cf",
        }}
      ></div>
      <div
        className="w-[20px] h-[80px] bg-green-200 border border-sky-300 left-[20px] bottom-[20px]"
        style={{
          background:
            "linear-gradient(0deg, #b9f8cf 50%, transparent 25%),linear-gradient(90deg, transparent 25%, #b8e6fe 25%, #b8e6fe 75%, transparent 75%)",
          backgroundSize: "5px 10px",
          backgroundColor: "#b9f8cf",
        }}
      ></div>
      <div
        className="w-[16px] h-[50px] bg-green-200 border border-sky-300 left-[20px] bottom-[20px]"
        style={{
          background:
            "linear-gradient(0deg, #b9f8cf 50%, transparent 25%),linear-gradient(90deg, transparent 25%, #b8e6fe 25%, #b8e6fe 75%, transparent 75%)",
          backgroundSize: "4px 8px",
          backgroundColor: "#b9f8cf",
        }}
      ></div>
    </div>
  );
};
