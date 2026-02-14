import { useState, useEffect, useRef } from "react";
import projects from "../data/projects.json";
import ProjectModal from "../components/ProjectModal";

export default function ProjectsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "-100px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          className={`font-bold text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          Projects
        </h2>

        {/* Bento grid: first project spans 2 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const isFeature = index === 0;
            const image =
              project.image || "https://placehold.co/600x400?text=Project";
            const technologies =
              project.technologies || project.tech || [];

            return (
              <div
                key={project.title}
                className={`group cursor-pointer transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${isFeature ? "md:col-span-2" : ""}`}
                style={{
                  transitionDelay: isVisible
                    ? `${400 + index * 150}ms`
                    : "0ms",
                }}
                onClick={() => setSelectedIndex(index)}
              >
                <div
                  className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                    isFeature ? "md:flex md:h-[320px]" : "h-full"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden ${
                      isFeature
                        ? "h-48 md:h-full md:w-1/2"
                        : "h-48"
                    }`}
                  >
                    <img
                      src={image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`p-6 flex flex-col justify-center ${
                      isFeature ? "md:w-1/2" : ""
                    }`}
                  >
                    <h3
                      className={`font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 ${
                        isFeature ? "text-2xl" : "text-xl"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {technologies.slice(0, 5).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {technologies.length > 5 && (
                        <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
                          +{technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
  );
}
