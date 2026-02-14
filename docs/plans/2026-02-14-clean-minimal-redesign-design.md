# Clean Minimal Portfolio Redesign

## Goal

Overhaul the portfolio from a dark purple/pink glassmorphism theme to a clean, minimal, bright design with subtle gradient accents. Keep the 3D MacBook model and all existing content. Fix layout by removing forced 100vh heights and letting content breathe.

## Design Decisions

- **Approach**: Full bright overhaul (consistent light theme throughout)
- **Vibe**: Clean minimal (Apple/Linear style)
- **Colors**: White base with soft purple-to-pink gradient decorative touches
- **Layout**: Keep all 6 sections, remove forced heights, add generous whitespace
- **Hero**: Side-by-side split layout (text left, 3D model right)

## Color Palette

| Element | Value | Usage |
|---------|-------|-------|
| Background primary | `#ffffff` | Main page background |
| Background alternate | `#f5f5f7` | Alternating section backgrounds |
| Text primary | `#1a1a2e` | Headings, main text |
| Text secondary | `#6b7280` | Body text, descriptions |
| Accent primary | `#7c3aed` | Links, buttons, interactive elements |
| Accent gradient (light) | `#ede9fe` to `#fce7f3` | Decorative section backgrounds |
| Borders | `#e5e7eb` | Cards, containers, dividers |
| Cards | `#ffffff` | White with shadow-sm and border-gray-100 |
| Navbar | `white/80 + backdrop-blur` | With bottom border-gray-200 |

## Section-by-Section Changes

### Hero Section
- Split into 2-column layout: text left, 3D MacBook right
- Left: large bold name, role/title, 1-2 line intro, CTA buttons
- Right: interactive 3D MacBook with orbit controls
- Remove typing animation popup; show intro text immediately
- Keep min-h-screen for hero only
- Soft decorative gradient blob in background
- 3D adjustments: brighter Environment preset, lighter canvas bg, increased ambient light

### About Section
- Remove gradient-border box
- Clean typography: lead paragraph + body text
- Quote highlight with left-border accent (border-l-4 border-violet-400)
- Natural height with py-24 padding

### Experience Section
- Keep timeline layout
- White cards with subtle shadow and gray border
- Timeline line: bg-violet-200
- Timeline dots: bg-violet-500
- Natural height, generous spacing

### Projects Section
- Keep 2-column grid
- White cards: rounded-xl, subtle shadow, image top, text below
- Hover: slight lift (hover:-translate-y-1 hover:shadow-md) instead of 3D tilt
- Tech stack as small rounded pill badges
- Modal: light theme, white background

### Skills Section
- Keep 3-column category grid
- White cards with border, icon + name
- Category headers with violet accent underline
- Soft gradient section background (from-white to-violet-50/50)

### Contact Section
- Clean layout with larger icons
- Outlined or filled violet buttons
- Subtle gradient background

### Navbar
- bg-white/80 backdrop-blur-md border-b border-gray-200
- Dark text, violet active indicator
- Mobile hamburger styled for light theme

### Animations
- Keep fade-in-on-scroll (opacity + translateY)
- Remove glow/neon effects
- Scroll arrow styled in violet (no glow)
- Transitions: 200-500ms, smooth
