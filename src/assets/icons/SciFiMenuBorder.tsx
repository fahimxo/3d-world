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
        width="144"
        height="50"
        viewBox="0 0 144 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_i_288_3679)">
          <path
            d="M141 1H135.52L132.198 2.69412H118.58L116.587 1.56471H107.121L105.128 2.69412H60.6355H5L1 5.98113V22.1184L3.98932 23V30L1 31V49H78.1286L81.7117 48H90.6797L94.0314 49H137.014L141 44.9245V17.2V14.6V11.3529V9.51128V1Z"
            fill="#010826"
          />
        </g>
        <path
          d="M141 1H135.52L132.198 2.69412H118.58L116.587 1.56471H107.121L105.128 2.69412H60.6355H5L1 5.98113V22.1184L3.98932 23V30L1 31V49H78.1286L81.7117 48H90.6797L94.0314 49H137.014L141 44.9245V17.2V14.6V11.3529V9.51128V1Z"
          stroke="#00C9FF"
        />
        <line
          x1="143.3"
          y1="1"
          x2="143.3"
          y2="47"
          stroke="#00C9FF"
          stroke-width="0.6"
        />
        <path
          d="M94 49L90.5 46H81.5L78 49H94Z"
          fill="#00C9FF"
          stroke="#00C9FF"
        />
        <path
          d="M1 34L4 32.3333V20.6667L1 19V34Z"
          fill="#00C9FF"
          stroke="#00C9FF"
        />
        <defs>
          <filter
            id="filter0_i_288_3679"
            x="0.5"
            y="0.5"
            width="141"
            height="49"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
              result="effect1_innerShadow_288_3679"
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
