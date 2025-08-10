import React from "react";

interface MenuIconProps {
  className?: string;
  onClick: () => void;
}
const MenuIcon: React.FC<MenuIconProps> = ({ className, onClick }) => {
  return (
    <svg
      onClick={onClick}
      width="52"
      height="41"
      viewBox="0 0 52 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_i_1_31)">
        <path
          d="M41.7258 1H11.1518H3.42613V4.81522L1 8.20652V13.2935L3.42613 17.9565V39.626L24.9767 40L26.4032 37.8804L36 38L37.5 40H46.9339L51 35.8856V8.20652V4.81522H48.1774H42.9355L41.7258 1Z"
          fill="#011231"
          fill-opacity="0.9"
        />
      </g>
      <path
        d="M41.7258 1H11.1518H3.42613V4.81522L1 8.20652V13.2935L3.42613 17.9565V39.626L24.9767 40L26.4032 37.8804L36 38L37.5 40H46.9339L51 35.8856V8.20652V4.81522H48.1774H42.9355L41.7258 1Z"
        stroke="#00C9FF"
      />
      <mask
        id="mask0_1_31"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="14"
        y="8"
        width="24"
        height="24"
      >
        <rect x="14" y="8" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1_31)">
        <path
          d="M17 14.9994V12.9994H35V14.9994H17ZM17 26.9994V24.9994H35V26.9994H17ZM17 20.9994V18.9994H35V20.9994H17Z"
          fill="#00C9FF"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_1_31"
          x="0.5"
          y="0.5"
          width="51"
          height="40.0046"
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
            result="effect1_innerShadow_1_31"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default MenuIcon;
