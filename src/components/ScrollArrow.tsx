import { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface ScrollArrowProps {
  activeSection: string;
}

const SECTION_ORDER = ["hero", "about", "experience", "projects", "skills", "contact"];

export default function ScrollArrow({ activeSection }: ScrollArrowProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentIndex = SECTION_ORDER.indexOf(activeSection);
  const nextSection =
    currentIndex < SECTION_ORDER.length - 1
      ? SECTION_ORDER[currentIndex + 1]
      : null;

  if (!nextSection) return null;

  const handleClick = () => {
    const nextElement = document.getElementById(nextSection);
    if (nextElement) {
      const elementRect = nextElement.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + elementRect.top;
      const targetPosition = absoluteElementTop - (isMobile ? 60 : 80);

      const start = window.pageYOffset;
      const distance = targetPosition - start;
      const duration = 300;
      const startTime = performance.now();

      const animation = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

        window.scrollTo(0, start + distance * easeOutQuint(progress));

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <div
      className={`fixed ${
        isMobile ? "bottom-6" : "bottom-12"
      } left-1/2 transform -translate-x-1/2 z-40`}
    >
      <button
        onClick={handleClick}
        className={`animate-bounce cursor-pointer transition-all duration-300 group flex items-center justify-center rounded-full bg-violet-100 active:bg-violet-200 shadow-sm ${
          isMobile ? "w-12 h-12" : "w-14 h-14 hover:bg-violet-200"
        }`}
        aria-label="Scroll to next section"
      >
        <MdOutlineKeyboardArrowDown
          className={`${
            isMobile ? "w-7 h-7" : "w-8 h-8"
          } text-violet-500 group-hover:text-violet-600 group-active:text-violet-600 transition-all`}
        />
      </button>
    </div>
  );
}
