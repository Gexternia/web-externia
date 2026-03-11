<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  let container: HTMLDivElement;
  let isLight = $state(false);

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => {
      isLight = document.documentElement.classList.contains('light');
      if (isLight) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          instanced.setColorAt(i, new THREE.Color(LIGHT_COLORS[Math.floor(Math.random() * 5)]));
        }
        const count = geo.attributes.position.count;
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const c = LIGHT_COLORS[Math.floor(Math.random() * 5)];
          colors[i * 3] = ((c >> 16) & 255) / 255;
          colors[i * 3 + 1] = ((c >> 8) & 255) / 255;
          colors[i * 3 + 2] = (c & 255) / 255;
        }
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mesh.material = matLight;
      } else {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          instanced.setColorAt(i, new THREE.Color(0x3b82f6));
        }
        geo.deleteAttribute('color');
        mesh.material = matDark;
      }
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    };
    window.addEventListener('themechange', handler);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const LIGHT_COLORS = [0xde3b84, 0xffc12d, 0xf7a361, 0xee847b, 0xd6007d];
    const geo = new THREE.OctahedronGeometry(1.5, 2);
    const matLight = new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: true
    });
    const matDark = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: true,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35
    });
    const mesh = new THREE.Mesh(geo, matDark);
    mesh.scale.set(0.9, 1.2, 0.9);
    scene.add(mesh);

    const PARTICLE_COUNT = 100;
    const particleGeo = new THREE.SphereGeometry(1, 6, 6);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    const instanced = new THREE.InstancedMesh(particleGeo, particleMat, PARTICLE_COUNT);
    const dummy = new THREE.Object3D();
    const basePos = new Float32Array(PARTICLE_COUNT * 3);
    const curPos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      basePos[i * 3] = (Math.random() - 0.5) * 15;
      basePos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      basePos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      curPos[i * 3] = basePos[i * 3];
      curPos[i * 3 + 1] = basePos[i * 3 + 1];
      curPos[i * 3 + 2] = basePos[i * 3 + 2];
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    scene.add(instanced);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      instanced.setColorAt(i, new THREE.Color(isLight ? LIGHT_COLORS[Math.floor(Math.random() * 5)] : 0x3b82f6));
    }
    instanced.instanceColor!.needsUpdate = true;
    handler();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;

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
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', resize);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = 0.016;
      mesh.rotation.y += dt * 0.15;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        curPos[i3] += (basePos[i3] + pointer.x * 5 * 0.3 - curPos[i3]) * 0.02;
        curPos[i3 + 1] += (basePos[i3 + 1] + pointer.y * 5 * 0.3 - curPos[i3 + 1]) * 0.02;
        curPos[i3] += vel[i3];
        curPos[i3 + 1] += vel[i3 + 1];
        curPos[i3 + 2] += vel[i3 + 2];
        dummy.position.set(curPos[i3], curPos[i3 + 1], curPos[i3 + 2]);
        dummy.scale.setScalar(0.015 + Math.random() * 0.01);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('themechange', handler);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  });
</script>

<div bind:this={container} class="absolute inset-0 w-full h-full"></div>
