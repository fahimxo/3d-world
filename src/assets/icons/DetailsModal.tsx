import React, { useRef, useEffect, useState, useCallback } from "react";

const PADDING = 20;

const DetailsModal: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
}> = ({ children, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTop, setStartTop] = useState(0);

  const calculateScrollPosition = useCallback((clientY: number) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return { newTop: 0, scrollPosition: 0 };

    const { top, height } = scrollEl.getBoundingClientRect();
    const thumbHeight = 69;
    const trackHeight = height - PADDING * 2;
    const maxTop = trackHeight - thumbHeight;

    const clickYRelative = clientY - (top + PADDING) - thumbHeight / 2;
    const newTop = Math.max(0, Math.min(maxTop, clickYRelative));

    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    const scrollPosition = maxTop > 0 ? (newTop / maxTop) * maxScroll : 0;

    return { newTop, scrollPosition };
  }, []);

  const updateScrollPosition = useCallback(
    (clientY: number) => {
      const { newTop, scrollPosition } = calculateScrollPosition(clientY);
      setThumbTop(newTop);
      scrollRef.current?.scrollTo(0, scrollPosition);
    },
    [calculateScrollPosition]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartTop(thumbTop);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartTop(thumbTop);
  };

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || !scrollRef.current) return;

      const deltaY = clientY - startY;
      const newThumbTop = Math.max(
        0,
        Math.min(
          scrollRef.current.clientHeight - PADDING * 2 - 69,
          startTop + deltaY
        )
      );

      setThumbTop(newThumbTop);

      const maxTop = scrollRef.current.clientHeight - PADDING * 2 - 69;
      const maxScroll =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      const scrollPosition = (newThumbTop / maxTop) * maxScroll;

      scrollRef.current.scrollTo(0, scrollPosition);
    },
    [isDragging, startY, startTop]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientY),
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientY);
    },
    [handleMove]
  );

  const handleEndDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    const onScroll = () => {
      if (!el || isDragging) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const thumbHeight = 69;
      const trackHeight = clientHeight - PADDING * 2;
      const maxTop = Math.max(0, trackHeight - thumbHeight);
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const newTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0;
      setThumbTop(newTop);
      setShowScrollbar(maxScroll > 0);
    };

    if (el) {
      el.addEventListener("scroll", onScroll);
      const hasScroll = el.scrollHeight > el.clientHeight;
      setShowScrollbar(hasScroll);
      onScroll(); // Initialize position
    }
    return () => el?.removeEventListener("scroll", onScroll);
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEndDrag);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEndDrag);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEndDrag);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEndDrag]);

  return (
    <div className="relative flex flex-col w-[95vw] max-w-[812px] h-[640px] md:h-[534px] touch-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 812 534"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-20"
        preserveAspectRatio="none"
      >
        {/* SVG background paths - unchanged from original */}
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
      <svg
        width="7"
        height="30"
        viewBox="0 0 7 69"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#C42FFF" />
      </svg>
      <div
        ref={scrollRef}
        className="relative z-20 flex-1 overflow-y-auto hide-scrollbar"
      >
        <div className="px-10 text-white min-h-full">{children}</div>
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
            <span className="text-black font-bold relative z-20 cursor-pointer">
              Close
            </span>
          </button>
        </div>
      )}

      {showScrollbar && (
        <>
          <div
            className="absolute right-4 z-10 w-2 rounded-full backdrop-blur-sm transition-opacity duration-300"
            style={{
              top: PADDING,
              bottom: PADDING,
              backgroundColor: "rgba(66, 0, 94, 0.6)",
            }}
          />
          <div
            ref={thumbRef}
            className="absolute right-4 z-20 cursor-pointer hover:scale-105 transition-all duration-200 touch-pan-y select-none"
            style={{
              top: PADDING + thumbTop,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <svg
              width="7"
              height="69"
              viewBox="0 0 7 69"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#C42FFF" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsModal;
