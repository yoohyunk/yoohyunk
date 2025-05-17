// src/App.tsx
"use client";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import AnimatedSection from "./components/AnimatedSection";
import HeroSection from "./pages/HeroSection";
import AboutSection from "./pages/AboutSection";
import ProjectsSection from "./pages/ProjectsSection";
import SkillsSection from "./pages/SkillsSection";
import ContactSection from "./pages/ContactSection";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");

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
        rootMargin: "-20% 0px",
        threshold: [0.3, 0.7],
      }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <NavBar activeSection={activeSection} />
        <main className="pt-20 space-y-24 pb-24">
          <div data-section="hero">
            <AnimatedSection name="hero">
              <HeroSection />
            </AnimatedSection>
          </div>
          <div data-section="about">
            <AnimatedSection name="about">
              <AboutSection />
            </AnimatedSection>
          </div>
          <div data-section="projects">
            <AnimatedSection name="projects">
              <ProjectsSection />
            </AnimatedSection>
          </div>
          <div data-section="skills">
            <AnimatedSection name="skills">
              <SkillsSection />
            </AnimatedSection>
          </div>
          <div data-section="contact">
            <AnimatedSection name="contact">
              <ContactSection />
            </AnimatedSection>
          </div>
        </main>
      </div>
    </div>
  );
}
