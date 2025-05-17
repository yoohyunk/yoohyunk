"use client";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

interface NavBarProps {
  activeSection: string;
  onNavClick: () => void;
}

export default function NavBar({ activeSection, onNavClick }: NavBarProps) {
  const handleClick = (id: string) => {
    onNavClick();
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + elementRect.top;
      const targetPosition = absoluteElementTop - 80;

      const start = window.pageYOffset;
      const distance = targetPosition - start;
      const duration = 300; // Reduced duration to 300ms
      const startTime = performance.now();

      const animation = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for quick start and smooth end
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
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-8 py-4">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`
                  relative px-3 py-2 text-sm font-medium cursor-pointer
                  transition-all duration-300 ease-out
                  ${
                    activeSection === id
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }
                  `}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
