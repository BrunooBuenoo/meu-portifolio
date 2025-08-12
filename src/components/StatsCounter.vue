<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div 
          v-for="(stat, index) in stats" 
          :key="index"
          class="stat-card"
          :class="{ 'stat-animated': isVisible }"
          :style="{ animationDelay: index * 0.2 + 's' }"
        >
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-number">{{ animatedValues[index] }}{{ stat.suffix }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default {
  name: 'StatsCounter',
  setup() {
    const isVisible = ref(false)
    const animatedValues = ref([])
    
    const stats = ref([
      { icon: '🚀', number: 25, suffix: '+', label: 'Projetos Concluídos' },
      { icon: '⭐', number: 98, suffix: '%', label: 'Satisfação do Cliente' },
      { icon: '☕', number: 1247, suffix: '', label: 'Xícaras de Café' },
      { icon: '🏆', number: 15, suffix: '+', label: 'Prêmios Recebidos' }
    ])

    // Carregar estatísticas do Firestore
    const loadStats = async () => {
      try {
        const docRef = doc(db, 'settings', 'stats')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.stats && data.stats.length > 0) {
            stats.value = data.stats
            // Inicializar array de valores animados com o tamanho correto
            animatedValues.value = new Array(data.stats.length).fill(0)
            console.log('✅ Estatísticas carregadas do Firestore:', data.stats)
          }
        } else {
          console.log('📊 Usando estatísticas padrão')
          // Inicializar com valores padrão
          animatedValues.value = new Array(stats.value.length).fill(0)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error)
        // Em caso de erro, usar valores padrão
        animatedValues.value = new Array(stats.value.length).fill(0)
      }
    }

    // Escutar atualizações das estatísticas via eventos customizados
    const handleStatsUpdate = (event) => {
      if (event.detail && event.detail.length > 0) {
        stats.value = event.detail
        animatedValues.value = new Array(event.detail.length).fill(0)
        console.log('🔄 Estatísticas atualizadas via evento:', event.detail)
        
        // Se já está visível, animar novamente
        if (isVisible.value) {
          setTimeout(() => {
            stats.value.forEach((stat, index) => {
              setTimeout(() => {
                animateCounter(index, stat.number)
              }, index * 200)
            })
          }, 100)
        }
      }
    }

    const animateCounter = (index, target) => {
      const duration = 2000
      const start = performance.now()
      
      const animate = (currentTime) => {
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        animatedValues.value[index] = Math.floor(target * easeOutQuart)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }

    const handleScroll = () => {
      const element = document.querySelector('.stats-section')
      if (!element) return
      
      const rect = element.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (isInView && !isVisible.value) {
        isVisible.value = true
        console.log('📈 Iniciando animação das estatísticas')
        
        stats.value.forEach((stat, index) => {
          setTimeout(() => {
            animateCounter(index, stat.number)
          }, index * 200)
        })
      }
    }

    onMounted(async () => {
      console.log('🚀 StatsCounter montado, carregando dados...')
      await loadStats()
      
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('statsUpdated', handleStatsUpdate)
      
      // Verificar se já está na viewport
      handleScroll()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('statsUpdated', handleStatsUpdate)
    })

    return {
      stats,
      isVisible,
      animatedValues
    }
  }
}
</script>

<style scoped>
.stats-section {
  padding: 80px 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 40px 20px;
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.stat-card.stat-animated {
  opacity: 1;
  transform: translateY(0);
  animation: slideInUp 0.6s ease forwards;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: var(--accent);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.stat-card:hover .stat-icon {
  filter: grayscale(0%);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1.1rem;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .stat-card {
    padding: 30px 15px;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stat-icon {
    font-size: 2.5rem;
  }
}
</style>
