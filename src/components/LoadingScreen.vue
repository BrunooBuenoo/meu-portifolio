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
      <div class="loading-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
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
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
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
  font-size: 4rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 20px;
  animation: logoGlow 2s ease-in-out infinite alternate;
}

@keyframes logoGlow {
  from {
    text-shadow: 0 0 5px var(--accent);
  }
  to {
    text-shadow: 0 0 8px var(--accent), 0 0 12px var(--accent);
  }
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top: 3px solid var(--accent);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
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
  background: rgba(59, 130, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #2563eb);
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px var(--accent);
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
