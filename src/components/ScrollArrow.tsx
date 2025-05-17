import React from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface ScrollArrowProps {
  activeSection: string;
}

const SECTION_ORDER = ["hero", "about", "projects", "skills", "contact"];

export default function ScrollArrow({ activeSection }: ScrollArrowProps) {
  const currentIndex = SECTION_ORDER.indexOf(activeSection);
  const nextSection =
    currentIndex < SECTION_ORDER.length - 1
      ? SECTION_ORDER[currentIndex + 1]
      : null;

  if (!nextSection) return null;

  const handleClick = () => {
    const nextElement = document.getElementById(nextSection);
    if (nextElement) {
      const windowHeight = window.innerHeight;
      const elementRect = nextElement.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + elementRect.top;
      const middle =
        absoluteElementTop - (windowHeight - elementRect.height) / 2;

      let start: number | null = null;
      const duration = 500; // 500ms for smooth animation

      const animate = (currentTime: number) => {
        if (start === null) start = currentTime;
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smoother animation
        const easeInOutCubic = (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const currentPosition = window.pageYOffset;
        const distance = middle - currentPosition;

        window.scrollTo(
          0,
          currentPosition + distance * easeInOutCubic(progress)
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={handleClick}
        className="animate-bounce cursor-pointer transition-colors group"
      >
        <MdOutlineKeyboardArrowDown className="w-8 h-8 text-blue-500 hover:text-blue-600 transition-colors" />
      </button>
    </div>
  );
}
