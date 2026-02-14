// src/App.tsx
"use client";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./pages/HeroSection";
import AboutSection from "./pages/AboutSection";
import ExperienceSection from "./pages/ExperienceSection";
import ProjectsSection from "./pages/ProjectsSection";
import SkillsSection from "./pages/SkillsSection";
import ContactSection from "./pages/ContactSection";
import ScrollArrow from "./components/ScrollArrow";

const SECTIONS = [
  { id: "hero", Component: HeroSection },
  { id: "about", Component: AboutSection },
  { id: "experience", Component: ExperienceSection },
  { id: "projects", Component: ProjectsSection },
  { id: "skills", Component: SkillsSection },
  { id: "contact", Component: ContactSection },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // 초기 로드 시 확인
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 스크롤 시 활성 섹션만 감지 (자동 센터링 제거로 버벅거림 해결)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#1a1a2e] scroll-smooth selection:bg-violet-100 selection:text-violet-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavBar
          activeSection={activeSection}
          onNavClick={handleNavClick}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main
          className={
            isMobile ? "pt-14 space-y-12 pb-16" : "pt-14 space-y-24 pb-24"
          }
        >
          {SECTIONS.map(({ id, Component }) => (
            <div
              key={id}
              data-section={id}
              id={id}
              className={
                id === "hero"
                  ? "relative min-h-[100dvh] flex items-center"
                  : "relative py-20 md:py-28"
              }
              style={
                id === "hero" && isMobile
                  ? { minHeight: "calc(100vh - 56px)" }
                  : undefined
              }
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
