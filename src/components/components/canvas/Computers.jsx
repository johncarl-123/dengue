import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile, isTablet, isDesktop }) => {
  const computer = useGLTF("/public/aedes_aegypti/scene.gltf");
  const [rotationY, setRotationY] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Use frame to create animation
  useFrame((state, delta) => {
    setRotationY((prev) => prev + delta * 0.5); // Rotate the model
  });

  const floatingPosition = hovering
    ? isMobile
      ? [0.5, -0.8, -1.5]
      : isTablet
      ? [1, -1.5, -2]
      : [1.5, -2, -1.5]
    : isMobile
    ? [0.5, -1, -1.5]
    : isTablet
    ? [1, -2, -2]
    : [1.5, -2.5, -1.5];

  return (
    <mesh
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
    >
      {/* Add ambient light for overall brightness */}
      <ambientLight intensity={0.5} />

      {/* Main spotlight for strong lighting from above */}
      <spotLight
        position={[-20, 60, 20]} // Moved spotlight higher and further away
        angle={0.3} // Wider angle
        penumbra={1}
        intensity={2} // Increased intensity for more brightness
        castShadow
        shadow-mapSize={1024}
      />

      {/* Point light positioned closer to the model for extra brightness */}
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      {/* Additional point light for enhanced visibility */}
      <pointLight position={[-10, 10, 5]} intensity={1.5} />

      {/* Front light to illuminate details */}
      <directionalLight
        position={[0, 10, 10]}
        intensity={1.0} // Increased intensity
        castShadow
      />

      {/* Model primitive - scale adjusts based on device size */}
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.4 : isTablet ? 0.6 : 0.75} // Different scales for mobile, tablet, and desktop
        position={floatingPosition} // Floating effect on hover
        rotation={[0, rotationY, 0]} // Rotating model
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 500);
      setIsTablet(width > 500 && width <= 1024);
      setIsDesktop(width > 1024);
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
