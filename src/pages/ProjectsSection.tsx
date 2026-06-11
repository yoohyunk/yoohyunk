import { useState, useEffect, useRef } from "react";
import projects from "../data/projects.json";
import { featuredProjects } from "../data/featuredProjects";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import ProjectModal from "../components/ProjectModal";

export default function ProjectsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent text-4xl md:text-6xl">
          Work
        </h2>
        <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
          Two AI builds I am most proud of, then earlier full-stack work.
        </p>

        {/* Featured AI projects */}
        <div className="space-y-10 mb-20">
          {featuredProjects.map((project, i) => (
            <FeaturedProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Condensed older work */}
        <h3 className="text-xl md:text-2xl font-semibold text-[#1a1a2e] mb-2">
          More work
        </h3>
        <p className="text-gray-500 text-sm mb-8">
          Earlier full-stack projects. Click any card for details.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map((project, index) => {
            const image =
              project.image || "https://placehold.co/600x400?text=Project";
            const technologies = project.technologies || project.tech || [];

            return (
              <button
                key={project.title}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`group text-left bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97]"}`}
                style={{ transitionDelay: isVisible ? `${Math.min(index * 70, 280)}ms` : "0ms" }}
              >
                <div className="relative overflow-hidden w-full h-40 sm:w-1/3 sm:h-auto sm:min-h-full">
                  <img
                    src={image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center w-full sm:w-2/3">
                  <h4 className="font-bold text-[#1a1a2e] mb-1 group-hover:text-violet-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {technologies.length > 4 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-600 rounded-full">
                        +{technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
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
