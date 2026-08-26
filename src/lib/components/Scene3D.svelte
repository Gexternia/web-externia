<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  let container: HTMLDivElement;
  let isLight = $state(false);

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    let cancelled = false;
    let disposeScene: (() => void) | undefined;
    let idleId = 0;

    const init = () => {
      if (cancelled) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 5.0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Central AI Inner Core (Glow Sphere)
      const coreGeo = new THREE.IcosahedronGeometry(0.85, 3);
      const coreMatDark = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.7,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const coreMatLight = new THREE.MeshStandardMaterial({
        color: 0xee847b,
        emissive: 0xde3b84,
        emissiveIntensity: 0.15,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      });
      const coreMesh = new THREE.Mesh(coreGeo, isLight ? coreMatLight : coreMatDark);
      mainGroup.add(coreMesh);

      // 2. Synaptic Neural Nodes & Connections
      const NODE_COUNT = 36;
      const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const nodeMatDark = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const nodeMatLight = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.55 });
      
      const nodeGroup = new THREE.Group();
      const nodePositions: THREE.Vector3[] = [];

      for (let i = 0; i < NODE_COUNT; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.35 + Math.random() * 0.45;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);

        const nodeMesh = new THREE.Mesh(nodeGeo, isLight ? nodeMatLight : nodeMatDark);
        nodeMesh.position.copy(pos);
        nodeGroup.add(nodeMesh);
      }
      mainGroup.add(nodeGroup);

      // Neural Connections (Synapses)
      const linePositions: number[] = [];
      const MAX_DIST = 1.05;

      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const d = nodePositions[i].distanceTo(nodePositions[j]);
          if (d < MAX_DIST) {
            linePositions.push(
              nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
              nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
            );
          }
        }
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMatDark = new THREE.LineBasicMaterial({ color: 0x0070f3, transparent: true, opacity: 0.4 });
      const lineMatLight = new THREE.LineBasicMaterial({ color: 0xee847b, transparent: true, opacity: 0.22 });
      const lineMesh = new THREE.LineSegments(lineGeo, isLight ? lineMatLight : lineMatDark);
      mainGroup.add(lineMesh);

      // 3. Concentric Orbital Rings
      const ringGeo1 = new THREE.TorusGeometry(2.05, 0.008, 16, 90);
      const ringGeo2 = new THREE.TorusGeometry(2.35, 0.006, 16, 90);
      const ringMatDark = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      const ringMatLight = new THREE.MeshBasicMaterial({ color: 0xde3b84, transparent: true, opacity: 0.2 });

      const ring1 = new THREE.Mesh(ringGeo1, isLight ? ringMatLight : ringMatDark);
      ring1.rotation.x = Math.PI / 3;
      mainGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo2, isLight ? ringMatLight : ringMatDark);
      ring2.rotation.y = Math.PI / 4;
      ring2.rotation.z = Math.PI / 6;
      mainGroup.add(ring2);

      // 4. Orbiting Data Pulses (Particles)
      const PULSE_COUNT = 40;
      const pulseGeo = new THREE.BufferGeometry();
      const pulsePos = new Float32Array(PULSE_COUNT * 3);
      for (let i = 0; i < PULSE_COUNT; i++) {
        pulsePos[i * 3] = (Math.random() - 0.5) * 5;
        pulsePos[i * 3 + 1] = (Math.random() - 0.5) * 5;
        pulsePos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      }
      pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
      const pulseMatDark = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.035, transparent: true, opacity: 0.75 });
      const pulseMatLight = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.035, transparent: true, opacity: 0.35 });
      const pulsePoints = new THREE.Points(pulseGeo, isLight ? pulseMatLight : pulseMatDark);
      mainGroup.add(pulsePoints);

      // Theme toggle listener
      const themeHandler = () => {
        isLight = document.documentElement.classList.contains('light');
        coreMesh.material = isLight ? coreMatLight : coreMatDark;
        nodeGroup.children.forEach((child) => {
          (child as THREE.Mesh).material = isLight ? nodeMatLight : nodeMatDark;
        });
        lineMesh.material = isLight ? lineMatLight : lineMatDark;
        ring1.material = isLight ? ringMatLight : ringMatDark;
        ring2.material = isLight ? ringMatLight : ringMatDark;
        pulsePoints.material = isLight ? pulseMatLight : pulseMatDark;
      };
      window.addEventListener('themechange', themeHandler);

      // Controls & Mouse tilt
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      const pointer = { x: 0, y: 0 };
      container.addEventListener('pointermove', (e) => {
        const r = container.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      });

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;

        // Dynamic responsive scaling for mobile screens
        if (w < 768) {
          const scale = Math.max(0.48, Math.min(0.65, w / 620));
          mainGroup.scale.set(scale, scale, scale);
        } else {
          mainGroup.scale.set(1.0, 1.0, 1.0);
        }

        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', resize);
      resize();

      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        coreMesh.rotation.y += 0.005;
        coreMesh.rotation.x += 0.003;

        ring1.rotation.z += 0.004;
        ring2.rotation.z -= 0.003;

        mainGroup.rotation.y += (pointer.x * 0.25 - mainGroup.rotation.y) * 0.03;
        mainGroup.rotation.x += (-pointer.y * 0.25 - mainGroup.rotation.x) * 0.03;

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      disposeScene = () => {
        window.removeEventListener('themechange', themeHandler);
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    const scheduleInit = () => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        if ('requestIdleCallback' in window) {
          idleId = requestIdleCallback(init, { timeout: 500 });
        } else {
          init();
        }
      });
    };

    scheduleInit();

    return () => {
      cancelled = true;
      if (idleId) cancelIdleCallback(idleId);
      disposeScene?.();
    };
  });
</script>

<div bind:this={container} class="absolute inset-0 w-full h-full"></div>


