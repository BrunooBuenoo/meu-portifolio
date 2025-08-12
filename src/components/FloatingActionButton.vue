<template>
  <transition name="fab">
    <button 
      v-if="showFab" 
      @click="scrollToTop"
      class="floating-action-button"
      :class="{ 'fab-visible': showFab }"
    >
      <div class="fab-icon">↑</div>
      <div class="fab-ripple" :class="{ 'ripple-active': rippleActive }"></div>
    </button>
  </transition>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'FloatingActionButton',
  setup() {
    const showFab = ref(false)
    const rippleActive = ref(false)

    const handleScroll = () => {
      showFab.value = window.pageYOffset > 300
    }

    const scrollToTop = () => {
      rippleActive.value = true
      setTimeout(() => {
        rippleActive.value = false
      }, 600)

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      showFab,
      rippleActive,
      scrollToTop
    }
  }
}
</script>

<style scoped>
.floating-action-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.floating-action-button:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.fab-icon {
  color: white;
  font-size: 24px;
  font-weight: bold;
  z-index: 2;
  transition: transform 0.3s ease;
}

.floating-action-button:hover .fab-icon {
  transform: translateY(-2px);
}

.fab-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.fab-ripple.ripple-active {
  width: 120px;
  height: 120px;
}

.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

@media (max-width: 768px) {
  .floating-action-button {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
  
  .fab-icon {
    font-size: 20px;
  }
}
</style>
