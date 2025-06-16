import { useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { TextureLoader } from "three";
import usePan from "./usePan.jsx";

const ROWS = 10;
const CELL_HEIGHT = 3;
const CELL_WIDTH = 3;
const VIEW_WIDTH = 3.33;
const VIEW_HEIGHT = 5;

const GAP = 0.1;
// Effective size including gap
const EFFECTIVE_CELL_WIDTH = CELL_WIDTH + GAP;
const EFFECTIVE_CELL_HEIGHT = CELL_HEIGHT + GAP;

function wrap(value, size) {
  return ((value % size) + size) % size;
}

function Grid() {
  const { offset, bind } = usePan();
  const { viewport } = useThree();
  const cols = Math.ceil(viewport.width / CELL_WIDTH) + 1;
  const imageFiles = useMemo(
    () => [
      "download.jpeg",
      "download (1).jpeg",
      "download (2).jpeg",
      "download (3).jpeg",
      "download (4).jpeg",
      "download (5).jpeg",
      "download (6).jpeg",
      "download (7).jpeg",
      "download (8).jpeg",
      "download (9).jpeg",
      "download (10).jpeg",
      "download (11).jpeg",
      "download (12).jpeg",
      "download (13).jpeg",
      "download (14).jpeg",
      "download (15).jpeg",
      "download (16).jpeg",
      "download (17).jpeg",
      "download (18).jpeg",
      "download (19).jpeg",
    ],
    []
  );
  const images = useMemo(
    () =>
      Array.from(
        { length: cols * ROWS },
        (_, i) => `/${imageFiles[i % imageFiles.length]}`
      ),
    [cols, imageFiles]
  );
  const textures = useLoader(TextureLoader, images);
  const totalWidth = cols * CELL_WIDTH;
  const totalHeight = ROWS * CELL_HEIGHT;

  useFrame(() => {});

  const planes = [];
  for (let c = 0; c < cols; c += 1) {
    const speed = c % 2 === 1 ? 2 : 1;
    for (let r = 0; r < ROWS; r += 1) {
      const x =
        wrap(c * EFFECTIVE_CELL_WIDTH - offset.x, totalWidth) -
        totalWidth / 2 +
        EFFECTIVE_CELL_WIDTH / 2;
      const y =
        wrap(r * EFFECTIVE_CELL_HEIGHT - offset.y * speed, totalHeight) -
        totalHeight / 2 +
        EFFECTIVE_CELL_HEIGHT / 2;
      const index = c * ROWS + r;
      planes.push(
        <mesh key={`${c}-${r}`} position={[x, y, 0]}>
          <planeGeometry args={[CELL_WIDTH, CELL_HEIGHT]} />
          <meshBasicMaterial map={textures[index]} />
        </mesh>
      );
    }
  }
  return <group {...bind()}>{planes}</group>;
}

function ResponsiveCamera() {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const viewWidth = VIEW_HEIGHT * aspect;
  return (
    <OrthographicCamera
      makeDefault
      position={[0, 0, 10]}
      zoom={1}
      left={-viewWidth / 2}
      right={viewWidth / 2}
      top={VIEW_HEIGHT / 2}
      bottom={-VIEW_HEIGHT / 2}
      near={0.1}
      far={100}
    />
  );
}

export default function InfiniteGrid() {
  return (
    <Canvas
      frameloop="demand"
      orthographic
      style={{ width: "100vw", height: "100vh" }}
    >
      <ResponsiveCamera />
      <Grid />
    </Canvas>
  );
}
