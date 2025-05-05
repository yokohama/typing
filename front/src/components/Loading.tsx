import React from "react";

type LoadingProps = {
  size?: "small" | "medium" | "large";
  color?: string;
};

export default function Loading({
  size = "medium",
  color = "#6366F1"
}: LoadingProps) {
  // サイズに基づいてwidthとheightを設定
  const dimensions = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16"
  };

  // ボーダーの幅をサイズに合わせて調整
  const borderWidth = {
    small: "border-2",
    medium: "border-4",
    large: "border-4"
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className={`
          ${dimensions[size]}
          ${borderWidth[size]}
          border-gray-200
          border-t-indigo-500
          rounded-full
          animate-spin
        `}
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
}
