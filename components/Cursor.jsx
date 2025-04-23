import { useEffect, useRef } from 'react'
import { useSpring, animated, to } from '@react-spring/web'

export default function Cursor() {
  const [{ x, y }, api] = useSpring(() => ({ x: -100, y: -100, config: { tension: 300, friction: 30 } }))
  const mousePos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const move = (e) => {
      mousePos.current = { x: e.clientX - 8, y: e.clientY - 8 }
      api.start({ x: mousePos.current.x, y: mousePos.current.y })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [api])

  return (
    <>
      <animated.div className="cursor-dot" style={{ transform: to([x, y], (xv, yv) => `translateX(${xv}px) translateY(${yv}px)`) }} />
      <animated.div className="cursor-outline" style={{ transform: to([x, y], (xv, yv) => `translateX(${xv}px) translateY(${yv}px)`) }} />
    </>
  )
}
