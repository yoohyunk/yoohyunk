"use client";
import { Link } from "react-scroll";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

interface NavBarProps {
  activeSection: string;
}

export default function NavBar({ activeSection }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex justify-center space-x-8 py-4">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <Link
                to={id}
                spy={true}
                smooth={true}
                duration={500}
                offset={-80}
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
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
