"use client";

import React, { useState, SVGProps, CSSProperties } from "react";

export interface BlockUserIconProps extends SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  userColor?: string;
  hoverColor?: string;
  strokeWidth?: string | number;
  className?: string;
}

const BlockUserIcon: React.FC<BlockUserIconProps> = ({
  width = 24,
  height = 24,
  userColor = "#6B7280",
  hoverColor,
  strokeWidth = "2",
  className = "",
  style = {},
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentColor = isHovered && hoverColor ? hoverColor : userColor;

  const mergedSvgStyle: CSSProperties = {
    ...style,
  };

  const mergedPathStyle: CSSProperties = {
    stroke: currentColor,
    transition: "stroke 3s ease-in-out",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      style={mergedSvgStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m3 3l18 18M14.828 9.172A4 4 0 0 1 16 12m1.657-5.657a8 8 0 0 1 1.635 8.952m-10.124-.467a4 4 0 0 1 0-5.656m-2.831 8.485a8 8 0 0 1 0-11.314"
        style={mergedPathStyle}
      />
    </svg>
  );
};

export default BlockUserIcon;