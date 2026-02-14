import { useState, useEffect, useRef } from "react";
import MarbleGame from "../components/MarbleGame";

export default function ShowcaseSection() {
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
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full relative bg-[#0a0a0c] overflow-hidden"
      style={{ height: isMobile ? "70vh" : "100vh" }}
    >
      {/* Tagline */}
      <div
        className={`absolute top-12 left-0 right-0 text-center z-10 transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p
          className={`font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent ${
            isMobile ? "text-xl" : "text-2xl"
          }`}
        >
          Take a break, play a game
        </p>
      </div>

      {/* Marble Game */}
      <div className="w-full h-full">
        {isVisible && <MarbleGame isMobile={isMobile} />}
      </div>
    </section>
  );
}
