"use client";

import React, { useState, SVGProps, CSSProperties } from "react";

export interface WarningIconProps extends SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  warningColor?: string;
  hoverColor?: string;
  strokeWidth?: number;
  className?: string;
}

const WarningIcon: React.FC<WarningIconProps> = ({
  width = 24,
  height = 24,
  warningColor = "#facc15", // warning yellow
  hoverColor,
  strokeWidth = 2,
  className = "",
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const color = isHovered && hoverColor ? hoverColor : warningColor;

  const commonStyle: CSSProperties = {
    transition: "all 0.25s ease-in-out",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      style={{ ...style, cursor: "pointer" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Triangle border */}
      <path
        d="M12 3L2 21h20L12 3z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        style={commonStyle}
      />

      {/* Exclamation mark */}
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={commonStyle}
      />
      <circle cx="12" cy="17" r="1.2" fill={color} style={commonStyle} />
    </svg>
  );
};

export default WarningIcon;
