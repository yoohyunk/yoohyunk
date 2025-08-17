"use client";
import { useState, useEffect } from "react";

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
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NavBar({
  activeSection,
  onNavClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-[#0a0a0c]/80 backdrop-blur-xs z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-purple-900/20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 ">
            <img
              src="/circular_white_only.png"
              alt="logo"
              className="w-8 h-8"
            />
            <div className="flex-shrink-0 font-bold text-purple-300 tracking-wider text-2xl">
              Erica Kim
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-white hover:bg-purple-900/20 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <ul className="hidden md:flex justify-center space-x-8">
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
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="bg-[#0a0a0c]/95 backdrop-blur-md border-t border-purple-900/10 pb-3 pt-2">
          <ul className="px-4 space-y-2">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={`
                    relative block w-full text-left px-3 py-2 rounded-md text-base font-medium
                    transition-all duration-300 ease-out
                    ${
                      activeSection === id
                        ? "text-purple-300 bg-purple-900/20"
                        : "text-gray-300 hover:bg-purple-900/10 hover:text-white"
                    }
                    `}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
