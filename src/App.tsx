// src/App.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./pages/HeroSection";
import AboutSection from "./pages/AboutSection";
import ProjectsSection from "./pages/ProjectsSection";
import SkillsSection from "./pages/SkillsSection";
import ContactSection from "./pages/ContactSection";
import ScrollArrow from "./components/ScrollArrow";

const SECTIONS = [
  { id: "hero", Component: HeroSection },
  { id: "about", Component: AboutSection },
  { id: "projects", Component: ProjectsSection },
  { id: "skills", Component: SkillsSection },
  { id: "contact", Component: ContactSection },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isNavClick, setIsNavClick] = useState(false);

  const centerSection = useCallback(
    (element: HTMLElement) => {
      if (isNavClick) return;

      const windowHeight = window.innerHeight;
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = window.pageYOffset + elementRect.top;
      const middle =
        absoluteElementTop - (windowHeight - elementRect.height) / 2;

      let start: number | null = null;
      const duration = 500;

      const animate = (currentTime: number) => {
        if (start === null) start = currentTime;
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

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
    },
    [isNavClick]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId) {
              setActiveSection(sectionId);
              centerSection(entry.target as HTMLElement);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px",
        threshold: [0.3],
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [centerSection]);

  useEffect(() => {
    if (isNavClick) {
      const timer = setTimeout(() => {
        setIsNavClick(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNavClick]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-gray-100 scroll-smooth selection:bg-purple-500/20 selection:text-purple-200">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <NavBar
          activeSection={activeSection}
          onNavClick={() => setIsNavClick(true)}
        />
        <main className="pt-14 space-y-24 pb-24">
          {SECTIONS.map(({ id, Component }) => (
            <div
              key={id}
              data-section={id}
              id={id}
              className="relative min-h-screen flex items-center"
            >
              <Component />
            </div>
          ))}
        </main>
        <ScrollArrow activeSection={activeSection} />
      </div>
    </div>
  );
}
