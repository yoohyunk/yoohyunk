import React, { useState, useEffect, useRef } from "react";
import skillsData from "../data/skills.json";
import SkillCard from "../components/SkillCard";
import type { SkillsData } from "../types/skill";

export default function SkillsSection() {
  const { categories } = skillsData as SkillsData;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-100px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="h-screen flex flex-col justify-start max-w-4xl mx-auto py-6">
        <h2
          className={`text-3xl font-bold mb-6 text-purple-200 text-center transition-all duration-700 delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Skills & Technologies
          <div
            className={`h-0.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transition-all duration-700 delay-500 transform ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </h2>
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`space-y-4 transition-all duration-700 transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${700 + index * 200}ms` : "0ms",
                }}
              >
                <h3 className="text-lg font-medium text-purple-300 text-center tracking-wide">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill.name}
                      className={`transition-all duration-500 transform ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${900 + index * 200 + skillIndex * 100}ms`
                          : "0ms",
                      }}
                    >
                      <SkillCard skill={skill} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
