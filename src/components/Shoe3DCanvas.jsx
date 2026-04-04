import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, PresentationControls, Float } from "@react-three/drei";
import { MODEL_3D_URL, DRACO_DECODER_URL } from "@/assets/images";

function Model() {
  const { scene } = useGLTF(MODEL_3D_URL, DRACO_DECODER_URL);
  return (
    <primitive
      object={scene}
      scale={3.2}
      position={[0, -0.5, 0]}
      rotation={[0.08, -0.5, 0.04]}
    />
  );
}

export default function Shoe3DCanvas() {
  return (
    <div className="relative w-full h-full">
      {/* HTML loading fallback shown while GLB streams in */}
      <div
        id="shoe-loading"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
      >
        <div className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        <p className="font-body text-xs text-white/30 tracking-[0.2em] uppercase">Loading 3D Model</p>
      </div>

      <Canvas
        className="!absolute inset-0"
        onCreated={() => {
          const el = document.getElementById("shoe-loading");
          if (el) el.style.opacity = "0";
        }}
        camera={{ position: [0, 0.3, 4.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
      {/* Broad fill lighting */}
      <ambientLight intensity={2.8} />

      {/* Key light — top right */}
      <directionalLight position={[6, 9, 5]} intensity={3.5} />

      {/* Red accent fill — matches brand */}
      <directionalLight position={[-5, 2, -4]} intensity={1.6} color="#ff2222" />

      {/* Front bounce */}
      <pointLight position={[0, -1, 4]} intensity={2.2} color="#ffffff" />

      {/* Drag-to-rotate with spring snap-back */}
      <PresentationControls
        global
        zoom={0.9}
        rotation={[0.08, 0.22, 0]}
        polar={[-0.3, 0.22]}
        azimuth={[-1.2, 1.2]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 320 }}
      >
        {/* Gentle up-down float */}
        <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.38}>
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Float>
      </PresentationControls>

      <Environment preset="city" />
    </Canvas>
    </div>
  );
}

// Preload the model so it starts fetching immediately
useGLTF.preload(MODEL_3D_URL, DRACO_DECODER_URL);
