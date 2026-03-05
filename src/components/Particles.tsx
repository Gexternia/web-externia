/**
 * Particles.tsx
 * 500+ glowing points rendered via a single InstancedMesh (1 draw call).
 * Particles subtly drift toward the mouse pointer each frame.
 */
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 600;
const SPREAD = 15;
const MOUSE_INFLUENCE = 0.3;
const RETURN_SPEED = 0.02;

interface ParticleData {
  basePositions: Float32Array;
  currentPositions: Float32Array;
  velocities: Float32Array;
}

export default function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { pointer } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-compute random base positions & velocities
  const data = useMemo<ParticleData>(() => {
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const current = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      base[i3] = (Math.random() - 0.5) * SPREAD;
      base[i3 + 1] = (Math.random() - 0.5) * SPREAD;
      base[i3 + 2] = (Math.random() - 0.5) * SPREAD;
      current[i3] = base[i3];
      current[i3 + 1] = base[i3 + 1];
      current[i3 + 2] = base[i3 + 2];
      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return { basePositions: base, currentPositions: current, velocities: vel };
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const mouseX = pointer.x * 5;
    const mouseY = pointer.y * 5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Subtle mouse attraction
      data.currentPositions[i3] +=
        (data.basePositions[i3] +
          mouseX * MOUSE_INFLUENCE -
          data.currentPositions[i3]) *
        RETURN_SPEED;
      data.currentPositions[i3 + 1] +=
        (data.basePositions[i3 + 1] +
          mouseY * MOUSE_INFLUENCE -
          data.currentPositions[i3 + 1]) *
        RETURN_SPEED;

      // Gentle floating drift
      data.currentPositions[i3] += data.velocities[i3];
      data.currentPositions[i3 + 1] += data.velocities[i3 + 1];
      data.currentPositions[i3 + 2] += data.velocities[i3 + 2];

      dummy.position.set(
        data.currentPositions[i3],
        data.currentPositions[i3 + 1],
        data.currentPositions[i3 + 2]
      );
      const scale = 0.015 + Math.random() * 0.01;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#0070f3" transparent opacity={0.6} />
    </instancedMesh>
  );
}
