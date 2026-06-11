import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface ScrollArrowProps {
  activeSection: string;
}

const SECTION_ORDER = ["hero", "showcase", "about", "experience", "projects", "skills", "contact"];

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
      const elementRect = nextElement.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + elementRect.top;
      const offset = window.innerWidth < 768 ? 60 : 80;
      const targetPosition = absoluteElementTop - offset;

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
      className="fixed bottom-6 md:bottom-12 left-1/2 transform -translate-x-1/2 z-40"
    >
      <button
        onClick={handleClick}
        className="animate-bounce cursor-pointer transition-all duration-300 group flex items-center justify-center rounded-full bg-violet-100 active:bg-violet-200 shadow-sm w-12 h-12 md:w-14 md:h-14 hover:bg-violet-200"
        aria-label="Scroll to next section"
      >
        <MdOutlineKeyboardArrowDown
          className="w-7 h-7 md:w-8 md:h-8 text-violet-500 group-hover:text-violet-600 group-active:text-violet-600 transition-all"
        />
      </button>
    </div>
  );
}
