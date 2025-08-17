import React from "react";

interface ClubsProps {
  className?: string;
  onClick: () => void;
}

export const Clubs: React.FC<ClubsProps> = ({ className, onClick }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <div className="absolute w-full h-full">
        <svg
          width="120"
          height="41"
          viewBox="0 0 120 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`  ${className}`}
        >
          <g filter="url(#filter0_i_226_2395)">
            <path
              d="M119 1V31.1139L117.046 34.076L114.311 37.8161H24.8344L23.2715 40H11.1589L9.59603 37.8161H1V1H5.70432H52.5762H54.5H65H67.2525H119Z"
              fill="#00FFA6"
              fill-opacity="0.1"
            />
          </g>
          <path
            d="M119 1V31.1139L117.046 34.076L114.311 37.8161H24.8344L23.2715 40H11.1589L9.59603 37.8161H1V1H5.70432H52.5762H54.5H65H67.2525H119Z"
            stroke="#00FFA6"
          />
          <defs>
            <filter
              id="filter0_i_226_2395"
              x="0.5"
              y="0.5"
              width="119"
              height="40"
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
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.65098 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_226_2395"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <span className="text-[#00FFA6] absolute top-2 left-8">Clubs</span>
    </div>
  );
};
