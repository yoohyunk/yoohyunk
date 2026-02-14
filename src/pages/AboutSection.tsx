import { useState, useEffect, useRef } from "react";

export default function AboutSection() {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2
          className={`font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          About Me
        </h2>
        <div
          className={`transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-xl md:text-2xl font-semibold text-center text-gray-800 leading-relaxed mb-8 max-w-3xl mx-auto">
            A fullstack developer with equal strength in frontend and backend — building polished experiences from database to browser.
          </p>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-gray-500 text-lg leading-relaxed">
              I'm Erica, based in Calgary. On the{" "}
              <span className="text-purple-600 font-medium">frontend</span>, I
              build responsive, accessible UIs using React, Next.js, and
              Tailwind CSS. On the{" "}
              <span className="text-purple-600 font-medium">backend</span>, I
              design robust APIs and data models with Django, Node.js, and
              PostgreSQL.
            </p>
            <div className="relative pl-6 py-3 rounded-r-lg">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full" />
              <p className="text-gray-600 text-lg leading-relaxed italic">
                I love architecting end-to-end solutions — from database schema and
                server logic all the way to polished user experiences in the browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
