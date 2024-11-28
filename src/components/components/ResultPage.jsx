import React, { Suspense, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./Loader";

const Computers = ({ isMobile, isTablet, isDesktop }) => {
  const computer = useGLTF("/public/doctor/scene.gltf");

  return (
    <mesh>
      <ambientLight intensity={1.5} />
      <spotLight
        position={[9, 60, 10]}
        angle={0.5}
        penumbra={1}
        intensity={3.0}
        castShadow
        shadow-mapSize={2048}
      />
      <pointLight position={[10, 20, 10]} intensity={2.5} />
      <pointLight position={[-10, 20, 5]} intensity={2.5} />
      <directionalLight position={[0, 10, 10]} intensity={2.0} castShadow />
      <primitive
        object={computer.scene}
        scale={isMobile ? 1.5 : isTablet ? 2 : 2.5}
        position={isMobile ? [0, 3, 0] : isTablet ? [0, 3, 0] : [0, 3, 0]}
        rotation={[0, 0, 0]}
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
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{
        position: [10, 10, 15],
        fov: 30,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

const ResultPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction ?? 0;

  const predictionValue = parseFloat(prediction);
  let recommendation;
  let recommendationsPool = [];

  const resultStatus = predictionValue >= 50 ? "Positive" : "Negative";
  <p className="text-2xl mb-4">{`Result: ${resultStatus}`}</p>

  

  if (predictionValue >= 50) {
    recommendation =
      "The likelihood of dengue is high. Please consult with a doctor or healthcare professional promptly for follow-up testing. Early detection can help ensure appropriate care.";
    recommendationsPool = [
      "Immediate consultation with a doctor can prevent complications and ensure proper treatment.",
      "Only healthcare professionals can provide the necessary diagnostic tests to confirm or rule out dengue.",
      "Delaying medical consultation could lead to worsening symptoms and increased risks.",
      "Seeking professional medical advice is the best way to protect your health and prevent further issues.",
    ];
  } else {
    recommendation =
      "The likelihood of dengue is low. Maintain good health practices and monitor for any changes, but there is no immediate cause for concern.";
    recommendationsPool = [
      "Continue to use mosquito repellents and keep your environment clean to prevent mosquito breeding.",
      "Maintain a balanced diet to support your immune system.",
      "Stay hydrated and get adequate rest to maintain overall health.",
      "If symptoms like fever or joint pain develop, consult a healthcare provider for further evaluation.",
    ];
  }

  const randomRecommendation =
    recommendationsPool[Math.floor(Math.random() * recommendationsPool.length)];

  return (
    <div className="flex flex-col items-center mt-16 py-10 px-4 min-h-screen bg-[#1d1836]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl bg-gray-800 rounded-lg shadow-lg text-white">
        {/* Text Section */}
        <div className="text-center md:text-left p-10 flex-1">
          <h1 className="text-4xl font-bold mb-4">Dengue Prediction Result</h1>
          <p className="text-2xl mb-4">{`Prediction: ${predictionValue}%`}</p>
          <p className="text-2xl mb-4">{`Result: ${resultStatus}`}</p>
          <p className="text-lg mb-4">
            {recommendation}
            <br />
            {randomRecommendation}
          </p>
          <Link to="/predict" className="text-lg text-blue-500 underline">
            Go back to Predict
          </Link>
        </div>

        {/* Model Section */}
        <div className="flex-1 h-[600px]">
          <ComputersCanvas />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
