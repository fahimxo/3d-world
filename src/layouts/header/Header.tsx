import Input from "../../components/input";

export const Headers = ({ clickMenu }: { clickMenu: () => void }) => {
  const MyCustomIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1_104"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <rect width="20" height="20" fill="#00C9FF" />
      </mask>
      <g mask="url(#mask0_1_104)">
        <path
          d="M16.3333 17.5L11.0833 12.25C10.6667 12.5833 10.1875 12.8472 9.64583 13.0417C9.10417 13.2361 8.52778 13.3333 7.91667 13.3333C6.40278 13.3333 5.12153 12.809 4.07292 11.7604C3.02431 10.7118 2.5 9.43056 2.5 7.91667C2.5 6.40278 3.02431 5.12153 4.07292 4.07292C5.12153 3.02431 6.40278 2.5 7.91667 2.5C9.43056 2.5 10.7118 3.02431 11.7604 4.07292C12.809 5.12153 13.3333 6.40278 13.3333 7.91667C13.3333 8.52778 13.2361 9.10417 13.0417 9.64583C12.8472 10.1875 12.5833 10.6667 12.25 11.0833L17.5 16.3333L16.3333 17.5ZM7.91667 11.6667C8.95833 11.6667 9.84375 11.3021 10.5729 10.5729C11.3021 9.84375 11.6667 8.95833 11.6667 7.91667C11.6667 6.875 11.3021 5.98958 10.5729 5.26042C9.84375 4.53125 8.95833 4.16667 7.91667 4.16667C6.875 4.16667 5.98958 4.53125 5.26042 5.26042C4.53125 5.98958 4.16667 6.875 4.16667 7.91667C4.16667 8.95833 4.53125 9.84375 5.26042 10.5729C5.98958 11.3021 6.875 11.6667 7.91667 11.6667Z"
          fill="#00C9FF"
        />
      </g>
    </svg>
  );
  return (
    <div className="w-full px-[45px]">
      <div className="w-full px-8 pt-[33px] flex items-center justify-between">
        <p className="font-normal text-[26px] leading-[100%] tracking-[0px] text-cyan-300 orbitron-font">
          Logo
        </p>
        <div className="w-[443px]">
          <Input placeholder="Enter club name or city" icon={MyCustomIcon} />
        </div>
        <svg
          onClick={() => clickMenu()}
          width="52"
          height="41"
          viewBox="0 0 52 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
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
      </div>
      <div className="mt-6 h-[1px] bg-cyan-500/30 w-full" />
    </div>
  );
};
