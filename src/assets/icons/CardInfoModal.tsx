import React from "react";

const CardInfoModal = ({
  logoUrl,
  title,
  country,
  state,
  city,
  className = "",
}: {
  logoUrl: string;
  title: string;
  country: string;
  state: string;
  city: string;
  className?: string;
}) => {
  return (
    <div
      className={`relative w-[240px] flex items-center justify-center ${className}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 232"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <path
          d="M1 1H231.833L239 6V231H8.4655L1 224V1Z"
          fill="#280037"
          fillOpacity="0.6"
          stroke="#A201E2"
          strokeWidth="0.8"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center text-white px-4 py-8 w-full h-full justify-center">
        <div className="w-[100px] h-[100px] flex items-center justify-center mb-3">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-base font-black tracking-widest text-center">
          {title}
        </h3>
        <p className="text-xs text-gray-300 text-center mt-2.5 tracking-widest">
          {country} | {state} | {city}
        </p>
      </div>
    </div>
  );
};

export default CardInfoModal;
