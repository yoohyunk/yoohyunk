# Apple + SaaS Hybrid Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the portfolio from a basic light theme into a dramatic Apple + SaaS hybrid design with animated gradient mesh hero, gradient text headings, bento grid projects, dark 3D showcase section, and full-width dramatic layouts.

**Architecture:** Complete rewrites of most section components to achieve the Apple editorial feel. A new ShowcaseSection is added for the 3D MacBook reveal on a dark background. CSS keyframe animations handle the gradient mesh in the hero. Every section heading uses gradient text via `bg-clip-text text-transparent`. Layout changes are dramatic — massive typography, generous whitespace, and full-viewport sections.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 4, Three.js/R3F, Vite

---

### Task 1: Add gradient mesh animation and gradient text utility to index.css

**Files:**
- Modify: `src/index.css`

**Step 1: Add gradient mesh keyframes and gradient text class**

Add the following at the end of `src/index.css`:

```css
/* Gradient mesh animation for hero */
@keyframes gradient-mesh-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(10%, -15%) scale(1.1); }
  50% { transform: translate(-5%, 10%) scale(0.95); }
  75% { transform: translate(-15%, -5%) scale(1.05); }
}

@keyframes gradient-mesh-2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  25% { transform: translate(-15%, 10%) scale(1.05); }
  50% { transform: translate(10%, -10%) scale(1.1); }
  75% { transform: translate(5%, 15%) scale(0.95); }
}

@keyframes gradient-mesh-3 {
  0%, 100% { transform: translate(0%, 0%) scale(1.05); }
  25% { transform: translate(15%, 5%) scale(0.95); }
  50% { transform: translate(-10%, -15%) scale(1.1); }
  75% { transform: translate(-5%, 10%) scale(1); }
}

.animate-mesh-1 { animation: gradient-mesh-1 20s ease-in-out infinite; }
.animate-mesh-2 { animation: gradient-mesh-2 25s ease-in-out infinite; }
.animate-mesh-3 { animation: gradient-mesh-3 30s ease-in-out infinite; }
```

**Step 2: Commit**

```bash
git add src/index.css
git commit -m "Add gradient mesh animation keyframes"
```

---

### Task 2: Rewrite HeroSection with centered layout and gradient mesh

**Files:**
- Modify: `src/pages/HeroSection.tsx`

**Step 1: Replace the entire file**

Replace the entire contents of `src/pages/HeroSection.tsx` with:

```tsx
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
```

**Step 2: Commit**

```bash
git add src/pages/HeroSection.tsx
git commit -m "Rewrite HeroSection with centered layout and gradient mesh"
```

---

### Task 3: Create ShowcaseSection for 3D dark reveal

**Files:**
- Create: `src/pages/ShowcaseSection.tsx`

**Step 1: Create the new section file**

Create `src/pages/ShowcaseSection.tsx` with:

```tsx
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
```

**Step 2: Commit**

```bash
git add src/pages/ShowcaseSection.tsx
git commit -m "Add ShowcaseSection with dark 3D product reveal"
```

---

### Task 4: Update App.tsx for new section structure and full-width layout

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add ShowcaseSection import and update SECTIONS array**

Add the import after the HeroSection import:
```tsx
import ShowcaseSection from "./pages/ShowcaseSection";
```

Update the SECTIONS array to include showcase between hero and about:
```tsx
const SECTIONS = [
  { id: "hero", Component: HeroSection },
  { id: "showcase", Component: ShowcaseSection },
  { id: "about", Component: AboutSection },
  { id: "experience", Component: ExperienceSection },
  { id: "projects", Component: ProjectsSection },
  { id: "skills", Component: SkillsSection },
  { id: "contact", Component: ContactSection },
];
```

**Step 2: Update the root div and remove the max-width constraint**

The current layout wraps everything in `max-w-7xl` which prevents full-width sections. Change lines 67-101 to:

Replace:
```tsx
    <div className="min-h-screen w-full bg-white text-[#1a1a2e] scroll-smooth selection:bg-violet-100 selection:text-violet-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

With:
```tsx
    <div className="min-h-screen w-full bg-white text-[#1a1a2e] scroll-smooth selection:bg-violet-100 selection:text-violet-900">
      <div className="relative">
```

**Step 3: Update section wrapper classes**

Replace the entire `{SECTIONS.map(…)}` block (lines 80-98) with:

```tsx
          {SECTIONS.map(({ id, Component }) => (
            <div
              key={id}
              data-section={id}
              id={id}
              className={
                id === "hero"
                  ? "relative"
                  : id === "showcase"
                  ? "relative"
                  : "relative py-24 md:py-32"
              }
            >
              <Component />
            </div>
          ))}
```

**Step 4: Update the main tag spacing**

Replace:
```tsx
          <main
            className={
              isMobile ? "pt-14 space-y-12 pb-16" : "pt-14 space-y-24 pb-24"
            }
          >
```

With:
```tsx
          <main className="pt-14 pb-24">
```

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "Add ShowcaseSection and full-width layout to App"
```

---

### Task 5: Rewrite AboutSection with dramatic typography

**Files:**
- Modify: `src/pages/AboutSection.tsx`

**Step 1: Replace the entire file**

```tsx
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
            <div className="border-l-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[0_0_0_0] rounded-r-lg relative">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full" />
              <div className="pl-6 py-3 ml-0">
                <p className="text-gray-600 text-lg leading-relaxed italic">
                  I love architecting end-to-end solutions — from database schema and
                  server logic all the way to polished user experiences in the browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: The quote block uses a gradient left border created with an absolute-positioned gradient div.

**Step 2: Commit**

```bash
git add src/pages/AboutSection.tsx
git commit -m "Rewrite AboutSection with dramatic gradient typography"
```

---

### Task 6: Rewrite ExperienceSection with alternating feature rows

**Files:**
- Modify: `src/pages/ExperienceSection.tsx`

**Step 1: Replace the entire file**

```tsx
import { useState, useEffect, useRef } from "react";
import experience from "../data/experience.json";

type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  bullets?: string[];
};

function parseDateForSort(value: string): number {
  if (!value) return 0;
  if (/(present|current)/i.test(value)) return Number.MAX_SAFE_INTEGER;
  const parts = value.split("-");
  const year = parseInt(parts[0], 10);
  const month = parts[1] ? parseInt(parts[1], 10) : 1;
  if (Number.isNaN(year)) return 0;
  return year * 100 + month;
}

export default function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

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

  const items: ExperienceItem[] = [...(experience as ExperienceItem[])].sort(
    (a, b) =>
      parseDateForSort(b.end || b.start) - parseDateForSort(a.end || a.start)
  );

  useEffect(() => {
    setRevealed((prev) => {
      if (prev.length === items.length) return prev;
      return Array(items.length).fill(false);
    });
  }, [items.length]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setRevealed((state) => {
            const next =
              state.length === items.length
                ? [...state]
                : Array(items.length).fill(false);
            next[idx] = entry.isIntersecting;
            return next;
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2
          className={`font-bold text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          Experience
        </h2>

        <div className="relative space-y-16">
          {/* Decorative center line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-transparent hidden md:block" />

          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={`${item.title}-${item.company}-${index}`}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${
                  revealed[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {/* Spacer for alternating layout */}
                {!isLeft && <div className="hidden md:block md:w-1/2" />}

                {/* Card */}
                <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                        {item.start} — {item.end}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      {item.company}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {item.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="text-gray-600 text-sm leading-relaxed flex gap-2"
                          >
                            <span className="text-purple-400 mt-1.5 flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                {isLeft && <div className="hidden md:block md:w-1/2" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/ExperienceSection.tsx
git commit -m "Rewrite ExperienceSection with alternating feature rows"
```

---

### Task 7: Rewrite ProjectsSection with bento grid layout

**Files:**
- Modify: `src/pages/ProjectsSection.tsx`

**Step 1: Replace the entire file**

```tsx
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
```

**Step 2: Commit**

```bash
git add src/pages/ProjectsSection.tsx
git commit -m "Rewrite ProjectsSection with bento grid layout"
```

---

### Task 8: Rewrite SkillsSection with icon grid and fafafa background

**Files:**
- Modify: `src/pages/SkillsSection.tsx`

**Step 1: Replace the entire file**

```tsx
import { useState, useEffect, useRef } from "react";
import skillsData from "../data/skills.json";
import SkillCard from "../components/SkillCard";
import type { SkillsData } from "../types/skill";

export default function SkillsSection() {
  const { categories } = skillsData as SkillsData;
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
      className={`w-full bg-[#fafafa] transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        <h2
          className={`font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          Tools & Technologies
        </h2>
        <p
          className={`text-gray-500 text-center text-base md:text-lg mb-16 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          I mostly write tested code in the JavaScript and Python ecosystems,
          but I am happy to adapt to whatever you use.
        </p>

        <div className="space-y-12">
          {categories.map((category, catIndex) => (
            <div
              key={category.name}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${600 + catIndex * 200}ms` : "0ms",
              }}
            >
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }`}
                    style={{
                      transitionDelay: isVisible
                        ? `${800 + catIndex * 200 + skillIndex * 80}ms`
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
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/SkillsSection.tsx
git commit -m "Rewrite SkillsSection with icon grid and fafafa background"
```

---

### Task 9: Rewrite SkillCard as centered icon card with hover effects

**Files:**
- Modify: `src/components/SkillCard.tsx`

**Step 1: Replace the entire file**

```tsx
import { Skill } from "../types/skill";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaLinux,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDjango,
  SiPostgresql,
  SiFlask,
  SiExpo,
  SiMysql,
  SiPython,
  SiJavascript,
  SiGithub,
  SiFirebase,
  SiSupabase,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { IconType } from "react-icons";

interface SkillCardProps {
  skill: Skill;
}

const iconComponents: { [key: string]: IconType } = {
  react: FaReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  nodejs: FaNodeJs,
  django: SiDjango,
  postgresql: SiPostgresql,
  git: FaGitAlt,
  docker: FaDocker,
  aws: FaAws,
  linux: FaLinux,
  reactnative: FaReact,
  expo: SiExpo,
  flask: SiFlask,
  azure: DiMsqlServer,
  sql: SiMysql,
  python: SiPython,
  javascript: SiJavascript,
  github: SiGithub,
  firebase: SiFirebase,
  supabase: SiSupabase,
};

export default function SkillCard({ skill }: SkillCardProps) {
  const IconComponent = iconComponents[skill.icon];

  return (
    <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 hover:border-purple-200 active:scale-100 transition-all duration-300 cursor-default">
      <div className="w-10 h-10 flex items-center justify-center mb-2">
        {IconComponent && (
          <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors duration-300" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600 transition-colors text-center">
        {skill.name}
      </span>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/SkillCard.tsx
git commit -m "Rewrite SkillCard as centered icon card with hover effects"
```

---

### Task 10: Rewrite ContactSection with large icon buttons

**Files:**
- Modify: `src/pages/ContactSection.tsx`

**Step 1: Replace the entire file**

```tsx
import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function ContactSection() {
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

  const contacts = [
    {
      icon: FaEnvelope,
      label: "Email",
      href: "mailto:yoohyunk20@gmail.com",
      external: false,
    },
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "https://linkedin.com/in/yoohyunk",
      external: true,
    },
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/yoohyunk",
      external: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className={`font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          Let's Connect
        </h2>
        <p
          className={`text-gray-500 text-lg mb-12 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Have a project in mind? Let's talk.
        </p>
        <div
          className={`flex justify-center gap-6 transition-all duration-700 delay-[600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {contacts.map(({ icon: Icon, label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-500/10 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/pages/ContactSection.tsx
git commit -m "Rewrite ContactSection with large icon buttons"
```

---

### Task 11: Update NavBar active indicator to gradient underline

**Files:**
- Modify: `src/components/NavBar.tsx`

**Step 1: Update the active underline span**

On line 151, replace:
```tsx
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-violet-500 rounded-full" />
```

With:
```tsx
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full" />
```

**Step 2: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "Update NavBar active indicator to gradient underline"
```

---

### Task 12: Update ScrollArrow section order for showcase section

**Files:**
- Modify: `src/components/ScrollArrow.tsx`

**Step 1: Update SECTION_ORDER array**

On line 8, replace:
```tsx
const SECTION_ORDER = ["hero", "about", "experience", "projects", "skills", "contact"];
```

With:
```tsx
const SECTION_ORDER = ["hero", "showcase", "about", "experience", "projects", "skills", "contact"];
```

**Step 2: Commit**

```bash
git add src/components/ScrollArrow.tsx
git commit -m "Add showcase to ScrollArrow section order"
```

---

### Task 13: Update ProjectModal title to gradient text

**Files:**
- Modify: `src/components/ProjectModal.tsx`

**Step 1: Update the title h2**

On line 108, replace:
```tsx
              className={`font-bold mb-2 text-violet-600 ${
```

With:
```tsx
              className={`font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent ${
```

**Step 2: Commit**

```bash
git add src/components/ProjectModal.tsx
git commit -m "Update ProjectModal title to gradient text"
```

---

### Task 14: Final cleanup and verification

**Step 1: Search for remaining issues**

Search for any remaining `text-[#1a1a2e]` in headings that should be gradient, and any `bg-violet-500` underlines that should be removed (since headings no longer use underlines).

**Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

**Step 3: Run Vite build**

```bash
npx vite build
```

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "Clean up remaining styling artifacts"
```
