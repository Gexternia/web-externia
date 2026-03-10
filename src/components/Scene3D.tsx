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
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";

const LIGHT_BRAND_COLORS = [
    new THREE.Color("#DE3B84"),
    new THREE.Color("#FFC12D"),
    new THREE.Color("#F7A361"),
    new THREE.Color("#EE847B"),
    new THREE.Color("#D6007D"),
];

function CentralModel({ isLight }: { isLight: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const geoRef = useRef<THREE.IcosahedronGeometry>(null);
    const matRef = useRef<THREE.MeshStandardMaterial>(null);

    // Imperatively update geometry colors and material when theme changes
    useEffect(() => {
        const geo = geoRef.current;
        const mat = matRef.current;
        if (!geo || !mat) return;

        if (isLight) {
            const count = geo.attributes.position.count;
            const colors = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const c = LIGHT_BRAND_COLORS[Math.floor(Math.random() * LIGHT_BRAND_COLORS.length)];
                colors[i * 3]     = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;
            }
            geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
            mat.vertexColors = true;
            mat.color.set("#ffffff");
        } else {
            if (geo.hasAttribute("color")) geo.deleteAttribute("color");
            mat.vertexColors = false;
            mat.color.set("#0070f3");
        }
        mat.needsUpdate = true;
    }, [isLight]);

    // Slow auto-rotation (360° in ~20 seconds)
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <icosahedronGeometry ref={geoRef} args={[1.4, 1]} />
            <meshStandardMaterial
                ref={matRef}
                color="#0070f3"
                metalness={0.9}
                roughness={0.15}
                wireframe
            />
        </mesh>
    );
}

export default function Scene3D() {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        setIsLight(document.documentElement.classList.contains("light"));
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setIsLight(!detail.isDark);
        };
        window.addEventListener("themechange", handler);
        return () => window.removeEventListener("themechange", handler);
    }, []);

    return (
        <Canvas
            dpr={[1, 1.5]}
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
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />

                {/* Central model with auto-rotation */}
                <CentralModel isLight={isLight} />

                {/* 600 InstancedMesh particles as background */}
                <Particles isLight={isLight} />

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
