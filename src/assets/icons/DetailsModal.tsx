import React, { useRef, useEffect, useState, useCallback } from "react";

const DetailsModal: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
}> = ({ children, onClose }) => {
  // const scrollRef = useRef<HTMLDivElement>(null);
  // const [thumbTop, setThumbTop] = useState(50);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollEl = scrollRef.current;
  //     if (scrollEl) {
  //       const { scrollTop, scrollHeight, clientHeight } = scrollEl;
  //       const thumbHeight = 69;
  //       const maxScroll = scrollHeight - clientHeight;
  //       const maxTop = clientHeight - thumbHeight;
  //       const newTop = (scrollTop / maxScroll) * maxTop;
  //       setThumbTop(newTop);
  //     }
  //   };

  //   const el = scrollRef.current;
  //   if (el) {
  //     el.addEventListener("scroll", handleScroll);
  //   }
  //   return () => {
  //     if (el) el.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollPosition = useCallback((clientY: number) => {
    const scrollEl = scrollRef.current;
    const thumbEl = thumbRef.current;
    if (!scrollEl || !thumbEl) return;

    const { top, height } = scrollEl.getBoundingClientRect();
    const thumbHeight = 69;
    const clickPosition = clientY - top - thumbHeight / 2;
    const maxTop = height - thumbHeight;
    const newTop = Math.max(0, Math.min(maxTop, clickPosition));

    const scrollHeight = scrollEl.scrollHeight;
    const maxScroll = scrollHeight - height;
    const scrollPosition = (newTop / maxTop) * maxScroll;

    setThumbTop(newTop);
    scrollEl.scrollTo(0, scrollPosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateScrollPosition(e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateScrollPosition(e.clientY);
    },
    [isDragging, updateScrollPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollEl = scrollRef.current;
      if (scrollEl && !isDragging) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        const thumbHeight = 69;
        const maxScroll = scrollHeight - clientHeight;
        const maxTop = clientHeight - thumbHeight;
        const newTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0;
        setThumbTop(newTop);
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  return (
    <div className="relative w-[812px] h-[534px] flex flex-col">
      <svg
        width="812"
        height="534"
        viewBox="0 0 812 534"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-20"
      >
        <g filter="url(#filter0_i_80_110)">
          <path
            d="M1 1.97229H40L42 5.5H109.5L112 1.97229H399.829L794.5 0.500003L804.851 13.4621V217.664L811 221.889V297.183L804.851 302.839V533.5H792H522L516.5 528.905H464.236L458.5 533.5H8.5L1 525.507V73.583L5.5 70.3403V44.4346L1 40.9377V1.97229Z"
            fill="url(#paint0_radial_80_110)"
            fillOpacity="0.9"
          />
        </g>
        <path
          d="M1 1.97229H40L42 5.5H109.5L112 1.97229H399.829L794.5 0.500003L804.851 13.4621V217.664L811 221.889V297.183L804.851 302.839V533.5H792H522L516.5 528.905H464.236L458.5 533.5H8.5L1 525.507V73.583L5.5 70.3403V44.4346L1 40.9377V1.97229Z"
          stroke="#520172"
        />
        <defs>
          <filter
            id="filter0_i_80_110"
            x="0.5"
            y="-0.0009"
            width="811"
            height="534.001"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
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
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.720866 0 0 0 0 0.0288462 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend in2="shape" result="effect1_innerShadow" />
          </filter>
          <radialGradient
            id="paint0_radial_80_110"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(405 267.236) rotate(89.7844) scale(265.766 525.306)"
          >
            <stop />
            <stop offset="1" stopColor="#5B0180" />
          </radialGradient>
        </defs>
      </svg>
      <div
        ref={scrollRef}
        className="relative z-20 flex-1 px-10 py-8 text-white overflow-y-auto hide-scrollbar"
      >
        {children}
      </div>
      {onClose && (
        <div className="relative z-20 flex justify-center py-8">
          <button
            onClick={onClose}
            className="relative flex items-center justify-center"
            style={{ width: 114, height: 36 }}
          >
            <svg
              width="114"
              height="36"
              viewBox="0 0 114 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                d="M0 0H107.5L114 7.75385V36H6L0 29.3538V0Z"
                fill="#00C9FF"
              />
            </svg>
            <span className="text-black font-bold relative z-20">Close</span>
          </button>
        </div>
      )}
      <div
        ref={thumbRef}
        className="absolute right-4 top-0 z-20 cursor-pointer"
        style={{
          transform: `translateY(${thumbTop}px)`,
          transition: isDragging ? "none" : "transform 0.05s linear",
        }}
        onMouseDown={handleMouseDown}
      >
        <svg
          width="7"
          height="69"
          viewBox="0 0 7 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#C42FFF" />
        </svg>
      </div>
    </div>
  );
};

export default DetailsModal;
