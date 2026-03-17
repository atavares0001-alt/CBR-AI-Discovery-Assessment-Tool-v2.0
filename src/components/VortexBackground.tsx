'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

const PARTICLE_COUNT = 80
const ACCENT_COLOR = { r: 16, g: 185, b: 129 } // #10b981

export function VortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function createParticle(): Particle {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * Math.max(canvas!.width, canvas!.height) * 0.5
      return {
        x: canvas!.width / 2 + Math.cos(angle) * radius,
        y: canvas!.height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0,
        life: 0,
        maxLife: 200 + Math.random() * 300,
      }
    }

    function init() {
      resize()
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle)
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      const cx = canvas!.width / 2
      const cy = canvas!.height / 2

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life++

        // Fade in/out
        if (p.life < 30) {
          p.opacity = p.life / 30
        } else if (p.life > p.maxLife - 30) {
          p.opacity = (p.maxLife - p.life) / 30
        } else {
          p.opacity = 0.6
        }

        // Pull toward center with vortex rotation
        const dx = cx - p.x
        const dy = cy - p.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = 0.02

        // Vortex: perpendicular force + inward pull
        p.vx += (dx / dist) * force - (dy / dist) * force * 0.5
        p.vy += (dy / dist) * force + (dx / dist) * force * 0.5

        // Damping
        p.vx *= 0.98
        p.vy *= 0.98

        p.x += p.vx
        p.y += p.vy

        // Respawn if dead or too close to center
        if (p.life >= p.maxLife || dist < 5) {
          particles[i] = createParticle()
          continue
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${ACCENT_COLOR.r}, ${ACCENT_COLOR.g}, ${ACCENT_COLOR.b}, ${p.opacity})`
        ctx!.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    init()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
