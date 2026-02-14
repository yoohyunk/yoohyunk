import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene3D from "../components/Scene3D";

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
          Built with passion
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
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
            <color attach="background" args={["#0a0a0c"]} />
            <ambientLight intensity={isMobile ? 1.5 : 1.2} />
            <pointLight position={[5, 5, 5]} intensity={1.6} />
            <pointLight position={[-5, -5, -5]} intensity={0.8} />
            <Suspense fallback={null}>
              <Scene3D isMobile={isMobile} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                rotateSpeed={isMobile ? 0.2 : 0.3}
                enableDamping={true}
                dampingFactor={0.05}
                target={[0, 0, 0]}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
    </section>
  );
}
