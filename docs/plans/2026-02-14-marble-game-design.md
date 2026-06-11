# 3D Marble Survival Game Design

## Goal

Replace the 3D MacBook showcase section with an interactive 3D marble survival game. Visitors roll a glowing neon marble on a dark platform, dodging obstacles that spawn at increasing speed. Timer tracks survival time. Neon/synthwave visual style matches the dark section and purple/pink/blue gradient theme.

## Design Decisions

- **Game type**: Marble survival — dodge obstacles, survive as long as possible
- **Visual style**: Neon/synthwave on dark background (#0a0a0c)
- **Physics**: @react-three/rapier for collision detection and ball physics
- **Controls**: Arrow keys / WASD (desktop), touch-drag (mobile)
- **Scope**: Replace ShowcaseSection Canvas contents, remove MacBook/Scene3D

## Game Mechanics

- Marble spawns at center of a square platform
- Obstacles (neon blocks/pillars) spawn at edges, move across at increasing speed
- Timer counts up (seconds survived)
- Hit obstacle or fall off edge = game over
- "Play Again" button resets the game
- Difficulty ramps: obstacles spawn faster and move quicker over time

## Visual Design

| Element | Style |
|---------|-------|
| Background | `#0a0a0c` dark |
| Marble | Metallic sphere with purple/pink emissive glow |
| Platform | Dark plane with neon purple grid lines |
| Obstacles | Glowing neon boxes in pink/blue with emissive materials |
| Timer | HTML overlay, gradient text matching site theme |
| Game over | Semi-transparent overlay with score and restart button |

## Controls

- **Desktop**: Arrow keys or WASD apply force to the marble
- **Mobile**: Touch-drag on canvas applies force in drag direction
- Camera: Fixed top-down angled view looking at the platform

## Tech Stack

- React Three Fiber (existing)
- @react-three/rapier (new dependency — physics)
- @react-three/drei (existing — for text, environment)
- All game logic in a single MarbleGame component

## Components

- `MarbleGame.tsx` — Main game component with Canvas, physics world, game state
- `ShowcaseSection.tsx` — Updated to render MarbleGame instead of Scene3D
- Remove Scene3D.tsx import from ShowcaseSection (keep file for potential future use)
