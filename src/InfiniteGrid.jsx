import { useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { TextureLoader } from 'three'
import usePan from './usePan.jsx'

const COLS = 5
const ROWS = 10
const CELL_HEIGHT = 1
const CELL_WIDTH = (CELL_HEIGHT * 9) / 16
const VIEW_WIDTH = 3.33
const VIEW_HEIGHT = 3

function wrap(value, size) {
  return ((value % size) + size) % size
}

function Grid() {
  const { offset, bind } = usePan()
  const images = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => `https://picsum.photos/seed/${i}/900/1600`),
    [],
  )
  const textures = useLoader(TextureLoader, images)
  const totalWidth = COLS * CELL_WIDTH
  const totalHeight = ROWS * CELL_HEIGHT

  useFrame(() => {})

  const planes = []
  for (let c = 0; c < COLS; c += 1) {
    const speed = c % 2 === 1 ? 2 : 1
    for (let r = 0; r < ROWS; r += 1) {
      const x =
        wrap(c * CELL_WIDTH - offset.x, totalWidth) - totalWidth / 2 + CELL_WIDTH / 2
      const y =
        wrap(r * CELL_HEIGHT - offset.y * speed, totalHeight) -
        totalHeight / 2 +
        CELL_HEIGHT / 2
      const index = c * ROWS + r
      planes.push(
        <mesh key={`${c}-${r}`} position={[x, y, 0]}>
          <planeGeometry args={[CELL_WIDTH, CELL_HEIGHT]} />
          <meshBasicMaterial map={textures[index]} />
        </mesh>,
      )
    }
  }
  return <group {...bind()}>{planes}</group>
}

export default function InfiniteGrid() {
  return (
    <Canvas frameloop="demand" orthographic>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 10]}
        zoom={1}
        left={-VIEW_WIDTH / 2}
        right={VIEW_WIDTH / 2}
        top={VIEW_HEIGHT / 2}
        bottom={-VIEW_HEIGHT / 2}
        near={0.1}
        far={100}
      />
      <Grid />
    </Canvas>
  )
}
