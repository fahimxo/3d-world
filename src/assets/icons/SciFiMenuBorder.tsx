import React from "react";

interface SciFiMenuBorderProps {
  children?: React.ReactNode;
  className?: string;
}

export const SciFiMenuBorder: React.FC<SciFiMenuBorderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`relative inline-block ${className || ""}`}>
      <svg
        width="142"
        height="125"
        viewBox="0 0 142 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block pointer-events-none"
      >
        <g filter="url(#filter0_i_80_820)">
          <path
            d="M141 1.25598H135.5L132.167 5.59987H118.5L116.5 2.70395H107L105 5.59987H60.3485H3.5L0.5 9.46111V55.4057L3.5 57.6662V75.615L0.5 78.1791V124.333H77.904L81.5 121.769H90.5L93.8636 124.333H137L141 118.692V42.7944V36.1278V27.802V23.0798V1.25598Z"
            fill="#010826"
          />
        </g>
        <path
          d="M141 1.25598H135.5L132.167 5.59987H118.5L116.5 2.70395H107L105 5.59987H60.3485H3.5L0.5 9.46111V55.4057L3.5 57.6662V75.615L0.5 78.1791V124.333H77.904L81.5 121.769H90.5L93.8636 124.333H137L141 118.692V42.7944V36.1278V27.802V23.0798V1.25598Z"
          stroke="#00C9FF"
        />
        <defs>
          <filter
            id="filter0_i_80_820"
            x="0"
            y="0.755981"
            width="141.5"
            height="124.077"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0.788235 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_80_820"
            />
          </filter>
        </defs>
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
