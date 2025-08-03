import React from "react";

interface FilterButtonProps {
  className?: string;
  onClick?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  className,
  onClick,
}) => (
  <svg
    width="52"
    height="41"
    viewBox="0 0 52 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : undefined }}
  >
    <g filter="url(#filter0_i_113_75)">
      <path
        d="M1 35.8148H15.3939L19.1818 41H38.8788L43.4242 35.8148H51V1H6.30303L1 6.18518V35.8148Z"
        fill="#00C9FF"
        fill-opacity="0.05"
      />
    </g>
    <path
      d="M1 34.9444H15.3939L19.1818 40H38.8788L43.4242 34.9444H51V1H6.30303L1 6.05556V34.9444Z"
      stroke="#00C9FF"
    />
    <mask
      id="mask0_1_95"
      {...{
        "mask-type": "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x="14"
      y="8"
      width="24"
      height="24"
    >
      <rect x="14" y="8" width="24" height="24" fill="#010827" />
    </mask>
    <g mask="url(#mask0_113_75)">
      <path
        d="M25.0001 29C24.7167 29 24.4792 28.9042 24.2876 28.7125C24.0959 28.5208 24.0001 28.2833 24.0001 28V22L18.2001 14.6C17.9501 14.2667 17.9126 13.9167 18.0876 13.55C18.2626 13.1833 18.5667 13 19.0001 13H33.0001C33.4334 13 33.7376 13.1833 33.9126 13.55C34.0876 13.9167 34.0501 14.2667 33.8001 14.6L28.0001 22V28C28.0001 28.2833 27.9042 28.5208 27.7126 28.7125C27.5209 28.9042 27.2834 29 27.0001 29H25.0001Z"
        fill="#00C9FF"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_113_75"
        x="0.5"
        y="0.5"
        width="51"
        height="41"
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
          result="effect1_innerShadow_113_75"
        />
      </filter>
    </defs>
  </svg>
);
