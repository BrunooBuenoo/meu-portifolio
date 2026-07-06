<template>
  <transition name="loading">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo">
          <div class="logo-text">BB</div>
          <div class="loading-spinner"></div>
        </div>
        <div class="loading-text">
          <div class="loading-message">{{ currentMessage }}</div>
          <div class="loading-progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="loading-particles"></div>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'LoadingScreen',
  setup() {
    const isLoading = ref(true)
    const progress = ref(0)
    const currentMessage = ref('')
    
    const messages = [
      'Inicializando sistema...',
      'Carregando componentes...',
      'Preparando experiência...',
      'Quase pronto...'
    ]

    const getParticleStyle = (index) => {
      return {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's'
      }
    }

    const simulateLoading = () => {
      let messageIndex = 0
      currentMessage.value = messages[0]
      
      const interval = setInterval(() => {
        progress.value += Math.random() * 15 + 5
        
        if (progress.value >= 25 && messageIndex === 0) {
          messageIndex = 1
          currentMessage.value = messages[1]
        } else if (progress.value >= 50 && messageIndex === 1) {
          messageIndex = 2
          currentMessage.value = messages[2]
        } else if (progress.value >= 75 && messageIndex === 2) {
          messageIndex = 3
          currentMessage.value = messages[3]
        }
        
        if (progress.value >= 100) {
          progress.value = 100
          clearInterval(interval)
          
          setTimeout(() => {
            isLoading.value = false
          }, 500)
        }
      }, 200)
    }

    onMounted(() => {
      simulateLoading()
    })

    return {
      isLoading,
      progress,
      currentMessage,
      getParticleStyle
    }
  }
}
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow: hidden;
}

.loading-content {
  text-align: center;
  z-index: 2;
}

.loading-logo {
  position: relative;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 24px;
  letter-spacing: -0.05em;
}

/* Removido logoGlow */

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  max-width: 300px;
}

.loading-message {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 20px;
  min-height: 1.5em;
}

.loading-progress {
  width: 100%;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #ffffff;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.loading-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10px) rotate(360deg);
    opacity: 0;
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: all 0.5s ease;
}

.loading-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
