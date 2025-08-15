import { useState, useEffect, useRef } from "react";
import projects from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function ProjectsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility based on intersection status
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // 10% of the section is visible
        rootMargin: "-100px", // Add some margin to trigger earlier
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
    <>
      <style>
        {`
          .perspective-1000 {
            perspective: 1000px;
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className={`w-full transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-8 perspective-1000">
          <h2
            className={`text-3xl font-bold mb-8 text-purple-200 text-center transition-all duration-700 delay-300 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Projects
            <div
              className={`h-0.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transition-all duration-700 delay-500 transform ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            />
          </h2>
          <div
            className="grid gap-6 md:grid-cols-2 lg:gap-8"
            style={{ perspective: "1500px" }}
          >
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`transition-all duration-700 transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${700 + index * 200}ms` : "0ms",
                }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>

        {selectedIndex !== null && (
          <ProjectModal
            project={projects[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            isOpen={selectedIndex !== null}
          />
        )}
      </section>
    </>
  );
}
