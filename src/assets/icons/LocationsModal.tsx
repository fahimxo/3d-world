import React from "react";

interface LocationsModalProps {
  children: React.ReactNode;
  className?: string;
}

export const LocationsModal: React.FC<LocationsModalProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`relative top-32 w-full max-w-4xl ${className}`}>
      <svg
        width="866"
        height="762"
        viewBox="0 0 866 762"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_i_80_394)">
          <path
            d="M1 1H663.5H734H853.874L865 19.4825V310.653V319.687V423.064V432.103V761H851.187H732.956L729.194 754.448H642.671L636.222 761H9.06119L1 749.603V105.208L5.83671 100.585V63.6459L1 58.6597V1Z"
            fill="url(#paint0_radial_80_394)"
            fill-opacity="0.95"
          />
        </g>
        <path
          d="M1 1H663.5H734H853.874L865 19.4825V310.653V319.687V423.064V432.103V761H851.187H732.956L729.194 754.448H642.671L636.222 761H9.06119L1 749.603V105.208L5.83671 100.585V63.6459L1 58.6597V1Z"
          stroke="#00FFA6"
          stroke-width="0.2"
        />
        <defs>
          <filter
            id="filter0_i_80_394"
            x="0.899902"
            y="0.899994"
            width="864.2"
            height="760.2"
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
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 0.65098 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_80_394"
            />
          </filter>
          <radialGradient
            id="paint0_radial_80_394"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(431.933 381.337) rotate(89.9596) scale(628.75 716.769)"
          >
            <stop stop-color="#00120C" />
            <stop offset="1" stop-color="#002216" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 p-8 ">{children}</div>
    </div>
  );
};
