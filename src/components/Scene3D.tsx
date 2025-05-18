import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

const Scene3D = () => {
  const groupRef = useRef<Group>(null);

  // Load GLB model
  const { scene } = useGLTF("/macbook_pro_2021.glb");

  useEffect(() => {
    // Check model structure (for debugging)
    console.log("Model structure:", scene);
  }, [scene]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.05 - 0.1;
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
      // Add slight up and down movement
      groupRef.current.position.y =
        -0.3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, -0.2]}
      scale={[2.8, 2.8, 2.8]}
      rotation={[0, 0.3, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

export default Scene3D;

// Preload GLB model
useGLTF.preload("/macbook_pro_2021.glb");
