# 3D Marble Survival Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the MacBook 3D showcase with an interactive neon marble survival game where visitors dodge obstacles and survive as long as possible.

**Architecture:** Single MarbleGame.tsx component containing all game logic (physics world, marble, platform, obstacles, game state, UI overlays). ShowcaseSection.tsx updated to render MarbleGame instead of Scene3D. Uses @react-three/rapier v1.x for physics (compatible with React 18 + Fiber 8.x).

**Tech Stack:** React Three Fiber 8.x, @react-three/rapier 1.x, @react-three/drei 9.x, Three.js 0.162

---

### Task 1: Install @react-three/rapier dependency

**Files:**
- Modify: `package.json`

**Step 1: Install rapier**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm install @react-three/rapier@^1.0.0`

Expected: Package installs successfully. package.json updated with `@react-three/rapier` in dependencies.

**Step 2: Verify installation**

Run: `cd /Users/ericakim/Projects/yoohyunk && npx tsc --noEmit 2>&1 | head -20`

Expected: No new TypeScript errors from rapier.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @react-three/rapier for marble game physics"
```

---

### Task 2: Create MarbleGame component

**Files:**
- Create: `src/components/MarbleGame.tsx`

**Step 1: Create MarbleGame.tsx with complete game implementation**

Create `src/components/MarbleGame.tsx` with the following structure:

```tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider, BallCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

// ─── Constants ───────────────────────────────────────────────────────────
const PLATFORM_SIZE = 10;
const MARBLE_RADIUS = 0.3;
const FORCE_STRENGTH = 5;
const INITIAL_SPAWN_INTERVAL = 2000; // ms
const MIN_SPAWN_INTERVAL = 400; // ms
const SPAWN_INTERVAL_DECREASE = 50; // ms decrease per spawn
const INITIAL_OBSTACLE_SPEED = 3;
const SPEED_INCREASE_RATE = 0.1; // per second
const FALL_THRESHOLD = -5;

// ─── Types ───────────────────────────────────────────────────────────────
interface Obstacle {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  scale: [number, number, number];
}

type GameState = "idle" | "playing" | "gameover";

// ─── Neon Grid Platform ─────────────────────────────────────────────────
function Platform() {
  // Dark platform with neon purple grid lines
  // Use a plane geometry with a custom grid shader or drei's Grid
  return (
    <RigidBody type="fixed" position={[0, -0.5, 0]}>
      <CuboidCollider args={[PLATFORM_SIZE / 2, 0.5, PLATFORM_SIZE / 2]} />
      <mesh receiveShadow>
        <boxGeometry args={[PLATFORM_SIZE, 1, PLATFORM_SIZE]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Grid lines overlay */}
      <gridHelper
        args={[PLATFORM_SIZE, 20, "#7c3aed", "#4c1d95"]}
        position={[0, 0.51, 0]}
      />
    </RigidBody>
  );
}

// ─── Glowing Marble ─────────────────────────────────────────────────────
function Marble({
  marbleRef,
  gameState,
}: {
  marbleRef: React.RefObject<RapierRigidBody | null>;
  gameState: GameState;
}) {
  // Metallic sphere with purple/pink emissive glow
  return (
    <RigidBody
      ref={marbleRef}
      position={[0, 1, 0]}
      colliders="ball"
      restitution={0.3}
      friction={0.8}
      linearDamping={0.5}
      angularDamping={0.5}
      type={gameState === "playing" ? "dynamic" : "fixed"}
    >
      <mesh castShadow>
        <sphereGeometry args={[MARBLE_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[MARBLE_RADIUS * 1.3, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>
    </RigidBody>
  );
}

// ─── Obstacle Block ─────────────────────────────────────────────────────
function ObstacleBlock({ obstacle }: { obstacle: Obstacle }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (ref.current) {
      const pos = ref.current.translation();
      ref.current.setNextKinematicTranslation({
        x: pos.x + obstacle.velocity[0] * 0.016,
        y: pos.y,
        z: pos.z + obstacle.velocity[2] * 0.016,
      });
    }
  });

  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      position={obstacle.position}
    >
      <CuboidCollider
        args={[
          obstacle.scale[0] / 2,
          obstacle.scale[1] / 2,
          obstacle.scale[2] / 2,
        ]}
      />
      <mesh castShadow>
        <boxGeometry args={obstacle.scale} />
        <meshStandardMaterial
          color={obstacle.color}
          emissive={obstacle.color}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </RigidBody>
  );
}

// ─── Edge Walls (invisible sensors to detect falling off) ───────────────
function EdgeSensor({ onFall }: { onFall: () => void }) {
  return (
    <RigidBody type="fixed" position={[0, -3, 0]} sensor>
      <CuboidCollider
        args={[50, 1, 50]}
        onIntersectionEnter={(e) => {
          // Check if the marble fell
          onFall();
        }}
      />
    </RigidBody>
  );
}

// ─── Keyboard Controls ──────────────────────────────────────────────────
function useKeyboardControls() {
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      // Prevent arrow key scrolling
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return keys;
}

// ─── Touch Controls ─────────────────────────────────────────────────────
function useTouchControls(canvasRef: React.RefObject<HTMLDivElement | null>) {
  const touchForce = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      const maxDrag = 100;
      touchForce.current = {
        x: Math.max(-1, Math.min(1, dx / maxDrag)),
        z: Math.max(-1, Math.min(1, dy / maxDrag)),
      };
    };

    const onTouchEnd = () => {
      touchStart.current = null;
      touchForce.current = { x: 0, z: 0 };
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]);

  return touchForce;
}

// ─── Game Logic (inside Canvas) ─────────────────────────────────────────
function GameWorld({
  gameState,
  setGameState,
  setTime,
  isMobile,
  canvasRef,
}: {
  gameState: GameState;
  setGameState: (s: GameState) => void;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const marbleRef = useRef<RapierRigidBody>(null);
  const keys = useKeyboardControls();
  const touchForce = useTouchControls(canvasRef);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstacleIdRef = useRef(0);
  const spawnIntervalRef = useRef(INITIAL_SPAWN_INTERVAL);
  const gameTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);

  // Reset game
  useEffect(() => {
    if (gameState === "playing") {
      setObstacles([]);
      obstacleIdRef.current = 0;
      spawnIntervalRef.current = INITIAL_SPAWN_INTERVAL;
      gameTimeRef.current = 0;
      lastSpawnRef.current = 0;
      setTime(0);
      // Reset marble position
      if (marbleRef.current) {
        marbleRef.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
        marbleRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        marbleRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  }, [gameState, setTime]);

  const handleGameOver = useCallback(() => {
    if (gameState === "playing") {
      setGameState("gameover");
    }
  }, [gameState, setGameState]);

  // Spawn obstacles and apply controls each frame
  useFrame((_, delta) => {
    if (gameState !== "playing") return;

    // Update timer
    gameTimeRef.current += delta;
    setTime(gameTimeRef.current);

    // Check if marble fell off
    if (marbleRef.current) {
      const pos = marbleRef.current.translation();
      if (pos.y < FALL_THRESHOLD) {
        handleGameOver();
        return;
      }

      // Apply keyboard forces
      const force = { x: 0, y: 0, z: 0 };
      const k = keys.current;
      if (k.has("arrowleft") || k.has("a")) force.x = -FORCE_STRENGTH;
      if (k.has("arrowright") || k.has("d")) force.x = FORCE_STRENGTH;
      if (k.has("arrowup") || k.has("w")) force.z = -FORCE_STRENGTH;
      if (k.has("arrowdown") || k.has("s")) force.z = FORCE_STRENGTH;

      // Apply touch forces
      if (isMobile) {
        force.x += touchForce.current.x * FORCE_STRENGTH;
        force.z += touchForce.current.z * FORCE_STRENGTH;
      }

      if (force.x !== 0 || force.z !== 0) {
        marbleRef.current.applyImpulse(force, true);
      }
    }

    // Spawn obstacles
    const now = gameTimeRef.current * 1000;
    if (now - lastSpawnRef.current > spawnIntervalRef.current) {
      lastSpawnRef.current = now;

      // Decrease spawn interval over time
      spawnIntervalRef.current = Math.max(
        MIN_SPAWN_INTERVAL,
        spawnIntervalRef.current - SPAWN_INTERVAL_DECREASE
      );

      const speed = INITIAL_OBSTACLE_SPEED + gameTimeRef.current * SPEED_INCREASE_RATE;
      const side = Math.floor(Math.random() * 4); // 0=left, 1=right, 2=top, 3=bottom
      const offset = (Math.random() - 0.5) * PLATFORM_SIZE * 0.8;
      const colors = ["#ec4899", "#3b82f6", "#8b5cf6", "#06b6d4"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const height = 0.5 + Math.random() * 1;
      const width = 0.5 + Math.random() * 1.5;

      let position: [number, number, number];
      let velocity: [number, number, number];

      switch (side) {
        case 0: // from left
          position = [-(PLATFORM_SIZE / 2 + 2), height / 2 + 0.1, offset];
          velocity = [speed, 0, 0];
          break;
        case 1: // from right
          position = [PLATFORM_SIZE / 2 + 2, height / 2 + 0.1, offset];
          velocity = [-speed, 0, 0];
          break;
        case 2: // from top
          position = [offset, height / 2 + 0.1, -(PLATFORM_SIZE / 2 + 2)];
          velocity = [0, 0, speed];
          break;
        default: // from bottom
          position = [offset, height / 2 + 0.1, PLATFORM_SIZE / 2 + 2];
          velocity = [0, 0, -speed];
          break;
      }

      const newObstacle: Obstacle = {
        id: obstacleIdRef.current++,
        position,
        velocity,
        color,
        scale: [width, height, width],
      };

      setObstacles((prev) => {
        // Remove obstacles that have traveled far enough
        const filtered = prev.filter((o) => {
          const dist = Math.abs(o.position[0]) + Math.abs(o.position[2]);
          return dist < PLATFORM_SIZE * 3;
        });
        return [...filtered, newObstacle];
      });
    }
  });

  return (
    <>
      {/* Camera */}
      <CameraSetup isMobile={isMobile} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#a855f7" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ec4899" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />

      {/* Scene */}
      <color attach="background" args={["#0a0a0c"]} />
      <fog attach="fog" args={["#0a0a0c", 15, 30]} />

      <Physics gravity={[0, -9.81, 0]}>
        <Platform />
        <Marble marbleRef={marbleRef} gameState={gameState} />
        {obstacles.map((o) => (
          <ObstacleBlock key={o.id} obstacle={o} />
        ))}
        <EdgeSensor onFall={handleGameOver} />
      </Physics>
    </>
  );
}

// ─── Camera ─────────────────────────────────────────────────────────────
function CameraSetup({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    const height = isMobile ? 14 : 12;
    const zOffset = isMobile ? 8 : 6;
    camera.position.set(0, height, zOffset);
    camera.lookAt(0, 0, 0);
  }, [camera, isMobile]);
  return null;
}

// ─── Main Export ────────────────────────────────────────────────────────
export default function MarbleGame({ isMobile }: { isMobile: boolean }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const startGame = () => setGameState("playing");
  const restartGame = () => setGameState("playing");

  return (
    <div ref={canvasRef} className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas dpr={[1, Math.min(2, window.devicePixelRatio)]} performance={{ min: 0.5 }}>
        <GameWorld
          gameState={gameState}
          setGameState={setGameState}
          setTime={setTime}
          isMobile={isMobile}
          canvasRef={canvasRef}
        />
      </Canvas>

      {/* Timer overlay */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {time.toFixed(1)}s
          </span>
        </div>
      )}

      {/* Idle / Start screen */}
      {gameState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Marble Survival
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {isMobile ? "Touch & drag to move" : "WASD or Arrow Keys to move"}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Play
          </button>
        </div>
      )}

      {/* Game Over screen */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Game Over</h3>
          <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            {time.toFixed(1)}s
          </p>
          <button
            onClick={restartGame}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
```

Key implementation details:
- `GameState`: "idle" (show start screen) → "playing" (active game) → "gameover" (show score)
- `Platform`: RigidBody fixed box with gridHelper overlay for neon grid lines
- `Marble`: RigidBody dynamic ball with emissive purple material + outer glow sphere
- `ObstacleBlock`: RigidBody kinematicPosition, moved via setNextKinematicTranslation each frame
- `EdgeSensor`: Invisible sensor below platform to detect falling off
- `useKeyboardControls`: Tracks pressed keys, prevents arrow key page scrolling
- `useTouchControls`: Touch-drag calculates force direction normalized to [-1, 1]
- `GameWorld`: Main useFrame loop handles timer, controls, obstacle spawning, fall detection
- `CameraSetup`: Fixed top-down angled view (y=12, z=6, looking at origin)
- Difficulty ramp: spawn interval decreases by 50ms per spawn (min 400ms), speed increases 0.1/sec
- Obstacles spawn from all 4 edges at random positions, random size/color
- Collision detection via rapier physics (marble hitting kinematic obstacle bodies)
- HTML overlays for timer, start screen, game over screen with gradient text matching site theme

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/ericakim/Projects/yoohyunk && npx tsc --noEmit 2>&1 | head -30`

Expected: No errors from MarbleGame.tsx (or minor type adjustments needed).

**Step 3: Commit**

```bash
git add src/components/MarbleGame.tsx
git commit -m "feat: create MarbleGame component with physics and neon visuals"
```

---

### Task 3: Update ShowcaseSection to use MarbleGame

**Files:**
- Modify: `src/pages/ShowcaseSection.tsx`

**Step 1: Replace Scene3D with MarbleGame**

Replace the entire contents of `ShowcaseSection.tsx` with:

```tsx
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
```

Changes from original:
- Removed Canvas, OrbitControls, Scene3D, Suspense imports
- Import MarbleGame instead
- Removed Canvas wrapper — MarbleGame has its own Canvas
- Changed tagline from "Built with passion" to "Take a break, play a game"
- Kept all existing intersection observer and mobile detection logic

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/ericakim/Projects/yoohyunk && npx tsc --noEmit 2>&1 | head -30`

Expected: Clean compilation.

**Step 3: Verify build**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm run build 2>&1 | tail -10`

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/pages/ShowcaseSection.tsx
git commit -m "feat: replace MacBook showcase with marble survival game"
```

---

### Task 4: Fix collision detection for game over

**Files:**
- Modify: `src/components/MarbleGame.tsx`

The initial implementation uses rapier's built-in collision between the dynamic marble and kinematic obstacles. However, rapier v1.x collision events between dynamic and kinematic bodies may need explicit contact event configuration. This task ensures collision detection works correctly:

**Step 1: Test the game in browser**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm run dev`

Open browser, scroll to game section, click Play, and verify:
- Marble moves with WASD/arrows
- Obstacles spawn and move across
- Collision with obstacle triggers game over
- Falling off edge triggers game over

**Step 2: Fix any collision issues**

If marble passes through obstacles without triggering game over, add `onContactForce` or `onCollisionEnter` to the Marble RigidBody to detect hits:

```tsx
// In Marble component, add onCollisionEnter to RigidBody:
<RigidBody
  ref={marbleRef}
  ...
  onCollisionEnter={(e) => {
    // If collided with an obstacle (not the platform), trigger game over
    // Obstacles have kinematicPosition type
    if (e.other.rigidBodyObject?.userData?.isObstacle) {
      onHit();
    }
  }}
>
```

And add `userData={{ isObstacle: true }}` to obstacle meshes, plus pass `onHit` callback through to Marble.

**Step 3: Verify fixes work**

Test in browser again. Confirm collision triggers game over.

**Step 4: Commit**

```bash
git add src/components/MarbleGame.tsx
git commit -m "fix: ensure marble-obstacle collision triggers game over"
```

---

### Task 5: Final polish and build verification

**Files:**
- Verify: `src/components/MarbleGame.tsx`
- Verify: `src/pages/ShowcaseSection.tsx`

**Step 1: TypeScript check**

Run: `cd /Users/ericakim/Projects/yoohyunk && npx tsc --noEmit`

Expected: Clean, no errors.

**Step 2: Production build**

Run: `cd /Users/ericakim/Projects/yoohyunk && npm run build`

Expected: Build succeeds with no errors.

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final marble game polish and verification"
```
