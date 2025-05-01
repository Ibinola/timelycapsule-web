"use client";

import cn from "classnames";

import React from "react";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  color?: string;
  gradient?: "t" | "tr" | "r" | "br" | "b" | "bl" | "l" | "tl";
  outline?: boolean;
  size?: keyof typeof sizeMapping;

  style?: React.CSSProperties; // ✨ Added this line
}

const sizeMapping = {
  sm: "h-[30px] px-[10px]",
  md: "h-[40px] px-[20px]",
  lg: "h-[50px] px-[58px]",
  xl: "h-[60px] px-[72px]",
};

export default function Button({
  label,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  color = "primary",
  outline = false,
  gradient,
  size = "md",
  style, // ✨ Add style here
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl font-semibold text-center transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-[40px]",

        "rounded-xl font-semibold text-center  transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] h-[40px] w-fit",

        sizeMapping[size] || sizeMapping["md"],
        { [`border border-${color}`]: outline || !gradient },
        {
          [generateBackgroundColorClassname()]: !outline,
          "text-white": !outline,
          "text-black": outline,
          "opacity-60 cursor-not-allowed": disabled,
          "cursor-pointer hover:opacity-95 active:scale-[0.98]": !disabled,
        },
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style} // ✨ Apply the style here
    >
      {label}
    </button>
  );

  function generateBackgroundColorClassname() {
    const parts: string[] = ["bg"];

    if (gradient) {
      parts.push(`gradient-to-${gradient}`);
    }

    parts.push(color);

    return parts.join("-");
  }
}
