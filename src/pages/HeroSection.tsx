import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleScrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) {
      const top = window.pageYOffset + el.getBoundingClientRect().top - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      const top = window.pageYOffset + el.getBoundingClientRect().top - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{
        height: isMobile ? "calc(100dvh - 56px)" : "100vh",
        minHeight: isMobile ? "calc(100dvh - 56px)" : "100vh",
      }}
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-300/30 blur-3xl animate-mesh-1" />
        <div className="absolute top-[10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-pink-300/25 blur-3xl animate-mesh-2" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-3xl animate-mesh-3" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <p
          className={`text-gray-500 font-medium mb-4 tracking-wide uppercase text-sm transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Full-Stack Developer
        </p>
        <h1
          className={`font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent leading-tight mb-6 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } ${isMobile ? "text-5xl" : "text-7xl lg:text-8xl"}`}
        >
          Erica Kim
        </h1>
        <p
          className={`text-gray-500 max-w-lg leading-relaxed mb-8 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } ${isMobile ? "text-base px-4" : "text-lg"}`}
        >
          Passionate about building end-to-end experiences — from database schema to polished interfaces.
        </p>
        <div
          className={`flex gap-4 transition-all duration-700 delay-[600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <button
            onClick={handleScrollToProjects}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all text-sm font-medium cursor-pointer"
          >
            View Projects
          </button>
          <button
            onClick={handleScrollToContact}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:border-purple-400 hover:text-purple-600 active:scale-95 transition-all text-sm font-medium cursor-pointer"
          >
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
