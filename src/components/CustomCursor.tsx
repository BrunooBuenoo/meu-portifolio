'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Mola suave
  const springConfig = { damping: 30, stiffness: 300, mass: 0.6 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = 
        window.innerWidth <= 768 || 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.project-card') || 
        target.closest('.tech-card-carousel') ||
        target.classList.contains('cursor-pointer')

      setIsHovered(!!isInteractive)
    }

    document.body.style.cursor = 'none'

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [isMobile, mouseX, mouseY])

  if (isMobile) return null

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-50">
      {/* Círculo externo Apple (cinza sutil com blur/mola) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 40 : 22,
          height: isHovered ? 40 : 22,
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
          borderColor: isHovered ? 'rgba(29, 29, 31, 0.3)' : 'rgba(29, 29, 31, 0.15)',
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.15 }}
        className="fixed rounded-full border border-txt-primary z-50 pointer-events-none"
      />

      {/* Ponto central discreto */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 0.3 : 1,
          backgroundColor: isHovered ? 'rgba(29, 29, 31, 0.8)' : 'rgba(29, 29, 31, 0.6)',
        }}
        className="fixed w-1 h-1 rounded-full z-50 pointer-events-none"
      />
    </div>
  )
}
