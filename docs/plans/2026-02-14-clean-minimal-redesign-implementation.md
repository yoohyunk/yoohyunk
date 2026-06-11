# Clean Minimal Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul the portfolio from dark glassmorphism to a clean, minimal, bright design while keeping the 3D MacBook model.

**Architecture:** File-by-file updates to swap dark theme colors/classes with light theme equivalents. The hero section gets a layout restructure (centered → side-by-side split). All other sections keep their structure but swap color classes. No new dependencies needed.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 4, Three.js/R3F, Vite

---

### Task 1: Update global styles (index.css)

**Files:**
- Modify: `src/index.css`

**Step 1: Update the root and global styles**

Replace the entire `src/index.css` with:

```css
@import "tailwindcss";

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light;
  color: #1a1a2e;
  background-color: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #7c3aed;
  text-decoration: inherit;
}
a:hover {
  color: #6d28d9;
}

/* Mobile viewport height fix */
html {
  height: 100%;
  height: -webkit-fill-available;
}

body {
  margin: 0;
  min-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

#root {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

/* Mobile-first responsive rules */
@media screen and (max-width: 768px) {
  h1 {
    font-size: 2.4em;
  }

  h2 {
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.4em;
  }

  p {
    font-size: 0.95em;
  }

  .min-h-screen {
    min-height: 100vh;
    min-height: 100dvh;
    min-height: -webkit-fill-available;
  }

  .h-screen {
    height: 100vh;
    height: 100dvh;
    height: -webkit-fill-available;
  }
}

/* Larger screens */
@media screen and (min-width: 769px) {
  p {
    font-size: 1em;
  }
}

/* Prevent horizontal scroll */
html, body {
  max-width: 100%;
  overflow-x: hidden;
}

/* Touch device optimizations */
@media (hover: none) {
  a:hover, button:hover {
    transition: none !important;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }
}

/* Media for different screen sizes */
@media screen and (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

**Step 2: Verify the dev server starts**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm run dev`
Expected: Dev server starts without errors

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "Switch global styles from dark to light theme"
```

---

### Task 2: Update App.tsx root layout

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update the root wrapper**

In `src/App.tsx`, replace the root `<div>` and its gradient overlays (lines 67-69):

Old:
```tsx
<div className="min-h-screen w-full bg-[#0a0a0c] text-gray-100 scroll-smooth selection:bg-purple-500/20 selection:text-purple-200">
  <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
  <div className="fixed inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />
```

New:
```tsx
<div className="min-h-screen w-full bg-white text-[#1a1a2e] scroll-smooth selection:bg-violet-100 selection:text-violet-900">
```

**Step 2: Update section wrapper classes**

Replace the section wrapper logic (lines 87-98) that applies `min-h-[100dvh]` to all sections. Change it so only hero gets min-h-screen and the rest get padding:

Old (the className in the `div` wrapping each section):
```tsx
className={
  id === "hero" && isMobile
    ? "relative min-h-[100dvh] flex flex-col justify-center items-center"
    : id === "skills"
    ? "relative min-h-[100dvh] md:min-h-screen flex items-center justify-center"
    : "relative min-h-[100dvh] md:min-h-screen flex items-center"
}
style={
  isMobile
    ? { minHeight: "calc(100vh - 56px)" }
    : undefined
}
```

New:
```tsx
className={
  id === "hero"
    ? "relative min-h-[100dvh] flex items-center"
    : "relative py-20 md:py-28"
}
style={
  id === "hero" && isMobile
    ? { minHeight: "calc(100vh - 56px)" }
    : undefined
}
```

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "Update App root layout for light theme and natural section heights"
```

---

### Task 3: Update NavBar for light theme

**Files:**
- Modify: `src/components/NavBar.tsx`

**Step 1: Update the nav element classes**

Replace the outer `<nav>` className (line 73-75):

Old:
```tsx
className={`fixed top-0 left-0 right-0 bg-[#0a0a0c]/80 backdrop-blur-xs z-50 transition-all duration-300 ${
  isScrolled ? "border-b border-purple-900/20" : ""
}`}
```

New:
```tsx
className={`fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 transition-all duration-300 ${
  isScrolled ? "border-b border-gray-200 shadow-sm" : ""
}`}
```

**Step 2: Update the logo/name styling**

Replace line 85 (name color):
Old: `className="flex-shrink-0 font-bold text-purple-300 tracking-wider text-2xl"`
New: `className="flex-shrink-0 font-bold text-[#1a1a2e] tracking-wider text-2xl"`

**Step 3: Update desktop nav item colors**

Replace the desktop button className (lines 139-147):

Old:
```tsx
className={`
  relative px-2 py-1 text-sm tracking-wide cursor-pointer
  transition-all duration-300 ease-out uppercase
  ${
    activeSection === id
      ? "text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      : "text-gray-400 hover:text-purple-200"
  }
  `}
```

New:
```tsx
className={`
  relative px-2 py-1 text-sm tracking-wide cursor-pointer
  transition-all duration-300 ease-out uppercase
  ${
    activeSection === id
      ? "text-violet-600 font-medium"
      : "text-gray-500 hover:text-violet-600"
  }
  `}
```

**Step 4: Update the active underline**

Replace line 151:
Old: `<span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />`
New: `<span className="absolute -bottom-1 left-0 w-full h-[2px] bg-violet-500 rounded-full" />`

**Step 5: Update mobile menu button**

Replace line 94:
Old: `className="inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-white hover:bg-purple-900/20 focus:outline-none"`
New: `className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-violet-600 hover:bg-violet-50 focus:outline-none"`

**Step 6: Update mobile menu panel**

Replace line 162:
Old: `<div className="bg-[#0a0a0c]/95 backdrop-blur-md border-t border-purple-900/10 pb-3 pt-2">`
New: `<div className="bg-white/95 backdrop-blur-md border-t border-gray-200 pb-3 pt-2">`

Replace mobile nav item className (lines 168-175):

Old:
```tsx
className={`
  relative block w-full text-left px-3 py-2 rounded-md text-base font-medium
  transition-all duration-300 ease-out
  ${
    activeSection === id
      ? "text-purple-300 bg-purple-900/20"
      : "text-gray-300 hover:bg-purple-900/10 hover:text-white"
  }
  `}
```

New:
```tsx
className={`
  relative block w-full text-left px-3 py-2 rounded-md text-base font-medium
  transition-all duration-300 ease-out
  ${
    activeSection === id
      ? "text-violet-600 bg-violet-50"
      : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
  }
  `}
```

**Step 7: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "Restyle NavBar for light theme"
```

---

### Task 4: Redesign HeroSection with split layout

**Files:**
- Modify: `src/pages/HeroSection.tsx`

**Step 1: Rewrite HeroSection**

Replace the entire file with a simplified split-layout hero that removes the popup/typing animation and shows text + 3D side by side:

```tsx
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
```

**Step 2: Commit**

```bash
git add src/pages/HeroSection.tsx
git commit -m "Redesign HeroSection with split layout and light theme"
```

---

### Task 5: Update Scene3D for bright environment

**Files:**
- Modify: `src/components/Scene3D.tsx`

**Step 1: Change Environment preset and lighting**

Replace `<Environment preset="night" />` (line 55) with:
```tsx
<Environment preset="apartment" />
```

**Step 2: Commit**

```bash
git add src/components/Scene3D.tsx
git commit -m "Switch 3D environment from night to apartment for brighter look"
```

---

### Task 6: Update AboutSection for light theme

**Files:**
- Modify: `src/pages/AboutSection.tsx`

**Step 1: Update heading color**

Replace `text-purple-200` with `text-[#1a1a2e]` in the h2 (line 40).

**Step 2: Update underline gradient**

Replace `bg-gradient-to-r from-purple-500 to-pink-500` with `bg-violet-500` (line 46).

**Step 3: Remove glow border and update card**

Replace lines 52-57 (the group wrapper and glow div):

Old:
```tsx
<div
  className={`relative group transition-[opacity,transform] duration-700 delay-700 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
>
  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500" />
  <div className="relative bg-[#0a0a0c] rounded-lg p-8 space-y-6 text-gray-300 border border-purple-900/10">
```

New:
```tsx
<div
  className={`relative transition-[opacity,transform] duration-700 delay-700 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
>
  <div className="relative rounded-lg p-8 space-y-6 text-gray-600">
```

**Step 4: Update text highlight colors**

Replace `text-purple-300` with `text-violet-600` (line 60, the "Fullstack Developer" span).

Replace `text-purple-200` with `text-violet-600` in lines 69, 73 (the "frontend" and "backend" spans).

Replace `border-l-2 border-purple-500/30 pl-6 py-2 bg-purple-500/5 rounded-r-lg` with `border-l-4 border-violet-400 pl-6 py-2 bg-violet-50/50 rounded-r-lg` (line 66).

**Step 5: Commit**

```bash
git add src/pages/AboutSection.tsx
git commit -m "Restyle AboutSection for light theme"
```

---

### Task 7: Update ExperienceSection for light theme

**Files:**
- Modify: `src/pages/ExperienceSection.tsx`

**Step 1: Update heading**

Replace `text-purple-200` with `text-[#1a1a2e]` in the h2 (line 97).
Replace `bg-gradient-to-r from-purple-500 to-pink-500` with `bg-violet-500` (line 103).

**Step 2: Update timeline line**

Replace line 111:
Old: `className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-600/60 via-purple-500/30 to-transparent rounded-full...`
New: `className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-violet-200 rounded-full...`

**Step 3: Update timeline dot**

Replace line 152-153:
Old: `className={`absolute top-3 ${isLeft ? "-right-[64px]" : "-left-[64px]"} block w-6 h-6 rounded-full bg-[#0a0a0c]`}`
     `style={{ boxShadow: "0 0 0 2px rgba(168,85,247,0.6)" }}`
New: `className={`absolute top-3 ${isLeft ? "-right-[64px]" : "-left-[64px]"} block w-4 h-4 rounded-full bg-violet-500 border-2 border-white`}`
     Remove the boxShadow style.

**Step 4: Remove glow overlay from cards**

Replace line 155:
Old: `<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500" />`
New: (remove this line entirely)

**Step 5: Update card background and border**

Replace line 157:
Old: `<div className="relative bg-[#0a0a0c] rounded-lg p-5 text-gray-300 border border-purple-900/20 hover:border-purple-600/40 transition-colors">`
New: `<div className="relative bg-white rounded-lg p-5 text-gray-600 border border-gray-200 shadow-sm hover:shadow-md transition-all">`

**Step 6: Update card text colors**

Replace `text-purple-200` with `text-[#1a1a2e]` for h3 (line 159).
Replace `text-gray-400` with `text-gray-500` for dates and company name (lines 162, 167).

**Step 7: Commit**

```bash
git add src/pages/ExperienceSection.tsx
git commit -m "Restyle ExperienceSection for light theme"
```

---

### Task 8: Update ProjectCard for light theme

**Files:**
- Modify: `src/components/ProjectCard.tsx`

**Step 1: Update icon color**

Replace `const iconColor = "text-purple-400";` (line 48) with:
`const iconColor = "text-violet-500";`

**Step 2: Remove glow background**

Replace line 194:
Old: `<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500" />`
New: (remove this line entirely)

**Step 3: Update card background and borders**

Replace line 198:
Old: `className="relative bg-[#1A1C20] rounded-xl overflow-hidden border border-purple-900/10 group-hover:border-purple-500/20 transition duration-300 shadow-lg group-hover:shadow-purple-500/10 active:scale-[0.98]"`
New: `className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 active:scale-[0.98]"`

**Step 4: Remove 3D transform on hover**

Replace the style prop (lines 199-201):
Old:
```tsx
style={{
  ...(isMobile ? {} : calculate3DTransform()),
  transformStyle: "preserve-3d",
}}
```
New:
```tsx
style={{}}
```

(The `calculate3DTransform`, `mousePosition`, `handleMouseMove` state/functions can be left — they're now unused but harmless. Or clean up if desired.)

**Step 5: Update text colors**

Replace `text-white` with `text-[#1a1a2e]` on the title h3 (line 234).
Replace `group-hover:text-purple-300` with `group-hover:text-violet-600` on the title (line 234).
Replace `text-gray-400` with `text-gray-500` on the summary p (line 242).

**Step 6: Update hover overlay**

Replace lines 302-325 (the desktop hover overlay):
Old: `className={`absolute inset-0 bg-black/70 flex items-center...`
New: `className={`absolute inset-0 bg-violet-600/80 flex items-center...`

**Step 7: Update mobile tap hint and tech badge colors**

Replace `text-purple-400` with `text-violet-500` on mobile tap hint (line 278).
Replace `bg-purple-500/50` with `bg-violet-500` on the +N badge (line 267).

**Step 8: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "Restyle ProjectCard for light theme"
```

---

### Task 9: Update ProjectsSection heading

**Files:**
- Modify: `src/pages/ProjectsSection.tsx`

**Step 1: Update heading colors**

Replace `text-purple-200` with `text-[#1a1a2e]` in h2 (line 52).
Replace `bg-gradient-to-r from-purple-500 to-pink-500` with `bg-violet-500` (line 60).

**Step 2: Commit**

```bash
git add src/pages/ProjectsSection.tsx
git commit -m "Restyle ProjectsSection heading for light theme"
```

---

### Task 10: Update ProjectModal for light theme

**Files:**
- Modify: `src/components/ProjectModal.tsx`

**Step 1: Update modal background**

Replace line 66:
Old: `className={`relative bg-[#121316] text-white overflow-hidden shadow-2xl ${`
New: `className={`relative bg-white text-[#1a1a2e] overflow-hidden shadow-2xl ${`

**Step 2: Update modal backdrop**

Replace line 62:
Old: `className="fixed inset-0 bg-black/80 backdrop-blur-sm"`
New: `className="fixed inset-0 bg-black/40 backdrop-blur-sm"`

**Step 3: Update gradient overlay for mobile**

Replace line 87:
Old: `<div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent" />`
New: `<div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />`

**Step 4: Update close button**

Replace line 91:
Old: `className={`absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-black transition text-white ${`
New: `className={`absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center active:bg-gray-100 transition text-gray-600 shadow-sm ${`

**Step 5: Update text colors throughout the modal**

- Title h2 (line 108): `text-purple-400` → `text-violet-600`
- Summary p (line 115): `text-gray-300` → `text-gray-600`
- Description p (line 124): `text-gray-400` → `text-gray-500`
- Technologies h3 (line 134): `text-purple-300` → `text-violet-600`
- Tech badges (line 144): `bg-purple-900/30 text-purple-300` → `bg-violet-100 text-violet-700`
- Features h3 (line 159): `text-purple-300` → `text-violet-600`
- Feature list (line 166): `text-gray-300` → `text-gray-600`
- Live button (line 184): `bg-purple-600 active:bg-purple-700` → `bg-violet-600 active:bg-violet-700 hover:bg-violet-700`
- Repo button (line 199): `border-purple-600`, `text-purple-400` → `border-violet-600`, `text-violet-600`

**Step 6: Commit**

```bash
git add src/components/ProjectModal.tsx
git commit -m "Restyle ProjectModal for light theme"
```

---

### Task 11: Update SkillsSection for light theme

**Files:**
- Modify: `src/pages/SkillsSection.tsx`

**Step 1: Update heading**

Replace `text-purple-200` with `text-[#1a1a2e]` in h2 (line 54).
Replace `bg-gradient-to-r from-purple-500 to-pink-500` with `bg-violet-500` (line 60).

**Step 2: Update subtitle text**

Replace `text-gray-400` with `text-gray-500` on the subtitle p (line 65).

**Step 3: Update category header**

Replace `text-purple-300` with `text-violet-600` in h3 (line 84).

**Step 4: Commit**

```bash
git add src/pages/SkillsSection.tsx
git commit -m "Restyle SkillsSection for light theme"
```

---

### Task 12: Update SkillCard for light theme

**Files:**
- Modify: `src/components/SkillCard.tsx`

**Step 1: Remove glow overlay**

Replace line 61:
Old: `<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-20 group-active:opacity-20 transition duration-500" />`
New: (remove this line entirely)

**Step 2: Update card background and border**

Replace line 62:
Old: `<div className="relative bg-[#0a0a0c] rounded-lg p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 border border-purple-900/10 hover:border-purple-500/20 active:border-purple-500/20 transition duration-300 min-h-[52px]">`
New: `<div className="relative bg-white rounded-lg p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 border border-gray-200 hover:border-violet-300 hover:shadow-sm active:border-violet-300 transition duration-300 min-h-[52px]">`

**Step 3: Update icon container**

Replace line 63:
Old: `<div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-purple-500/5 rounded-lg group-hover:bg-purple-500/10 group-active:bg-purple-500/10 transition duration-300">`
New: `<div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-violet-50 rounded-lg group-hover:bg-violet-100 group-active:bg-violet-100 transition duration-300">`

**Step 4: Update icon and text colors**

Replace line 65:
Old: `<IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300/70 group-hover:text-purple-200 group-active:text-purple-200 transition-colors" />`
New: `<IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 group-hover:text-violet-600 group-active:text-violet-600 transition-colors" />`

Replace line 68:
Old: `<h3 className="text-sm sm:text-base font-light text-gray-300 group-hover:text-purple-200 group-active:text-purple-200 tracking-wide transition-colors">`
New: `<h3 className="text-sm sm:text-base font-light text-gray-700 group-hover:text-violet-600 group-active:text-violet-600 tracking-wide transition-colors">`

**Step 5: Commit**

```bash
git add src/components/SkillCard.tsx
git commit -m "Restyle SkillCard for light theme"
```

---

### Task 13: Update ContactSection for light theme

**Files:**
- Modify: `src/pages/ContactSection.tsx`

**Step 1: Update heading**

Replace `text-purple-200` with `text-[#1a1a2e]` in h2 (line 38).
Replace `bg-gradient-to-r from-purple-500 to-pink-500` with `bg-violet-500` (line 44).

**Step 2: Update contact link hover states**

For all three `<a>` tags, replace:
- `hover:bg-purple-900/20 active:bg-purple-900/30` → `hover:bg-violet-50 active:bg-violet-100`

**Step 3: Update icon container backgrounds**

For all three icon containers, replace:
- `bg-purple-900/30` → `bg-violet-100`
- `group-hover:bg-purple-800/40 group-active:bg-purple-800/50` → `group-hover:bg-violet-200 group-active:bg-violet-200`

**Step 4: Update icon colors**

Replace `text-purple-300` with `text-violet-500` on all three SVG icons (lines 56, 85, 108).

**Step 5: Update text colors**

Replace `text-purple-200` with `text-[#1a1a2e]` on all h3 elements (lines 70, 93, 116).
Replace `text-gray-400 group-hover:text-purple-300 group-active:text-purple-300` with `text-gray-500 group-hover:text-violet-600 group-active:text-violet-600` on all p elements (lines 71, 94, 117).

**Step 6: Commit**

```bash
git add src/pages/ContactSection.tsx
git commit -m "Restyle ContactSection for light theme"
```

---

### Task 14: Update ScrollArrow for light theme

**Files:**
- Modify: `src/components/ScrollArrow.tsx`

**Step 1: Update button styling**

Replace line 73:
Old: `className={`animate-bounce cursor-pointer transition-all duration-300 group flex items-center justify-center rounded-full bg-purple-900/20 active:bg-purple-900/40 ${`
New: `className={`animate-bounce cursor-pointer transition-all duration-300 group flex items-center justify-center rounded-full bg-violet-100 active:bg-violet-200 shadow-sm ${`

Replace the mobile/desktop size class portion:
Old: `isMobile ? "w-12 h-12" : "w-14 h-14 hover:bg-purple-900/30"`
New: `isMobile ? "w-12 h-12" : "w-14 h-14 hover:bg-violet-200"`

**Step 2: Update icon color**

Replace line 79-81:
Old: `className={`${isMobile ? "w-7 h-7" : "w-8 h-8"} text-purple-400/70 group-hover:text-purple-300 group-active:text-purple-300 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all`}`
New: `className={`${isMobile ? "w-7 h-7" : "w-8 h-8"} text-violet-500 group-hover:text-violet-600 group-active:text-violet-600 transition-all`}`

**Step 3: Commit**

```bash
git add src/components/ScrollArrow.tsx
git commit -m "Restyle ScrollArrow for light theme"
```

---

### Task 15: Visual verification and cleanup

**Step 1: Run dev server and visually verify**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm run dev`

Check each section:
- Hero: split layout, text left, 3D right, bright background, gradient blobs visible
- About: clean text, violet left-border quote, no glow
- Experience: white cards, violet timeline, natural height
- Projects: white cards, subtle shadow hover, no 3D tilt
- Skills: white cards, violet icons, soft background
- Contact: clean icons, violet hover states
- Navbar: white/blur, violet active state
- ScrollArrow: violet, no glow

**Step 2: Fix any remaining dark-theme artifacts**

Search the codebase for any remaining `#0a0a0c`, `bg-[#0a0a0c]`, `bg-[#1A1C20]`, `bg-[#121316]`, or `purple-900` references and update them.

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "Clean up remaining dark theme artifacts"
```
