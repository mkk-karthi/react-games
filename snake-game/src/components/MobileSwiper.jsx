import { useCallback, useEffect, useState, useRef } from "react";

export default function MobileSwiper({ children, onSwipe }) {
  const wrapperRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = useCallback((e) => {
    if (!wrapperRef.current.contains(e.target)) {
      return;
    }

    e.preventDefault();

    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!wrapperRef.current.contains(e.target)) {
        return;
      }

      e.preventDefault();

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      let key = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          key = "ArrowRight";
        } else {
          key = "ArrowLeft";
        }
      } else {
        if (deltaY > 0) {
          key = "ArrowDown";
        } else {
          key = "ArrowUp";
        }
      }

      onSwipe({ key });
    },
    [startX, startY, onSwipe]
  );

  useEffect(() => {
    document.getElementById("swipe").addEventListener("touchstart", handleTouchStart);
    document.getElementById("swipe").addEventListener("touchend", handleTouchEnd);

    return () => {
      document.getElementById("swipe").removeEventListener("touchstart", handleTouchStart);
      document.getElementById("swipe").removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div ref={wrapperRef} id="swipe">
      {children}
    </div>
  );
}
