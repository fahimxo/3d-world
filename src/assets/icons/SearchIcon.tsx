import React from "react";

const Search: React.FC = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 445 44"
      fill="#011231E5"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={`absolute top-0 left-0 pointer-events-none z-0 inset-0 w-full h-full ${className}`}
    >
      <g filter="url(#filter0_i_1_100)">
        <path
          d="M1 4.15H78.087L81.0904 1H104.116L107.12 4.15H248.78H356.902H436.5L444 10.45V43H251.5L248.78 39.85H230.759L228.256 43H9.5L1 37.225V4.15Z"
          fill="#011231"
          fillOpacity="0.9"
        />
      </g>
      <path
        d="M1 4.15H78.087L81.0904 1H104.116L107.12 4.15H248.78H356.902H436.5L444 10.45V43H251.5L248.78 39.85H230.759L228.256 43H9.5L1 37.225V4.15Z"
        stroke="#00C9FF"
      />
      <path d="M1 10L3.5 12.5V24L1 26.5V10Z" fill="#00C9FF" stroke="#00C9FF" />
      <mask
        id="mask0_1_100"
        maskUnits="userSpaceOnUse"
        x="13"
        y="12"
        width="20"
        height="20"
      >
        <rect x="13" y="12" width="20" height="20" fill="#00C9FF" />
      </mask>
      <g mask="url(#mask0_1_100)">
        <path
          d="M29.3333 29.5L24.0833 24.25C23.6667 24.5833 23.1875 24.8472 22.6458 25.0417C22.1042 25.2361 21.5278 25.3333 20.9167 25.3333C19.4028 25.3333 18.1215 24.809 17.0729 23.7604C16.0243 22.7118 15.5 21.4306 15.5 19.9167C15.5 18.4028 16.0243 17.1215 17.0729 16.0729C18.1215 15.0243 19.4028 14.5 20.9167 14.5C22.4306 14.5 23.7118 15.0243 24.7604 16.0729C25.809 17.1215 26.3333 18.4028 26.3333 19.9167C26.3333 20.5278 26.2361 21.1042 26.0417 21.6458C25.8472 22.1875 25.5833 22.6667 25.25 23.0833L30.5 28.3333L29.3333 29.5ZM20.9167 23.6667C21.9583 23.6667 22.8438 23.3021 23.5729 22.5729C24.3021 21.8438 24.6667 20.9583 24.6667 19.9167C24.6667 18.875 24.3021 17.9896 23.5729 17.2604C22.8438 16.5312 21.9583 16.1667 20.9167 16.1667C19.875 16.1667 18.9896 16.5312 18.2604 17.2604C17.5312 17.9896 17.1667 18.875 17.1667 19.9167C17.1667 20.9583 17.5312 21.8438 18.2604 22.5729C18.9896 23.3021 19.875 23.6667 20.9167 23.6667Z"
          fill="#00C9FF"
        />
      </g>
      <path
        d="M230.5 40L228 43H251.5L249 40H230.5Z"
        fill="#00C9FF"
        stroke="#00C9FF"
      />
      <defs>
        <filter
          id="filter0_i_1_100"
          x="0.5"
          y="0.5"
          // width="444"
          // height="43"
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
            result="effect1_innerShadow_1_100"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Search;
