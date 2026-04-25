import React from "react";

interface PixelBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "orange" | "green";
  small?: boolean;
}

export function PixelBtn({
  children,
  onClick,
  variant = "orange",
  small = false,
}: PixelBtnProps) {
  const base =
    "font-['Press_Start_2P'] cursor-pointer select-none border-2 border-white text-white text-xs flex items-center justify-center";

  const variantCls = variant === "green" ? "bg-green-500" : "bg-orange-500";

  const sizeCls = small ? "px-3 py-2" : "px-4 py-2";

  return (
    <button
      data-ui="true"
      onClick={onClick}
      className={`${base} ${variantCls} ${sizeCls}`}
      style={{ outline: `solid ${variant === "green" ? "#032e15" : "#441306"} 2px` }}
    >
      {children}
    </button>
  );
}
