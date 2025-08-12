<template>
  <div class="particle-container" ref="particleContainer">
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'

export default {
  name: 'ParticleBackground',
  setup() {
    const canvas = ref(null)
    const particleContainer = ref(null)
    const { isDarkMode } = inject('theme') || { isDarkMode: ref(true) }
    
    let ctx = null
    let particles = []
    let animationId = null
    let mouse = { x: 0, y: 0 }

    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.01

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.value.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.value.height) this.speedY *= -1

        // Mouse interaction
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          this.x -= dx * 0.01
          this.y -= dy * 0.01
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = isDarkMode.value ? '#3b82f6' : '#1e40af'
        ctx.fill()
        ctx.restore()
      }
    }

    const initCanvas = () => {
      if (!canvas.value) return
      
      ctx = canvas.value.getContext('2d')
      resizeCanvas()
      
      // Create initial particles
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
          Math.random() * canvas.value.width,
          Math.random() * canvas.value.height
        ))
      }
      
      animate()
    }

    const resizeCanvas = () => {
      if (!canvas.value || !particleContainer.value) return
      
      canvas.value.width = particleContainer.value.offsetWidth
      canvas.value.height = particleContainer.value.offsetHeight
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      
      particles.forEach((particle, index) => {
        particle.update()
        particle.draw()
        
        if (particle.size <= 0.2) {
          particles.splice(index, 1)
          particles.push(new Particle(
            Math.random() * canvas.value.width,
            Math.random() * canvas.value.height
          ))
        }
      })
      
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = 0.1
            ctx.strokeStyle = isDarkMode.value ? '#3b82f6' : '#1e40af'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      const rect = canvas.value.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleResize = () => {
      resizeCanvas()
    }

    onMounted(() => {
      initCanvas()
      window.addEventListener('resize', handleResize)
      canvas.value?.addEventListener('mousemove', handleMouseMove)
    })

    onBeforeUnmount(() => {
      if (animationId) cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      canvas.value?.removeEventListener('mousemove', handleMouseMove)
    })

    return {
      canvas,
      particleContainer
    }
  }
}
</script>

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle-canvas {
  width: 100%;
  height: 100%;
}
</style>
