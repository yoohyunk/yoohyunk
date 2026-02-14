import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";

// ─── Constants ───────────────────────────────────────────────────────────
const TRACK_WIDTH = 6;
const TRACK_LENGTH = 200;
const MARBLE_RADIUS = 0.3;
const FORWARD_SPEED = 8;
const MAX_FORWARD_SPEED = 14;
const SPEED_RAMP = 0.3; // speed increase per second
const STRAFE_FORCE = 2;
const MAX_STRAFE_SPEED = 5;
const JUMP_IMPULSE = 4;
const GROUND_THRESHOLD = 0.5; // marble y below this = grounded
const FALL_THRESHOLD = -3;
const OBSTACLE_HEIGHT = 1;
const LOW_BARRIER_HEIGHT = 0.4;

// ─── Types ───────────────────────────────────────────────────────────────
interface CourseObstacle {
  id: number;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
}

type GameState = "idle" | "playing" | "gameover" | "win";

// ─── Course Generation ──────────────────────────────────────────────────
function generateCourse(seed: number): CourseObstacle[] {
  const obstacles: CourseObstacle[] = [];
  let id = 0;
  const colors = ["#ec4899", "#3b82f6", "#8b5cf6", "#06b6d4"];
  // Simple seeded random
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // Generate obstacle rows along the track
  for (let z = 15; z < TRACK_LENGTH - 10; z += 4 + rand() * 3) {
    const pattern = Math.floor(rand() * 6);
    const color = colors[Math.floor(rand() * colors.length)];
    const difficulty = Math.min(1, z / TRACK_LENGTH); // 0 to 1

    switch (pattern) {
      case 0: {
        // Wall with gap — gap gets narrower as difficulty increases
        const gapWidth = 2.2 - difficulty * 0.8;
        const gapCenter = (rand() - 0.5) * (TRACK_WIDTH - gapWidth - 0.5);
        const gapLeft = gapCenter - gapWidth / 2;
        const gapRight = gapCenter + gapWidth / 2;
        const leftEdge = -TRACK_WIDTH / 2;
        const rightEdge = TRACK_WIDTH / 2;
        // Left wall
        if (gapLeft - leftEdge > 0.3) {
          const w = gapLeft - leftEdge;
          obstacles.push({
            id: id++,
            position: [leftEdge + w / 2, OBSTACLE_HEIGHT / 2, -z],
            scale: [w, OBSTACLE_HEIGHT, 0.5],
            color,
          });
        }
        // Right wall
        if (rightEdge - gapRight > 0.3) {
          const w = rightEdge - gapRight;
          obstacles.push({
            id: id++,
            position: [rightEdge - w / 2, OBSTACLE_HEIGHT / 2, -z],
            scale: [w, OBSTACLE_HEIGHT, 0.5],
            color,
          });
        }
        break;
      }
      case 1: {
        // Two blocks on sides, dodge through middle
        const blockW = 1 + rand() * (1 + difficulty);
        obstacles.push({
          id: id++,
          position: [-TRACK_WIDTH / 2 + blockW / 2, OBSTACLE_HEIGHT / 2, -z],
          scale: [blockW, OBSTACLE_HEIGHT, 0.6],
          color,
        });
        obstacles.push({
          id: id++,
          position: [TRACK_WIDTH / 2 - blockW / 2, OBSTACLE_HEIGHT / 2, -z],
          scale: [blockW, OBSTACLE_HEIGHT, 0.6],
          color,
        });
        break;
      }
      case 2: {
        // Single block offset to one side
        const side = rand() > 0.5 ? 1 : -1;
        const w = 1.5 + rand() * (1 + difficulty);
        obstacles.push({
          id: id++,
          position: [side * (TRACK_WIDTH / 2 - w / 2), OBSTACLE_HEIGHT / 2, -z],
          scale: [w, OBSTACLE_HEIGHT, 0.6],
          color,
        });
        break;
      }
      case 3: {
        // Zigzag — two blocks staggered
        const w = 1.2 + difficulty * 0.8;
        obstacles.push({
          id: id++,
          position: [-TRACK_WIDTH / 4, OBSTACLE_HEIGHT / 2, -z],
          scale: [w, OBSTACLE_HEIGHT, 0.5],
          color,
        });
        obstacles.push({
          id: id++,
          position: [TRACK_WIDTH / 4, OBSTACLE_HEIGHT / 2, -(z + 2.5)],
          scale: [w, OBSTACLE_HEIGHT, 0.5],
          color,
        });
        z += 2;
        break;
      }
      case 4: {
        // Center block — dodge to either side
        const w = 1.5 + rand() * difficulty * 1.5;
        obstacles.push({
          id: id++,
          position: [0, OBSTACLE_HEIGHT / 2, -z],
          scale: [w, OBSTACLE_HEIGHT, 0.6],
          color,
        });
        break;
      }
      case 5: {
        // Full-width low barrier — must jump over
        obstacles.push({
          id: id++,
          position: [0, LOW_BARRIER_HEIGHT / 2, -z],
          scale: [TRACK_WIDTH, LOW_BARRIER_HEIGHT, 0.5],
          color: "#f59e0b",
        });
        break;
      }
    }
  }

  return obstacles;
}

// ─── Track Segments ─────────────────────────────────────────────────────
function Track() {
  const segmentLength = 20;
  const segments = Math.ceil(TRACK_LENGTH / segmentLength);

  return (
    <>
      {Array.from({ length: segments }).map((_, i) => (
        <RigidBody
          key={i}
          type="fixed"
          position={[0, -0.5, -(i * segmentLength + segmentLength / 2)]}
        >
          <CuboidCollider args={[TRACK_WIDTH / 2, 0.5, segmentLength / 2]} />
          <mesh receiveShadow>
            <boxGeometry args={[TRACK_WIDTH, 1, segmentLength]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <gridHelper
            args={[Math.min(TRACK_WIDTH, segmentLength), 10, "#7c3aed", "#4c1d95"]}
            position={[0, 0.51, 0]}
            rotation={[0, 0, 0]}
          />
        </RigidBody>
      ))}
    </>
  );
}

// ─── Side Rails (visual guide, no physics) ──────────────────────────────
function SideRails() {
  const railHeight = 0.3;
  const railWidth = 0.1;

  return (
    <>
      {/* Left rail */}
      <mesh position={[-TRACK_WIDTH / 2 - railWidth / 2, railHeight / 2, -TRACK_LENGTH / 2]}>
        <boxGeometry args={[railWidth, railHeight, TRACK_LENGTH]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} />
      </mesh>
      {/* Right rail */}
      <mesh position={[TRACK_WIDTH / 2 + railWidth / 2, railHeight / 2, -TRACK_LENGTH / 2]}>
        <boxGeometry args={[railWidth, railHeight, TRACK_LENGTH]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} />
      </mesh>
    </>
  );
}

// ─── Finish Line ────────────────────────────────────────────────────────
function FinishLine({ onCross }: { onCross: () => void }) {
  return (
    <RigidBody type="fixed" position={[0, 0.5, -TRACK_LENGTH]} sensor>
      <CuboidCollider
        args={[TRACK_WIDTH / 2, 1, 0.5]}
        onIntersectionEnter={() => onCross()}
      />
      {/* Visual finish gate */}
      <mesh>
        <boxGeometry args={[TRACK_WIDTH, 2, 0.2]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </RigidBody>
  );
}

// ─── Glowing Marble ─────────────────────────────────────────────────────
function Marble({
  marbleRef,
  gameState,
  onHit,
}: {
  marbleRef: React.RefObject<RapierRigidBody | null>;
  gameState: GameState;
  onHit: () => void;
}) {
  return (
    <RigidBody
      ref={marbleRef}
      position={[0, 1, 0]}
      colliders="ball"
      restitution={0.1}
      friction={1}
      linearDamping={1.5}
      angularDamping={1}
      type={gameState === "playing" ? "dynamic" : "fixed"}
      onCollisionEnter={(e) => {
        const other = e.other.rigidBody;
        // bodyType 0 = fixed (obstacles are fixed), but track is also fixed
        // Use position check — obstacles are above the track surface
        if (other) {
          const otherPos = other.translation();
          if (otherPos.y > 0) {
            onHit();
          }
        }
      }}
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
      <mesh>
        <sphereGeometry args={[MARBLE_RADIUS * 1.3, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>
    </RigidBody>
  );
}

// ─── Course Obstacle (fixed) ────────────────────────────────────────────
function ObstacleBlock({ obstacle }: { obstacle: CourseObstacle }) {
  return (
    <RigidBody type="fixed" position={obstacle.position}>
      <CuboidCollider
        args={[obstacle.scale[0] / 2, obstacle.scale[1] / 2, obstacle.scale[2] / 2]}
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

// ─── Fall Sensor ────────────────────────────────────────────────────────
function FallSensor({ onFall }: { onFall: () => void }) {
  return (
    <RigidBody type="fixed" position={[0, FALL_THRESHOLD, -TRACK_LENGTH / 2]} sensor>
      <CuboidCollider
        args={[100, 0.5, TRACK_LENGTH]}
        onIntersectionEnter={() => onFall()}
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
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
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
  const touchForce = useRef(0); // -1 to 1 for left/right
  const jumpRequested = useRef(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;

      // Top 30% of screen = jump
      if (y < 0.3) {
        jumpRequested.current = true;
      } else {
        // Bottom 70% = steer left/right
        touchForce.current = (x - 0.5) * 2;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      touchForce.current = (x - 0.5) * 2;
    };

    const onTouchEnd = () => {
      touchForce.current = 0;
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

  return { touchForce, jumpRequested };
}

// ─── Camera Follow ──────────────────────────────────────────────────────
function CameraFollow({
  marbleRef,
  isMobile,
  gameState,
}: {
  marbleRef: React.RefObject<RapierRigidBody | null>;
  isMobile: boolean;
  gameState: GameState;
}) {
  const { camera } = useThree();
  const offsetY = isMobile ? 6 : 5;
  const offsetZ = isMobile ? 7 : 6;

  useFrame(() => {
    if (!marbleRef.current) return;
    if (gameState !== "playing") return;
    const pos = marbleRef.current.translation();
    // Smooth follow
    camera.position.x += (pos.x - camera.position.x) * 0.1;
    camera.position.y += (pos.y + offsetY - camera.position.y) * 0.1;
    camera.position.z += (pos.z + offsetZ - camera.position.z) * 0.1;
    camera.lookAt(pos.x, pos.y, pos.z - 4);
  });

  useEffect(() => {
    camera.position.set(0, offsetY, offsetZ);
    camera.lookAt(0, 0, -4);
  }, [camera, offsetY, offsetZ]);

  return null;
}

// ─── Game Logic ─────────────────────────────────────────────────────────
function GameWorld({
  gameState,
  setGameState,
  setProgress,
  setTime,
  isMobile,
  canvasRef,
  courseSeed,
}: {
  gameState: GameState;
  setGameState: (s: GameState) => void;
  setProgress: (p: number) => void;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  courseSeed: number;
}) {
  const marbleRef = useRef<RapierRigidBody>(null);
  const keys = useKeyboardControls();
  const { touchForce, jumpRequested } = useTouchControls(canvasRef);
  const gameTimeRef = useRef(0);

  const obstacles = useMemo(() => generateCourse(courseSeed), [courseSeed]);

  // Reset marble on game start
  useEffect(() => {
    if (gameState === "playing") {
      gameTimeRef.current = 0;
      setTime(0);
      setProgress(0);
      if (marbleRef.current) {
        marbleRef.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
        marbleRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        marbleRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  }, [gameState, setTime, setProgress]);

  const handleGameOver = useCallback(() => {
    if (gameState === "playing") setGameState("gameover");
  }, [gameState, setGameState]);

  const handleWin = useCallback(() => {
    if (gameState === "playing") setGameState("win");
  }, [gameState, setGameState]);

  useFrame((_, delta) => {
    if (gameState !== "playing" || !marbleRef.current) return;

    gameTimeRef.current += delta;
    setTime(gameTimeRef.current);

    const pos = marbleRef.current.translation();

    // Fall detection
    if (pos.y < FALL_THRESHOLD) {
      handleGameOver();
      return;
    }

    // Progress
    const prog = Math.min(1, Math.abs(pos.z) / TRACK_LENGTH);
    setProgress(prog);

    // Auto-forward speed (increases over time)
    const currentSpeed = Math.min(
      MAX_FORWARD_SPEED,
      FORWARD_SPEED + gameTimeRef.current * SPEED_RAMP
    );

    // Set forward velocity, keep existing x velocity
    const vel = marbleRef.current.linvel();
    marbleRef.current.setLinvel(
      { x: vel.x, y: vel.y, z: -currentSpeed },
      true
    );

    // Strafe controls (left/right only)
    const k = keys.current;
    let strafeForce = 0;
    if (k.has("arrowleft") || k.has("a")) strafeForce = -STRAFE_FORCE;
    if (k.has("arrowright") || k.has("d")) strafeForce = STRAFE_FORCE;

    // Touch controls
    if (isMobile && touchForce.current !== 0) {
      strafeForce = touchForce.current * STRAFE_FORCE;
    }

    if (strafeForce !== 0) {
      marbleRef.current.applyImpulse({ x: strafeForce, y: 0, z: 0 }, true);
    }

    // Cap strafe velocity
    if (Math.abs(vel.x) > MAX_STRAFE_SPEED) {
      marbleRef.current.setLinvel(
        {
          x: Math.sign(vel.x) * MAX_STRAFE_SPEED,
          y: vel.y,
          z: vel.z,
        },
        true
      );
    }

    // Jump — only when grounded
    const isGrounded = pos.y < GROUND_THRESHOLD;
    const wantsJump =
      k.has(" ") || k.has("arrowup") || k.has("w") || jumpRequested.current;

    if (wantsJump && isGrounded) {
      marbleRef.current.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true);
    }
    // Consume mobile jump request
    jumpRequested.current = false;
  });

  return (
    <>
      <CameraFollow marbleRef={marbleRef} isMobile={isMobile} gameState={gameState} />

      {/* Lighting — follows marble loosely */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#a855f7" />
      <pointLight position={[5, 8, -20]} intensity={0.5} color="#ec4899" />
      <pointLight position={[-5, 8, -40]} intensity={0.5} color="#3b82f6" />

      <color attach="background" args={["#0a0a0c"]} />
      <fog attach="fog" args={["#0a0a0c", 20, 50]} />

      <Physics gravity={[0, -15, 0]}>
        <Track />
        <SideRails />
        <Marble marbleRef={marbleRef} gameState={gameState} onHit={handleGameOver} />
        {obstacles.map((o) => (
          <ObstacleBlock key={o.id} obstacle={o} />
        ))}
        <FinishLine onCross={handleWin} />
        <FallSensor onFall={handleGameOver} />
      </Physics>
    </>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────
export default function MarbleGame({ isMobile }: { isMobile: boolean }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [courseSeed, setCourseSeed] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setCourseSeed(Date.now());
    setGameState("playing");
  };

  return (
    <div ref={canvasRef} className="relative w-full h-full">
      <Canvas dpr={[1, Math.min(2, window.devicePixelRatio)]} performance={{ min: 0.5 }}>
        <GameWorld
          gameState={gameState}
          setGameState={setGameState}
          setProgress={setProgress}
          setTime={setTime}
          isMobile={isMobile}
          canvasRef={canvasRef}
          courseSeed={courseSeed}
        />
      </Canvas>

      {/* HUD — progress bar + time */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {time.toFixed(1)}s
          </span>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Idle / Start screen */}
      {gameState === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Marble Run
          </h3>
          <p className="text-gray-400 text-sm mb-1">
            Reach the end of the course. Dodge or jump over obstacles.
          </p>
          <p className="text-gray-500 text-xs mb-6">
            {isMobile
              ? "Steer: tap left/right · Jump: tap top of screen"
              : "Steer: A/D or Arrow Keys · Jump: Space or W"}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Play
          </button>
        </div>
      )}

      {/* Game Over */}
      {gameState === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Game Over</h3>
          <p className="text-gray-400 text-sm mb-1">
            {Math.round(progress * 100)}% completed
          </p>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            {time.toFixed(1)}s
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Win! */}
      {gameState === "win" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            You Made It!
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            {time.toFixed(1)}s
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:scale-105 active:scale-95 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
