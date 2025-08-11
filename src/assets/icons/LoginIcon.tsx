import React from "react";

const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="352"
    height="345"
    viewBox="0 0 352 345"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_i_216_1519)">
      <path
        d="M1 1.00063L150.709 1L154.879 7.97689H197.121L201.227 1.00063H346.776V103.319L351 107.97V178.895L346.776 184.709V331.32L334.103 344H1V271.223L4.50217 268.059L4.50246 122.506L1 119.974V1.00063Z"
        fill="#011231"
        fill-opacity="0.9"
      />
    </g>
    <path
      d="M1 1.00063L150.709 1L154.879 7.97689H197.121L201.227 1.00063H346.776V103.319L351 107.97V178.895L346.776 184.709V331.32L334.103 344H1V271.223L4.50217 268.059L4.50246 122.506L1 119.974V1.00063Z"
      stroke="#00C9FF"
    />
    <defs>
      <filter
        id="filter0_i_216_1519"
        x="0.5"
        y="0.5"
        width="351"
        height="344"
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
          result="effect1_innerShadow_216_1519"
        />
      </filter>
    </defs>
  </svg>
);

export default LoginIcon;
