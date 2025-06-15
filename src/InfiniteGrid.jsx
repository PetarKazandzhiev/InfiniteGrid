import { useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Image } from '@react-three/drei';
import usePan from './usePan.jsx';

// configuration
const VIEW_HEIGHT = 3;
const VISIBLE_ROWS = 1.5;
const VISIBLE_COLS = 3.5;
const GAP_PX = 5;

function wrap(value, size) {
  return ((value % size) + size) % size;
}

function Grid() {
  const { offset, bind } = usePan();
  const { viewport, size } = useThree();

  const gapX = (GAP_PX / size.width) * viewport.width;
  const gapY = (GAP_PX / size.height) * viewport.height;

  const cellWidth =
    (viewport.width - (VISIBLE_COLS + 1) * gapX) / VISIBLE_COLS;
  const cellHeight =
    (viewport.height - (VISIBLE_ROWS + 1) * gapY) / VISIBLE_ROWS;

  const cols = Math.ceil(viewport.width / (cellWidth + gapX)) + 2;
  const rows = Math.ceil(viewport.height / (cellHeight + gapY)) + 2;
  const imageFiles = useMemo(
    () => [
      'download.jpeg',
      'download (1).jpeg',
      'download (2).jpeg',
      'download (3).jpeg',
      'download (4).jpeg',
      'download (5).jpeg',
      'download (6).jpeg',
      'download (7).jpeg',
      'download (8).jpeg',
      'download (9).jpeg',
    ],
    []
  );
  const images = useMemo(
    () =>
      Array.from(
        { length: cols * rows },
        (_, i) => `/${imageFiles[i % imageFiles.length]}`
      ),
    [cols, rows, imageFiles]
  );

  const totalWidth = cols * (cellWidth + gapX);
  const totalHeight = rows * (cellHeight + gapY);

  useFrame(() => {});

  const planes = [];
  for (let c = 0; c < cols; c += 1) {
    const speed = c % 2 === 1 ? 2 : 1;
    for (let r = 0; r < rows; r += 1) {
      const x =
        wrap(c * (cellWidth + gapX) - offset.x, totalWidth) -
        totalWidth / 2 +
        cellWidth / 2 +
        gapX / 2;
      const y =
        wrap(r * (cellHeight + gapY) - offset.y * speed, totalHeight) -
        totalHeight / 2 +
        cellHeight / 2 +
        gapY / 2;
      const index = c * rows + r;
      planes.push(
        <Image
          key={`${c}-${r}`}
          position={[x, y, 0]}
          url={images[index]}
          scale={[cellWidth, cellHeight]}
          radius={GAP_PX}
        />
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
      style={{ width: '100vw', height: '100vh' }}>
      <ResponsiveCamera />
      <Grid />
    </Canvas>
  );
}
