/**
 * Scene3D.tsx
 * Three.js canvas with DRACO-ready model loading, particles, and orbit controls.
 * Uses dpr={[1,2]} to limit pixel density on retina/mobile.
 *
 * HOW TO LOAD A DRACO-COMPRESSED .glb:
 *   import { useGLTF } from "@react-three/drei";
 *   // At module scope, set the DRACO decoder path:
 *   useGLTF.preload("/models/your-model.glb");
 *   // Inside your component:
 *   const { scene } = useGLTF("/models/your-model.glb", true,
 *     undefined,
 *     (loader) => {
 *       const dracoLoader = new DRACOLoader();
 *       dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
 *       loader.setDRACOLoader(dracoLoader);
 *     }
 *   );
 */
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";

/** Placeholder central mesh — replace with your DRACO .glb model */
function CentralModel() {
    const ref = useRef<THREE.Mesh>(null);

    // Slow auto-rotation (360° in ~20 seconds)
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={ref} position={[0, 0, 0]}>
            {/* PLACEHOLDER: Replace this geometry with your loaded DRACO model's scene */}
            <icosahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial
                color="#0070f3"
                metalness={0.9}
                roughness={0.15}
                wireframe
            />
        </mesh>
    );
}

export default function Scene3D() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "transparent",
            }}
        >
            <Suspense fallback={null}>
                {/* Ambient + city HDRI environment for realistic reflections */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <Environment preset="city" />

                {/* Central model with auto-rotation */}
                <CentralModel />

                {/* 600 InstancedMesh particles as background */}
                <Particles />

                {/* Orbit controls: drag to rotate, scroll zoom DISABLED */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.4}
                />
            </Suspense>
        </Canvas>
    );
}
