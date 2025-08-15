import React, { useRef, useEffect } from "react";
import { Environment, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface Scene3DProps {
  isMobile?: boolean;
}

const Scene3D: React.FC<Scene3DProps> = ({ isMobile = false }) => {
  const groupRef = useRef<Group>(null);

  // Load GLB model
  const { scene } = useGLTF("/macbook_pro_2021.glb");

  useEffect(() => {
    // Check model structure (for debugging)
    console.log("Model structure:", scene);
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Adjust animation speed for mobile
      const speedMultiplier = isMobile ? 0.7 : 1;

      // Gentle floating animation
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.3 * speedMultiplier) * 0.05 - 0.1;
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.2 * speedMultiplier) * 0.15;
      // Add slight up and down movement - only adjust base position for mobile
      groupRef.current.position.y =
        (isMobile ? 0 : -0.3) +
        Math.sin(clock.getElapsedTime() * 0.5 * speedMultiplier) * 0.05;
    }
  });

  // For mobile, adjust position to move model to the center
  // Keep desktop/laptop version exactly the same as the original
  const modelScale = isMobile
    ? ([2.3, 2.3, 2.3] as const)
    : ([2.8, 2.8, 2.8] as const);
  const modelPosition = isMobile ? ([0, 0, 0] as const) : ([0, 0, 0] as const);

  return (
    <>
      {/* @ts-ignore */}
      <ambientLight intensity={0.1} />

      {/* @ts-ignore */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* @ts-ignore */}
      <directionalLight position={[-3, 2, -5]} intensity={0.5} />

      {/* @ts-ignore */}
      <Environment preset="night" />

      {/* @ts-ignore */}
      <group
        ref={groupRef}
        position={modelPosition}
        scale={modelScale}
        rotation={[0, 0, 0]}
      >
        {/* @ts-ignore */}
        <primitive object={scene} />
      </group>
    </>
  );
};

export default Scene3D;

// Preload GLB model
useGLTF.preload("/macbook_pro_2021.glb");
