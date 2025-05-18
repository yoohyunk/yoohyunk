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
      const targetPosition = absoluteElementTop - 60;

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
    <nav className="fixed top-0 left-0 right-0 bg-[#0a0a0c]/80 backdrop-blur-md z-50 border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-10 py-3">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`
                  relative px-2 py-1 text-sm tracking-wide cursor-pointer
                  transition-all duration-300 ease-out uppercase
                  ${
                    activeSection === id
                      ? "text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "text-gray-400 hover:text-purple-200"
                  }
                  `}
              >
                {label}
                {activeSection === id && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
