# Apple + SaaS Hybrid Portfolio Redesign

## Goal

Overhaul the portfolio from a basic light theme with color swaps into a dramatic, impactful Apple-style design with SaaS landing page patterns. Massive typography, gradient text headings, full-screen sections, animated gradient mesh hero, bento grid projects, and a dark 3D showcase section.

## Design Decisions

- **Vibe**: Apple editorial + modern SaaS (Linear/Vercel)
- **Hero**: Full-screen centered, animated gradient mesh background, massive gradient text name
- **3D**: Dedicated full-screen dark section below hero (product reveal feel)
- **Gradients**: Gradient text on all section headings (purple-to-pink-to-blue)
- **Layout**: Full-width dramatic sections, bento grid for projects, alternating rows for experience
- **Sections**: Hero, 3D Showcase, About, Experience, Projects, Skills, Contact (7 total)

## Color Palette

| Element | Value | Usage |
|---------|-------|-------|
| Background primary | `#ffffff` | Most sections |
| Background dark | `#0a0a0c` | 3D showcase section |
| Background alternate | `#fafafa` | Skills section |
| Text primary | `#1a1a2e` | Headings (non-gradient), main text |
| Text secondary | `#6b7280` | Body text, descriptions |
| Gradient text | `from-purple-600 via-pink-500 to-blue-500` | All section headings |
| Accent | `#7c3aed` (violet-600) | Buttons, interactive elements |
| Cards | `#ffffff` | rounded-2xl, shadow-sm, border-gray-100 |
| Navbar | `white/80 + backdrop-blur` | Active indicator = gradient underline |

## Typography Scale

| Element | Size | Weight |
|---------|------|--------|
| Hero name | `text-6xl md:text-8xl` | `font-bold` |
| Hero subtitle | `text-xl md:text-2xl` | `font-normal` |
| Section headings | `text-4xl md:text-6xl` | `font-bold` + gradient |
| Card titles | `text-xl md:text-2xl` | `font-semibold` |
| Body text | `text-base md:text-lg` | `font-normal` |

## Section-by-Section Design

### Hero Section
- Full-screen (`min-h-screen`) centered content on white
- Animated gradient mesh background: 3-4 soft blobs (purple, pink, blue) with CSS keyframe animation, slowly drifting. Pure CSS, no library.
- "Erica Kim" in massive bold gradient text (`bg-clip-text text-transparent`)
- "Full-Stack Developer" subtitle in `text-gray-500`
- One-liner description
- Two pill CTA buttons: "View Projects" (filled violet) and "Contact Me" (outlined)
- Both buttons have subtle hover glow effect
- Animated scroll chevron at bottom

### 3D Showcase Section
- Full-screen, dark background (`bg-[#0a0a0c]`)
- Creates dramatic light-to-dark-to-light scroll transition
- Tagline above model: "Built with passion" in gradient text (smaller, `text-2xl`)
- MacBook centered, larger scale than before
- Orbit controls enabled
- Environment preset stays "apartment" for good reflections on dark bg

### About Section
- White background, `py-32` for dramatic whitespace
- Lead sentence in large gradient text (`text-2xl md:text-3xl font-semibold`)
- Supporting paragraphs in `text-gray-500`, generous `leading-relaxed`
- Quote block with thick gradient left-border (`border-l-4` with gradient via pseudo-element or inline gradient div)
- Max-width container for readability

### Experience Section
- Alternating left-right layout (Apple feature rows)
- Each experience: large card (~60% width), alternating sides
- Role title bold and large, company name below, date as subtle pill badge
- Bullet points cleanly styled
- Cards: `bg-white rounded-2xl shadow-sm border border-gray-100` with `hover:shadow-md hover:-translate-y-1`
- Thin decorative gradient vertical line connecting cards (centered)
- Staggered scroll entrance animations

### Projects Section
- Bento grid layout: 1 large featured (2-col span) + remaining cards
- Large card: big screenshot, gradient title, tech pills, hover overlay
- Smaller cards: title + summary + tech pills, hover scale + shadow
- All cards: `rounded-2xl shadow-sm` with hover lift
- Project titles in gradient text
- Click opens restyled modal (white bg, gradient title, clean layout)

### Skills Section
- Background `#fafafa` for subtle contrast
- Category headers in gradient text
- Icon grid: 4-column on desktop, 2-column on mobile
- Each skill: icon centered in `rounded-xl` card, `bg-white shadow-sm`
- Hover: scale up slightly + shadow increase + subtle glow
- Skill name below icon in small text

### Contact Section
- White background, centered
- "Let's Connect" in large gradient text
- Three large rounded-full icon buttons in a row
- Each button: icon + label text, `border border-gray-200`, hover with scale + gradient border glow
- Clean and impactful spacing

### Navbar
- Keep white/blur existing style
- Active indicator changes to gradient underline (matching the gradient text theme)

### Animations
- Scroll-triggered fade-up reveals on all sections (keep existing IntersectionObserver pattern)
- Staggered card entrances for bento grid and skills grid
- Hover microinteractions: scale(1.02-1.05), shadow increase, subtle glow on buttons
- Hero gradient mesh: continuous slow CSS animation (60s+ cycle)
