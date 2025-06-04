import React from "react";

interface BasicButtonProps {
  onClick: () => void;
  title: string;
  color?: string;
  isDisabled?: boolean;
}

const colorClasses: Record<string, string> = {
  red: "bg-red-600 hover:bg-red-700",
  green: "bg-green-600 hover:bg-green-700",
  blue: "bg-blue-600 hover:bg-blue-700",
};

export const BasicButton: React.FC<BasicButtonProps> = ({
  onClick,
  title,
  color = "blue",
}) => {
  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-3 text-white rounded-md text-sm transition-colors ${classes}`}
    >
      {title}
    </button>
  );
};
