import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

const PADDING = 20;
const CustomScrollPanel: React.FC<{ children: ReactNode }> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTop, setStartTop] = useState(0);

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || !scrollRef.current) return;
      const thumbHeight = 69;
      const trackHeight = scrollRef.current.clientHeight - PADDING * 2;
      const maxTop = trackHeight - thumbHeight;
      const deltaY = clientY - startY;
      const newThumbTop = Math.max(0, Math.min(maxTop, startTop + deltaY));
      setThumbTop(newThumbTop);
      const maxScroll =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      const scrollPosition =
        maxTop > 0 ? (newThumbTop / maxTop) * maxScroll : 0;
      scrollRef.current.scrollTo(0, scrollPosition);
    },
    [isDragging, startY, startTop]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartTop(thumbTop);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartTop(thumbTop);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientY),
    [handleMove]
  );
  const handleTouchMove = useCallback(
    (e: TouchEvent) => handleMove(e.touches[0].clientY),
    [handleMove]
  );
  const handleEndDrag = useCallback(() => setIsDragging(false), []);

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
      el.addEventListener('scroll', onScroll);
      onScroll(); // برای تنظیم اولیه
      return () => el.removeEventListener('scroll', onScroll);
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEndDrag);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleEndDrag);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEndDrag);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEndDrag]);

  return (
    <div className="relative w-full flex-1 flex flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto hide-scrollbar pr-6"
      >
        <div className="px-0.5 sm:px-10 text-white">{children}</div>
      </div>
      {showScrollbar && (
        <div
          ref={thumbRef}
          className="absolute right-4 z-20 cursor-pointer touch-none select-none"
          style={{ transform: `translateY(${PADDING + thumbTop}px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <svg
            width="7"
            height="69"
            viewBox="0 0 7 69"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#00784E" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CustomScrollPanel;
