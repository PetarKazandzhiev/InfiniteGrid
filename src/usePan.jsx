import { useEffect, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'
import gsap from 'gsap'

export default function usePan() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const bind = useGesture(
    {
      onDragStart: () => {
        isDragging.current = true
        velocity.current.x = 0
        velocity.current.y = 0
      },
      onDrag: ({ delta: [dx, dy] }) => {
        setOffset((o) => ({ x: o.x - dx, y: o.y + dy }))
        velocity.current.x = -dx
        velocity.current.y = dy
      },
      onDragEnd: () => {
        isDragging.current = false
      },
      onWheel: ({ delta: [dx, dy] }) => {
        setOffset((o) => ({ x: o.x - dx, y: o.y - dy }))
        velocity.current.x = -dx
        velocity.current.y = -dy
      },
    },
    { drag: { from: () => [0, 0] } },
  )

  useEffect(() => {
    const update = () => {
      if (!isDragging.current) {
        setOffset((o) => ({ x: o.x + velocity.current.x, y: o.y + velocity.current.y }))
        velocity.current.x *= 0.95
        velocity.current.y *= 0.95
      }
    }
    gsap.ticker.add(update)
    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return { offset, bind }
}
