// src/pages/AboutSection.jsx

import React, { useState, useEffect, useRef } from "react";

export default function AboutSection() {
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
      <div className="max-w-3xl mx-auto">
        <h2
          className={`text-4xl font-bold mb-8 text-purple-200 text-center transition-all duration-700 delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          About Me
          <div
            className={`h-0.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transition-all duration-700 delay-500 transform ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </h2>
        <div
          className={`relative group transition-all duration-700 delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500" />
          <div className="relative bg-[#0a0a0c] rounded-lg p-8 space-y-6 text-gray-300 border border-purple-900/10">
            <p className="text-lg leading-relaxed">
              I'm Yoohyun, a{" "}
              <span className="text-purple-300 font-medium">
                Full-Stack Developer
              </span>{" "}
              based in Calgary, with equal strength in both front-end and
              back-end technologies.
            </p>
            <div className="border-l-2 border-purple-500/30 pl-6 py-2 bg-purple-500/5 rounded-r-lg">
              <p className="text-lg">
                On the{" "}
                <span className="text-purple-200 font-medium">front end</span>,
                I build responsive, accessible UIs using React, Next.js, and
                Tailwind CSS. On the{" "}
                <span className="text-purple-200 font-medium">back end</span>, I
                design robust APIs and data models with Django, Node.js, and
                PostgreSQL.
              </p>
            </div>
            <p className="text-lg leading-relaxed">
              I love architecting end-to-end solutions—from database schema and
              server logic all the way to polished user experiences in the
              browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
