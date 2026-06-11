# Mobile Polish + Animation Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the mobile load-flash, polish mobile layout, speed up and latch scroll animations, and make the two AI featured cards compact-by-default with an expand for full detail.

**Architecture:** Replace JS `isMobile` (window.innerWidth + resize) with Tailwind `md:` responsive classes. Reuse the existing `useInView` hook (add a `once` latch) and Tailwind `transition`/`transform` classes for all reveals. No animation library, no rAF loops, no `prefers-reduced-motion` handling this pass.

**Tech Stack:** Vite 6, React 18, TypeScript, Tailwind v4, react-icons. Verification per task: `yarn build` (runs `tsc -b && vite build`) and `yarn lint`. There is no unit-test runner in this repo, so verification is build + lint clean + a manual viewport check (375px mobile and desktop).

**Branch:** `feature/mobile-and-animation` (already created off `origin/main` @ e3a37c6). Spec: `docs/superpowers/specs/2026-06-11-mobile-and-animation-design.md`.

**Baseline lint:** `yarn lint` currently reports `6 problems (0 errors, 6 warnings)`. All 6 are pre-existing `react-hooks/exhaustive-deps` ref-cleanup warnings. "No new errors" means stay at 0 errors; do not add new warnings beyond these 6.

---

## File Structure

- `src/hooks/useInView.ts` — add an opt-in `once` latch (reveal once, then stop observing).
- `src/pages/HeroSection.tsx` — drop `isMobile`; responsive via `md:`.
- `src/components/ScrollArrow.tsx` — drop `isMobile`; responsive via `md:`; compute scroll offset at click time.
- `src/components/ProjectModal.tsx` — drop `isMobile`; full-screen vs centered via `md:`.
- `src/pages/AboutSection.tsx` — faster + latched reveal.
- `src/pages/SkillsSection.tsx` — faster + latched reveal + capped stagger.
- `src/pages/ContactSection.tsx` — faster + latched reveal + capped stagger.
- `src/pages/ExperienceSection.tsx` — faster + latched reveal; mobile left-rail timeline; tighter spacing; date separator `to`.
- `src/pages/ProjectsSection.tsx` — faster + latched section reveal; More work cards stack on mobile + staggered reveal.
- `src/components/FeaturedProjectCard.tsx` — compact-by-default with a card-level expander; per-card `useInView` reveal; dense diagram legible on mobile.

---

## Task 1: Add a `once` latch to `useInView`

**Files:**
- Modify: `src/hooks/useInView.ts`

- [ ] **Step 1: Replace the hook body to support a latch**

Current file toggles `isIntersecting` both ways. Replace the whole file with:

```ts
// src/hooks/useInView.ts
import { useEffect, useRef, useState, RefObject } from "react";

/**
 * Observe an element's viewport intersection.
 * @param threshold IntersectionObserver threshold.
 * @param once When true (default), latch to visible on first intersection and
 *   stop observing, so a fast scroll-out never re-hides revealed content.
 */
export default function useInView(
  threshold = 0.1,
  once = true
): [RefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIntersecting(false);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, once]);

  return [ref, isIntersecting];
}
```

- [ ] **Step 2: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; lint `0 errors` (<= 6 warnings).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useInView.ts
git commit -m "feat: add once-latch and earlier trigger to useInView"
```

---

## Task 2: Hero de-flash (remove isMobile, responsive via md:)

**Files:**
- Modify: `src/pages/HeroSection.tsx`

- [ ] **Step 1: Remove the `isMobile` state and resize effect**

Delete the `const [isMobile, setIsMobile] = useState(false);` line and the entire `useEffect` that adds the `resize` listener / `checkMobile`. Keep the `isVisible` IntersectionObserver effect and `handleScrollToProjects`.

- [ ] **Step 2: Replace the section height (drop inline style)**

Change the `<section>` opening tag from the inline `style={{ height: isMobile ? ... }}` form to Tailwind classes:

```tsx
<section
  ref={sectionRef}
  className="w-full relative overflow-hidden h-[calc(100dvh-56px)] min-h-[calc(100dvh-56px)] md:h-screen md:min-h-screen"
>
```

- [ ] **Step 3: Replace `isMobile` text-size ternaries with responsive classes**

- Heading `h1`: replace `${isMobile ? "text-5xl" : "text-7xl lg:text-8xl"}` with `text-5xl md:text-7xl lg:text-8xl`.
- Sub paragraph: replace `${isMobile ? "text-base px-4" : "text-lg"}` with `text-base px-4 md:text-lg md:px-0`.

- [ ] **Step 4: Enlarge the recruiter icon-link tap targets**

For each of the three icon `<a>` (GitHub, Email, LinkedIn) in the recruiter shortcuts row, add `p-2 -m-2` to the existing className so the hit area grows without changing layout. Example:

```tsx
className="text-gray-500 hover:text-purple-600 active:scale-95 transition-colors p-2 -m-2"
```

- [ ] **Step 5: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`. The Hero `react-hooks/exhaustive-deps` warning count should not increase (removing an effect may reduce it).

- [ ] **Step 6: Manual check**

`yarn dev`, load `http://localhost:5173/` at 375px and desktop: hero fills the screen with no layout jump on load; heading scales; buttons/icons reachable.

- [ ] **Step 7: Commit**

```bash
git add src/pages/HeroSection.tsx
git commit -m "refactor: hero responsive via tailwind, remove isMobile flash"
```

---

## Task 3: ScrollArrow de-flash

**Files:**
- Modify: `src/components/ScrollArrow.tsx`

- [ ] **Step 1: Remove `isMobile` state + resize effect**

Delete `const [isMobile, setIsMobile] = useState(false);` and the `useEffect` with `checkMobile`/resize listener. Remove now-unused `useState`/`useEffect` imports if they are no longer referenced (keep imports that are still used).

- [ ] **Step 2: Compute the scroll offset at click time**

In `handleClick`, replace the `isMobile ? 60 : 80` expression with an inline check (no state, runs only on click so no flash):

```tsx
const offset = window.innerWidth < 768 ? 60 : 80;
const targetPosition = absoluteElementTop - offset;
```

- [ ] **Step 3: Replace `isMobile` classes with responsive classes**

- Wrapper div: replace `${isMobile ? "bottom-6" : "bottom-12"}` with `bottom-6 md:bottom-12`.
- Button: replace `${isMobile ? "w-12 h-12" : "w-14 h-14 hover:bg-violet-200"}` with `w-12 h-12 md:w-14 md:h-14 hover:bg-violet-200`.
- Icon: replace `${isMobile ? "w-7 h-7" : "w-8 h-8"}` with `w-7 h-7 md:w-8 md:h-8`.

- [ ] **Step 4: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollArrow.tsx
git commit -m "refactor: scrollarrow responsive via tailwind, remove isMobile"
```

---

## Task 4: ProjectModal de-flash

**Files:**
- Modify: `src/components/ProjectModal.tsx`

- [ ] **Step 1: Remove `isMobile` state + its resize logic**

Delete `const [isMobile, setIsMobile] = useState(false);`. In the `useEffect`, remove the `checkMobile`/resize listener lines but KEEP `setMounted(true)`, the `isOpen` body-overflow lock, and its cleanup. Keep `mounted` state.

- [ ] **Step 2: Make the container + modal box responsive**

- Outer flex container: replace `${isMobile ? "p-0" : "p-4"}` with `p-0 md:p-4`.
- Modal box: replace the `isMobile ? "w-full h-full rounded-none" : "max-w-2xl w-full max-h-[80vh] rounded-xl"` ternary with:
  `w-full h-full rounded-none md:w-full md:max-w-2xl md:h-auto md:max-h-[80vh] md:rounded-xl`.

- [ ] **Step 3: Make image, close button, and paddings responsive**

- Header image: replace `${isMobile ? "h-52" : "h-48"}` with `h-52 md:h-48`.
- Mobile gradient overlay div: replace the `{isMobile && (...)}` guard by always rendering it with `md:hidden` on its className.
- Close button: replace `${isMobile ? "w-11 h-11" : "w-8 h-8 hover:bg-gray-100"}` with `w-11 h-11 md:w-8 md:h-8 hover:bg-gray-100`.
- Close icon: replace `<FaTimes size={isMobile ? 20 : 16} />` with `<FaTimes className="w-5 h-5 md:w-4 md:h-4" />` (drop the `size` prop so Tailwind controls size).
- Content wrapper: replace `${isMobile ? "p-5 pb-8" : "p-5"}` with `p-5 pb-8 md:pb-5`.

- [ ] **Step 4: Make the title/summary/description/heading text responsive**

Replace each remaining `isMobile ? A : B` text-size ternary with the mobile value plus a `md:` override. Specifically:
- Title `h2`: `text-2xl md:text-xl`.
- Summary `p`: `text-base md:text-lg`.
- Description `p`: `text-base leading-relaxed md:text-sm`.
- "Technologies"/"Key Features" `h3`: `text-lg md:text-md`.
- Tech pills: `px-3 py-1.5 text-sm md:px-2 md:py-1 md:text-xs`.
- Tech container gap: `gap-2 md:gap-1.5`.
- Features `ul`: `text-base md:text-sm`.
- Action button row: `mt-6 md:mt-3`.
- Live/repo link buttons: `w-12 h-12 md:w-10 md:h-10` and drop the icon `size` prop in favor of `className="w-5 h-5 md:w-[18px] md:h-[18px]"`.

- [ ] **Step 5: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 6: Manual check**

Open a More work card on mobile width (full-screen modal, no flash) and desktop (centered modal). Close button and links tappable.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectModal.tsx
git commit -m "refactor: projectmodal responsive via tailwind, remove isMobile"
```

---

## Task 5: AboutSection — faster + latched reveal

**Files:**
- Modify: `src/pages/AboutSection.tsx`

- [ ] **Step 1: Latch the observer and stop re-hiding**

In the IntersectionObserver effect, change the callback so it only reveals and then unobserves:

```tsx
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      observer.disconnect();
    }
  },
  { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
);
```

- [ ] **Step 2: Shorten durations**

- Section wrapper: change `duration-1000` to `duration-500`.
- Heading: change `duration-700 delay-200` to `duration-500 delay-100`.
- Content block: change `duration-700 delay-500` to `duration-500 delay-200`.

- [ ] **Step 3: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AboutSection.tsx
git commit -m "perf: faster latched reveal for About"
```

---

## Task 6: SkillsSection — faster + latched + capped stagger

**Files:**
- Modify: `src/pages/SkillsSection.tsx`

- [ ] **Step 1: Latch the observer**

Change the observer callback as in Task 5 Step 1 (reveal once, `observer.disconnect()`), keeping `rootMargin: "0px 0px -10% 0px"`.

- [ ] **Step 2: Shorten durations**

- Section wrapper: `duration-1000` to `duration-500`.
- Heading: `duration-700 delay-200` to `duration-500 delay-100`.
- Intro paragraph: `duration-700 delay-400` to `duration-500 delay-150`.
- Category block: `duration-700` to `duration-500`.

- [ ] **Step 3: Cap the category and card stagger**

- Category block delay: replace `transitionDelay: isVisible ? \`${600 + catIndex * 200}ms\` : "0ms"` with `transitionDelay: isVisible ? \`${Math.min(catIndex * 80, 240)}ms\` : "0ms"`.
- Skill card: keep `duration-500` (Tailwind has no `duration-400`), and replace `transitionDelay: isVisible ? \`${800 + catIndex * 200 + skillIndex * 80}ms\` : "0ms"` with a capped value based on position within the category:

```tsx
style={{
  transitionDelay: isVisible
    ? `${Math.min(catIndex * 80 + skillIndex * 40, 300)}ms`
    : "0ms",
}}
```

- [ ] **Step 4: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 5: Manual check**

Fast-scroll to Skills: all cards are visible quickly (total reveal under ~0.7s) and stay visible when scrolled past.

- [ ] **Step 6: Commit**

```bash
git add src/pages/SkillsSection.tsx
git commit -m "perf: faster latched reveal and capped stagger for Skills"
```

---

## Task 7: ContactSection — faster + latched + capped stagger

**Files:**
- Modify: `src/pages/ContactSection.tsx`

- [ ] **Step 1: Latch the observer**

Change the observer callback as in Task 5 Step 1 (reveal once, `observer.disconnect()`), `rootMargin: "0px 0px -10% 0px"`.

- [ ] **Step 2: Shorten durations**

- Section wrapper: `duration-1000` to `duration-500`.
- Heading: `duration-700 delay-200` to `duration-500 delay-100`.
- Intro paragraph: `duration-700 delay-400` to `duration-500 delay-150`.
- Icon row container: `duration-700 delay-[600ms]` to `duration-500 delay-200`.

- [ ] **Step 3: Add a per-icon staggered pop-in**

The three contacts currently reveal together. Give each a small staggered scale pop. In the `contacts.map(...)`, add to the `<a>` an index and per-item transition. Replace the `.map(({ icon: Icon, label, href, external }) => (` signature with `.map(({ icon: Icon, label, href, external }, i) => (` and add to the `<a>` className a transform + transition and an inline delay:

```tsx
className={`group flex flex-col items-center gap-3 transition-all duration-500 ${
  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
}`}
style={{ transitionDelay: isVisible ? `${200 + i * 70}ms` : "0ms" }}
```

(`duration-500`, not `duration-400` — Tailwind's default scale has no 400.)

(Keep the existing `target`/`rel`/`key` attributes.)

- [ ] **Step 4: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ContactSection.tsx
git commit -m "perf: faster latched reveal and icon pop-in for Contact"
```

---

## Task 8: ExperienceSection — timing + mobile rail + spacing + date separator

**Files:**
- Modify: `src/pages/ExperienceSection.tsx`

- [ ] **Step 1: Latch the section observer**

In the section-level observer effect, change `([entry]) => setIsVisible(entry.isIntersecting)` to reveal once:

```tsx
([entry]) => {
  if (entry.isIntersecting) {
    setIsVisible(true);
  }
},
```

(The per-item observers below also need latching — Step 2.)

- [ ] **Step 2: Latch the per-item reveal**

In the per-item `IntersectionObserver` effect, change the callback so an item, once revealed, stays revealed:

```tsx
const obs = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return;
    setRevealed((state) => {
      const next =
        state.length === items.length ? [...state] : Array(items.length).fill(false);
      next[idx] = true;
      return next;
    });
    obs.unobserve(el);
  },
  { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
);
```

- [ ] **Step 3: Shorten durations**

- Section wrapper: `duration-1000` to `duration-500`.
- Heading: `duration-700 delay-200` to `duration-500 delay-100`.
- Per-item card wrapper: `duration-700` to `duration-500`.

- [ ] **Step 4: Tighten mobile spacing**

Change the timeline container spacing from `space-y-16` to `space-y-8 md:space-y-16`.

- [ ] **Step 5: Add a mobile left rail + dots**

The center line is currently `hidden md:block`. Add a mobile-only left rail and indent the cards on mobile. Replace the decorative center-line div with two rails:

```tsx
{/* Mobile left rail */}
<div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-transparent md:hidden" />
{/* Desktop center line */}
<div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-transparent hidden md:block" />
```

On the per-item row wrapper, add mobile left padding so cards sit right of the rail: add `pl-6 md:pl-0` to the existing row `className` (the `flex flex-col md:flex-row ...` div).

Add a mobile dot at the start of each item. Inside the per-item row wrapper, as the first child (before the `{!isLeft && ...}` spacer), add:

```tsx
<span className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-purple-400 md:hidden" />
```

For this to anchor correctly, ensure the per-item row wrapper has `relative` in its className (add `relative` to the `flex flex-col md:flex-row items-center gap-8 ...` div).

- [ ] **Step 6: Replace the date em dash separator**

Change the date pill from `{item.start} — {item.end}` to `{item.start} to {item.end}`.

- [ ] **Step 7: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 8: Manual check**

Mobile: a left rail with dots, cards indented to the right, tighter spacing, dates read "2026-02 to Present". Desktop: unchanged alternating timeline. Fast-scroll: items reveal fast and stay.

- [ ] **Step 9: Commit**

```bash
git add src/pages/ExperienceSection.tsx
git commit -m "feat: mobile timeline rail + faster latched reveal for Experience"
```

---

## Task 9: ProjectsSection — section reveal + More work mobile stack + stagger

**Files:**
- Modify: `src/pages/ProjectsSection.tsx`

- [ ] **Step 1: Latch the section observer + shorten duration**

Change the observer callback to reveal once:

```tsx
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) setIsVisible(true);
  },
  { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
);
```

Change the section wrapper `duration-1000` to `duration-500`.

- [ ] **Step 2: Make More work cards stack on mobile**

On the More work card `<button>`, change `... transition-all duration-300 flex` to `... transition-all duration-300 flex flex-col sm:flex-row`.

Image wrapper: change `relative overflow-hidden w-1/3 min-h-full` to `relative overflow-hidden w-full h-40 sm:w-1/3 sm:h-auto sm:min-h-full`.

Content wrapper: change `p-4 flex flex-col justify-center w-2/3` to `p-4 flex flex-col justify-center w-full sm:w-2/3`.

- [ ] **Step 3: Add a staggered reveal to More work cards (fade + slide + scale)**

The card `<button>` already has `transition-all duration-300` (used for hover). Reuse it — do NOT add a second `transition-all`/`duration`. Just append the reveal state classes to the className (gated by `isVisible`):

```tsx
` ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97]"}`
```

and add an inline style on the same `<button>`:

```tsx
style={{ transitionDelay: isVisible ? `${Math.min(index * 70, 280)}ms` : "0ms" }}
```

(Keep the existing `key`, `type`, `onClick`. Note `index` is the `projects.map((project, index) => ...)` index already in scope.)

- [ ] **Step 4: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`.

- [ ] **Step 5: Manual check**

Mobile: More work cards are image-on-top, full width, readable. Desktop: two-column row cards. Scrolling in: cards rise + fade + settle with a quick stagger and stay visible.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ProjectsSection.tsx
git commit -m "feat: More work mobile stack + lively staggered reveal"
```

---

## Task 10: FeaturedProjectCard — compact default + expander, per-card reveal, mobile diagram

**Files:**
- Modify: `src/components/FeaturedProjectCard.tsx`

- [ ] **Step 1: Import the reveal hook**

At the top, add: `import useInView from "../hooks/useInView";` (keep existing imports of `FaPlay`, `FaChevronDown`, and the `FeaturedProject` type).

- [ ] **Step 2: Wire a per-card reveal**

Inside `FeaturedProjectCard`, before the return, add:

```tsx
const [ref, inView] = useInView(0.12);
```

On the root `<article>`, add the ref and reveal classes (restrained fade-up, no scale):

```tsx
<article
  ref={ref}
  className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-500 ${
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
```

- [ ] **Step 3: Wrap the deep content in a card-level expander**

Currently the card renders, in order: header, demo video, "What it does", Architecture (with nested detail), Key design decisions, Stack. Keep header + demo video + "What it does" always visible. Wrap the **Architecture section, the Key design decisions section, and the Stack section** in a single `<details>` placed after the "What it does" `<section>`:

```tsx
<details className="group">
  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
    <span className="font-semibold text-violet-600 text-sm uppercase tracking-wider">
      Show full breakdown
    </span>
    <FaChevronDown
      className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
      aria-hidden="true"
    />
  </summary>

  <div className="mt-6">
    {/* MOVE HERE: the existing Architecture <section>, the Key design
        decisions <section>, and the Stack <section>, unchanged except for
        Step 4's diagram tweak. */}
  </div>
</details>
```

Move the three existing `<section>` blocks (Architecture, Key design decisions, Stack) inside that `<div className="mt-6">`. Remove the `mb-8` from whichever moved section is now last (Stack has no `mb`, so leave as is) to avoid a trailing gap; the "What it does" section keeps its `mb-8` to separate it from the summary.

- [ ] **Step 4: Make the dense detail diagram legible on mobile**

In the nested `detailDiagram` block, change the inner image container and image so it can pan horizontally on small screens instead of squishing. Replace:

```tsx
<div className="px-4 pb-4 overflow-x-auto">
  <img
    src={project.detailDiagram.src}
    alt={project.detailDiagram.alt}
    className="w-full h-auto mx-auto"
    loading="lazy"
  />
</div>
```

with:

```tsx
<div className="px-4 pb-4 overflow-x-auto">
  <img
    src={project.detailDiagram.src}
    alt={project.detailDiagram.alt}
    className="h-auto mx-auto min-w-[760px] sm:min-w-0 sm:w-full"
    loading="lazy"
  />
</div>
```

- [ ] **Step 5: Build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; `0 errors`. (The `index` prop on `FeaturedProjectCard` is still used by the header "Featured · NN" label; do not remove it.)

- [ ] **Step 6: Manual check**

Featured cards are short by default (header + video + what it does + a "Show full breakdown" bar). Expanding reveals architecture, design decisions, and stack. The dense Jobs Desktop diagram (inside the nested "Full architecture (detail)") is pannable and legible on a phone. Cards fade up as they scroll in and stay visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/FeaturedProjectCard.tsx
git commit -m "feat: compact featured cards with full-breakdown expander + reveal"
```

---

## Task 11: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build + lint**

Run: `yarn build && yarn lint`
Expected: build succeeds; lint `0 errors` and no more than the 6 pre-existing warnings.

- [ ] **Step 2: Manual sweep at 375px and desktop**

`yarn dev`. Verify, top to bottom:
- Hero: no load flash, fills viewport, icons/buttons reachable.
- About/Skills/Contact: reveals are fast (<~0.7s total) and stay visible on fast scroll.
- Experience: mobile left rail + dots; dates read "... to ..."; desktop alternating layout intact.
- Work: featured cards compact by default, expand works, dense diagram pannable on mobile; More work cards stack on mobile with a lively staggered reveal.
- No horizontal scroll at 320–414px.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin feature/mobile-and-animation
```

(Do not add any Claude Code attribution to commits or the eventual PR.)

---

## Notes for the implementer

- No `prefers-reduced-motion` handling this pass (explicit user decision).
- No new dependencies. CSS `transform`/`transition` only.
- Do not rewrite or force-push `main` history.
- Tailwind `md` is `>=768px`; the old JS used `<=768` for mobile. The 1px boundary difference at exactly 768 is intentional and acceptable.
