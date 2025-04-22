import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springConfig = { damping: 20, stiffness: 150 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - 8)
      mouseY.set(e.clientY - 8)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div className="cursor-dot" style={{ translateX: cursorX, translateY: cursorY }} />
      <motion.div className="cursor-outline" style={{ translateX: mouseX, translateY: mouseY }} />
    </>
  )
}
