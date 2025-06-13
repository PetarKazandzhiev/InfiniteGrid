import { useMemo } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { TextureLoader } from 'three'
import usePan from './usePan.jsx'

const VIEW_HEIGHT = 3

function wrap(value, size) {
  return ((value % size) + size) % size
}

function Grid() {
  const { offset, bind } = usePan()
  const { viewport, size } = useThree()
  const isMobile = size.width <= 600
  const desiredCols = isMobile ? 2 : 3.5
  const CELL_SIZE = viewport.width / desiredCols
  const cols = Math.ceil(desiredCols) + 1
  const rows = Math.ceil(viewport.height / CELL_SIZE) + 1
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
    [],
  )
  const images = useMemo(
    () =>
      Array.from(
        { length: cols * rows },
        (_, i) => `/${imageFiles[i % imageFiles.length]}`,
      ),
    [cols, rows, imageFiles],
  )
  const textures = useLoader(TextureLoader, images)
  const totalWidth = cols * CELL_SIZE
  const totalHeight = rows * CELL_SIZE

  useFrame(() => {})

  const planes = []
  for (let c = 0; c < cols; c += 1) {
    const speed = c % 2 === 1 ? 2 : 1
    for (let r = 0; r < rows; r += 1) {
      const x =
        wrap(c * CELL_SIZE - offset.x, totalWidth) - totalWidth / 2 + CELL_SIZE / 2
      const y =
        wrap(r * CELL_SIZE - offset.y * speed, totalHeight) -
        totalHeight / 2 +
        CELL_SIZE / 2
      const index = c * rows + r
      planes.push(
        <mesh key={`${c}-${r}`} position={[x, y, 0]}>
          <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
          <meshBasicMaterial map={textures[index]} />
        </mesh>,
      )
    }
  }
  return <group {...bind()}>{planes}</group>
}

function ResponsiveCamera() {
  const { size } = useThree()
  const aspect = size.width / size.height
  const viewWidth = VIEW_HEIGHT * aspect
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
  )
}

export default function InfiniteGrid() {
  return (
    <Canvas frameloop="demand" orthographic style={{ width: '100vw', height: '100vh' }}>
      <ResponsiveCamera />
      <Grid />
    </Canvas>
  )
}
