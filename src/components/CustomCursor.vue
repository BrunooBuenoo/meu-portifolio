<template>
  <div class="cursor-container" v-if="!isMobile">
    <div 
      class="cursor-dot" 
      :style="{ left: cursorPos.x + 'px', top: cursorPos.y + 'px' }"
      :class="{ 'cursor-hover': isHovering }"
    ></div>
    <div 
      class="cursor-outline" 
      :style="{ left: cursorOutlinePos.x + 'px', top: cursorOutlinePos.y + 'px' }"
      :class="{ 'cursor-hover': isHovering }"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'CustomCursor',
  setup() {
    const cursorPos = ref({ x: 0, y: 0 })
    const cursorOutlinePos = ref({ x: 0, y: 0 })
    const isHovering = ref(false)
    const isMobile = ref(false)

    let animationId = null

    const updateCursor = (e) => {
      cursorPos.value = { x: e.clientX, y: e.clientY }
    }

    const animateOutline = () => {
      const dx = cursorPos.value.x - cursorOutlinePos.value.x
      const dy = cursorPos.value.y - cursorOutlinePos.value.y
      
      cursorOutlinePos.value.x += dx * 0.1
      cursorOutlinePos.value.y += dy * 0.1
      
      animationId = requestAnimationFrame(animateOutline)
    }

    const handleMouseEnter = () => {
      isHovering.value = true
    }

    const handleMouseLeave = () => {
      isHovering.value = false
    }

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768 || 'ontouchstart' in window
    }

    onMounted(() => {
      checkMobile()
      
      if (!isMobile.value) {
        document.addEventListener('mousemove', updateCursor)
        animateOutline()

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-card-carousel')
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', handleMouseEnter)
          el.addEventListener('mouseleave', handleMouseLeave)
        })

        // Hide default cursor
        document.body.style.cursor = 'none'
      }

      window.addEventListener('resize', checkMobile)
    })

    onBeforeUnmount(() => {
      if (animationId) cancelAnimationFrame(animationId)
      document.removeEventListener('mousemove', updateCursor)
      document.body.style.cursor = 'auto'
      window.removeEventListener('resize', checkMobile)
    })

    return {
      cursorPos,
      cursorOutlinePos,
      isHovering,
      isMobile
    }
  }
}
</script>

<style scoped>
.cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
  z-index: 10001;
}

.cursor-outline {
  position: fixed;
  width: 30px;
  height: 30px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0s ease;
  z-index: 10000;
  opacity: 0.5;
}

.cursor-dot.cursor-hover {
  transform: translate(-50%, -50%) scale(2);
  background: var(--accent-hover);
}

.cursor-outline.cursor-hover {
  transform: translate(-50%, -50%) scale(1.5);
  border-color: var(--accent-hover);
  opacity: 0.8;
}
</style>
