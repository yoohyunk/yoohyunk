# Mobile polish + animation pass — design

Date: 2026-06-11
Branch: `feature/mobile-and-animation` (based on `origin/main` @ e3a37c6, which has the merged PR #8 work)

## Goal

Two workstreams on the existing portfolio (Vite + React 18 + Tailwind v4):

1. **Mobile**: polish layout/readability rough spots and remove the load-time
   layout flash caused by JS `isMobile` detection.
2. **Animation**: fill the gaps left after PR #8 and add tasteful liveliness,
   with the **More work** grid as the focus (it is the most static part now).

Hard constraints (from the original brief, still in force):
- Fast and clean: CSS `transform`/`transition` only. No animation libraries,
  no JS animation loops (rAF), nothing that hurts load.
- `prefers-reduced-motion` is intentionally **not** handled this pass (user
  decision). Noted as a possible later follow-up.
- No em dashes in any new copy. Keep accessibility (alt text, keyboard nav,
  tap targets) intact.
- Enhance within the existing design system (white bg, violet/`purple-600 →
  pink-500 → blue-500` gradient, rounded cards, IntersectionObserver fades).

## Current state (verified in merged code)

- Animations: every section already has a section-level fade-in-up via an
  `IntersectionObserver` + `opacity`/`translate-y` Tailwind transition.
  `ExperienceSection` reveals items individually; `SkillsSection` staggers
  cards. A reusable hook exists: `src/hooks/useInView.ts` (returns `[ref,
  isIntersecting]`).
- Gaps from PR #8:
  - `FeaturedProjectCard` (AI Task Pipeline, Jobs Desktop): no per-card entrance;
    they appear with the section.
  - `ProjectsSection` "More work" grid: no per-card stagger (the pre-PR version
    had it; the rewrite dropped it). This is the part that reads as too plain.
- `isMobile` via `window.innerWidth` + resize listener (state starts `false`,
  so a wrong-layout frame flashes on load) lives in:
  - `HeroSection.tsx` — drives section height and heading text size.
  - `ScrollArrow.tsx` — drives bottom offset, button/icon size, and the
    click-time scroll offset (60 vs 80).
  - `ProjectModal.tsx` — drives full-screen vs centered modal and many sizes.
- Mobile rough spots:
  - "More work" cards use a fixed `flex` `w-1/3` image + `w-2/3` text at all
    widths, cramped on narrow phones.
  - `ExperienceSection` on mobile is a vertical stack of floating cards (the
    center rail is `hidden md:block`); large `space-y-16`; date pill uses an
    em dash separator.
  - The dense `jobapp-architecture.svg` (1480 wide) inside the collapsible
    `<details>` squishes to unreadable on phones.
  - Hero icon links have a small tap target (icon-sized, no padding).

## A. Mobile de-flash refactor

Approach: replace `isMobile` state + resize listeners with Tailwind `md:`
responsive classes. Breakpoint maps `<=768` (JS mobile) to Tailwind `md`
(`>=768` desktop); the one-pixel difference at exactly 768 is negligible.

- **HeroSection.tsx**: remove `isMobile` state + resize effect.
  - Height: `h-[calc(100dvh-56px)] md:h-screen` (and matching `min-h-*`), via
    Tailwind arbitrary values, replacing the inline `style` height.
  - Heading: `text-5xl md:text-7xl lg:text-8xl`. Sub copy: `text-base md:text-lg`.
  - Keep the existing CSS gradient-mesh background and the fade-in transitions.
- **ScrollArrow.tsx**: remove `isMobile` state + resize effect.
  - `bottom-6 md:bottom-12`, button `w-12 h-12 md:w-14 md:h-14`, icon
    `w-7 h-7 md:w-8 md:h-8`.
  - Scroll offset: compute `window.innerWidth < 768 ? 60 : 80` inline inside the
    click handler (runs on click only, so no render flash, no state needed).
- **ProjectModal.tsx**: remove `isMobile` state + resize effect; keep the
  `document.body.overflow` lock effect.
  - Container `p-0 md:p-4`; box `w-full h-full rounded-none md:max-w-2xl
    md:h-auto md:max-h-[80vh] md:rounded-xl`.
  - Image heights, close-button size, paddings, text sizes → `md:` classes.
  - Mobile-only gradient overlay → `md:hidden`.
  - Icon sizing via `className` (e.g. `w-5 h-5 md:w-4 md:h-4`) instead of the JS
    `size` prop, so it is responsive without `isMobile`.

## B. Mobile layout polish

- **More work cards (ProjectsSection)**: `flex flex-col sm:flex-row`; image
  `w-full h-40 sm:w-1/3 sm:h-auto`; content `w-full sm:w-2/3`. Full-width image
  on top for phones, side-by-side from `sm`.
- **Experience timeline (ExperienceSection)**: add a mobile left rail.
  - A vertical gradient line pinned left on mobile (`md:` keeps the existing
    centered alternating layout). Each item gets a small dot on the rail and
    left padding so cards sit to the right of the line.
  - `space-y-8 md:space-y-16` to tighten mobile rhythm.
  - Replace the date-pill em dash separator with `to` (also satisfies the
    no-em-dash preference). Example: `2026-02 to Present`.
- **Dense architecture diagram (FeaturedProjectCard)**: wrap the detail `<img>`
  so it stays legible on phones: container `overflow-x-auto`, img
  `min-w-[760px] sm:min-w-0 w-full h-auto` so it can be panned horizontally on
  small screens instead of squishing. (The glance and pipeline diagrams already
  fit; leave them.)
- **Hero icon links**: enlarge hit area with `p-2 -m-2` (no visual change).
- **Overflow audit**: confirm no horizontal scroll at 320–414px widths; body
  already has `overflow-x-hidden`.

## C. Animation pass

Mechanism: reuse `useInView` + Tailwind transition classes. No new deps.

- **More work grid (liveliness focus)**: each card reveals with **fade + slide
  up + subtle scale (0.97 → 1)**, staggered ~80–100ms per card by index,
  triggered when the grid enters view. Slightly richer than a plain fade so the
  section feels alive. Hover stays as is (shadow + lift + image zoom).
  - Implementation: observe the grid container (or reuse section `isVisible`)
    and apply per-card `transitionDelay` by index, plus the
    `opacity/translate-y/scale` classes.
- **Featured cards**: each card self-reveals via `useInView` (they are large and
  far apart, like Experience items), with a more restrained fade-up (no scale),
  so the centerpiece reads as composed rather than bouncy.
- Durations/easing consistent with the site (`duration-500`–`700`, ease-out,
  `translate-y` 6–10px).

## Components touched

`HeroSection.tsx`, `ScrollArrow.tsx`, `ProjectModal.tsx`, `ProjectsSection.tsx`,
`FeaturedProjectCard.tsx`, `ExperienceSection.tsx`. Reuse `hooks/useInView.ts`.
No data or copy changes except the Experience date separator. No new
dependencies.

## Verification

- `yarn build` clean, `yarn lint` 0 errors (6 pre-existing ref-cleanup warnings
  are acceptable; do not introduce new ones).
- Manual check at mobile widths (375px) and desktop: no load flash on Hero, no
  horizontal overflow, More work cards stack, Experience rail renders, featured
  and More work animations fire on scroll.

## Out of scope

Reduced-motion handling; any content/copy rewrites; restructuring sections;
touching the merged main history.
