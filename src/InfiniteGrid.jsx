import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import usePan from "./usePan.jsx";

// Grid configuration
const ROWS = 10;
const CELL_WIDTH = 3;
const CELL_HEIGHT = 3;
const GAP = 0.1;
const EFFECTIVE_CELL_WIDTH = CELL_WIDTH + GAP;
const EFFECTIVE_CELL_HEIGHT = CELL_HEIGHT + GAP;
const SCROLL_SPEED = 12;
const SMOOTHING = 0.1;

// All image filenames
const imageFiles = [
  "high-resolution-photo-of-chicago-m.jpg",
  "download.jpeg",
  "download (1).jpeg",
  "download (2).jpeg",
  "download (3).jpeg",
  "download (4).jpeg",
  "download (5).jpeg",
  "download (6).jpeg",
  "download (7).jpeg",
  "download (8).jpeg",
  "majestic-mountain-peak.jpg",
  "japan-background.jpg",
  "galaxy-nature-aesthetic.jpg",
  "24143.jpg",
  "34793.jpg",
  "2150010125.jpg",
  "269.jpg",
  "240.jpg",
  "2149661456.jpg",
  "dubai-uae-skyline-photo-m.jpg",
  "we-care-wild.jpg",
  "luke-miller.jpg",
];

// Shared plane geometry
const SHARED_PLANE = new THREE.PlaneGeometry(CELL_WIDTH, CELL_HEIGHT);

// Wrap helper
function wrap(value, size) {
  return ((value % size) + size) % size;
}

function Grid() {
  const { offset, bind } = usePan();
  const { viewport } = useThree();

  // Smooth the raw offset
  const smoothOffset = useRef(new THREE.Vector2());

  // Calculate how many columns fit (and rows) once per resize
  const cols = useMemo(
    () => Math.ceil(viewport.width / EFFECTIVE_CELL_WIDTH) + 1,
    [viewport.width]
  );
  const rows = ROWS; // fixed

  // Precompute full list of URLs *only* when cols changes
  const images = useMemo(
    () =>
      Array.from(
        { length: cols * rows },
        (_, i) => `/${imageFiles[i % imageFiles.length]}`
      ),
    [cols, rows]
  );

  // Load all textures once
  const textures = useLoader(THREE.TextureLoader, images);

  useEffect(() => {
    textures.forEach((tex) => {
      // r140+
      tex.colorSpace = THREE.SRGBColorSpace;
      // if on r133–r139 use: tex.encoding = THREE.sRGBEncoding;
      tex.needsUpdate = true;
    });
  }, [textures]);

  // One material per texture
  const materials = useMemo(
    () => textures.map((tex) => new THREE.MeshBasicMaterial({ map: tex })),
    [textures]
  );

  // Keep refs to all meshes
  const meshRefs = useRef([]);
  meshRefs.current = []; // reset

  // Total scrollable dimensions
  const totalWidth = cols * EFFECTIVE_CELL_WIDTH;
  const totalHeight = rows * EFFECTIVE_CELL_HEIGHT;

  // On each frame: lerp the offset, then reposition
  useFrame(() => {
    smoothOffset.current.lerp(offset, SMOOTHING);

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const c = Math.floor(i / rows);
      const r = i % rows;
      const speed = c % 2 === 1 ? 2 : 1;

      const x =
        wrap(
          c * EFFECTIVE_CELL_WIDTH - smoothOffset.current.x * SCROLL_SPEED,
          totalWidth
        ) -
        totalWidth / 2 +
        EFFECTIVE_CELL_WIDTH / 2;
      const y =
        wrap(
          r * EFFECTIVE_CELL_HEIGHT -
            smoothOffset.current.y * speed * SCROLL_SPEED,
          totalHeight
        ) -
        totalHeight / 2 +
        EFFECTIVE_CELL_HEIGHT / 2;

      mesh.position.set(x, y, 0);
    });
  });

  return (
    <group {...bind()}>
      {materials.map((mat, i) => (
        <mesh
          key={i}
          ref={(el) => meshRefs.current.push(el)}
          geometry={SHARED_PLANE}
          material={mat}
          // initial pos (will be immediately updated)
          position={[0, 0, 0]}
        />
      ))}
    </group>
  );
}

function ResponsiveCamera() {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const viewHeight = 5;
  const viewWidth = viewHeight * aspect;

  return (
    <OrthographicCamera
      makeDefault
      position={[0, 0, 10]}
      zoom={1}
      left={-viewWidth / 2}
      right={viewWidth / 2}
      top={viewHeight / 2}
      bottom={-viewHeight / 2}
      near={0.5}
      far={100}
    />
  );
}

export default function InfiniteGrid() {
  return (
    <Canvas
      frameloop="demand"
      orthographic
      dpr={1} // halve fragment work on high-DPR screens
      style={{ width: "100vw", height: "100vh" }}
    >
      <ResponsiveCamera />
      <Grid />
    </Canvas>
  );
}
