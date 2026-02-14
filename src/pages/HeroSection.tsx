import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene3D from "../components/Scene3D";

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
      { threshold: 0.1, rootMargin: "-100px" }
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
      className={`w-full relative overflow-hidden transition-[opacity,transform] duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        height: isMobile ? "calc(100dvh - 56px)" : "100vh",
        minHeight: isMobile ? "calc(100dvh - 56px)" : "100vh",
      }}
    >
      {/* Decorative gradient blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-violet-200/40 to-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-violet-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isMobile
            ? "flex flex-col items-center justify-center gap-6"
            : "flex items-center gap-8"
        }`}
      >
        {/* Text side */}
        <div
          className={`${
            isMobile ? "text-center z-10" : "w-1/2 z-10"
          }`}
        >
          <p
            className={`text-violet-600 font-medium mb-2 transition-[opacity,transform] duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isMobile ? "text-sm" : "text-base"}`}
          >
            Hi, I'm
          </p>
          <h1
            className={`font-bold text-[#1a1a2e] mb-3 transition-[opacity,transform] duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isMobile ? "text-3xl" : "text-5xl lg:text-6xl"}`}
          >
            Erica Kim
          </h1>
          <h2
            className={`text-gray-500 mb-4 transition-[opacity,transform] duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isMobile ? "text-lg" : "text-xl lg:text-2xl"}`}
          >
            Full-Stack Developer
          </h2>
          <p
            className={`text-gray-500 mb-6 leading-relaxed transition-[opacity,transform] duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isMobile ? "text-sm max-w-xs mx-auto" : "text-base max-w-md"}`}
          >
            Passionate about creating amazing experiences from database to browser.
          </p>
          <div
            className={`flex gap-3 transition-[opacity,transform] duration-700 delay-[600ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${isMobile ? "justify-center" : ""}`}
          >
            <button
              onClick={handleScrollToProjects}
              className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:bg-violet-800 transition-colors text-sm font-medium cursor-pointer"
            >
              View Projects
            </button>
            <button
              onClick={handleScrollToContact}
              className="px-5 py-2.5 border border-violet-300 text-violet-600 rounded-lg hover:bg-violet-50 active:bg-violet-100 transition-colors text-sm font-medium cursor-pointer"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* 3D side */}
        <div
          className={`${
            isMobile ? "w-full h-[40vh]" : "w-1/2 h-full"
          }`}
        >
          {isVisible && (
            <Canvas
              camera={{
                position: isMobile ? [0, 0, 3.5] : [0, 0, 3.2],
                fov: isMobile ? 45 : 32,
              }}
              className="w-full h-full"
              dpr={[1, Math.min(2, window.devicePixelRatio)]}
              performance={{ min: 0.5 }}
              frameloop="always"
            >
              <color attach="background" args={["#ffffff"]} />
              <ambientLight intensity={isMobile ? 2.0 : 1.8} />
              <pointLight position={[5, 5, 5]} intensity={isMobile ? 1.5 : 1.6} />
              <pointLight position={[-5, -5, -5]} intensity={0.8} />
              <Suspense fallback={null}>
                <Scene3D isMobile={isMobile} />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI}
                  minAzimuthAngle={-Infinity}
                  maxAzimuthAngle={Infinity}
                  rotateSpeed={isMobile ? 0.2 : 0.3}
                  enableDamping={true}
                  dampingFactor={0.05}
                  target={[0, 0, 0]}
                />
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </section>
  );
}
