import React, { useRef, useEffect, useState, useCallback, ReactNode } from "react";

interface CustomScrollPanelProps {
  children: ReactNode;
  onClose?: () => void;
}

const CustomScrollPanel: React.FC<CustomScrollPanelProps> = ({ children, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

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
    const scrollPosition = maxTop > 0 ? (newTop / maxTop) * maxScroll : 0;

    setThumbTop(newTop);
    scrollEl.scrollTo(0, scrollPosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
        setShowScrollbar(maxScroll > 0);
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => el.removeEventListener("scroll", handleScroll);
    }
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
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 px-10 py-8 text-white overflow-y-auto hide-scrollbar"
      >
        {children}
      </div>
      {showScrollbar && (
        <div
          ref={thumbRef}
          className="absolute right-4 top-0 z-20 cursor-pointer"
          style={{ transform: `translateY(${thumbTop}px)` }}
          onMouseDown={handleMouseDown}
        >
          <svg width="7" height="69" viewBox="0 0 7 69" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#00784E" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CustomScrollPanel;