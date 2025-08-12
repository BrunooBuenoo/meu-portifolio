<template>
  <div class="scroll-progress-container">
    <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'ScrollProgress',
  setup() {
    const scrollProgress = ref(0)

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / scrollHeight) * 100
      scrollProgress.value = Math.min(100, Math.max(0, progress))
    }

    onMounted(() => {
      window.addEventListener('scroll', updateScrollProgress)
      updateScrollProgress()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', updateScrollProgress)
    })

    return {
      scrollProgress
    }
  }
}
</script>

<style scoped>
.scroll-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.scroll-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #2563eb);
  transition: width 0.1s ease;
  box-shadow: 0 0 10px var(--accent);
}
</style>
