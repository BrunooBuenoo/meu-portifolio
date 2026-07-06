<template>
  <section  id="timeline" class="timeline-section">
    <div class="container">
      <h2 class="section-title">Minha <span class="">Jornada</span></h2>
      
      <div class="timeline">
        <div 
          v-for="(item, index) in timelineItems" 
          :key="index"
          class="timeline-item"
          :class="{ 'timeline-left': index % 2 === 0, 'timeline-right': index % 2 === 1 }"
        >
          <div class="timeline-marker">
            <div class="timeline-dot"></div>
          </div>
          <div class="timeline-content">
            <div class="timeline-date">{{ item.date }}</div>
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-company">{{ item.company }}</p>
            <p class="timeline-description">{{ item.description }}</p>
            <div class="timeline-skills">
              <span v-for="skill in item.skills" :key="skill" class="timeline-skill">
                {{ skill }}
              </span>
            </div>
          </div>
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
  name: 'Timeline',
  setup() {
    const timelineItems = ref([
      {
        date: '2024 - Presente',
        title: 'Desenvolvedor Full Stack Freelancer',
        company: 'Autônomo',
        description: 'Desenvolvimento de aplicações web modernas usando Vue.js, React, Node.js e Firebase. Foco em soluções escaláveis e experiência do usuário.',
        skills: ['Vue.js', 'React', 'Node.js', 'Firebase', 'TypeScript']
      },
      {
        date: '2023 - 2024',
        title: 'Desenvolvedor Frontend Sênior',
        company: 'TechCorp Solutions',
        description: 'Liderança técnica em projetos de grande escala, mentoria de desenvolvedores júnior e implementação de melhores práticas de desenvolvimento.',
        skills: ['React', 'Next.js', 'GraphQL', 'AWS', 'Docker']
      },
      {
        date: '2022 - 2023',
        title: 'Desenvolvedor Full Stack',
        company: 'StartupXYZ',
        description: 'Desenvolvimento de MVP para startup de tecnologia, desde a concepção até o deploy em produção.',
        skills: ['Vue.js', 'Python', 'PostgreSQL', 'Redis', 'Kubernetes']
      },
      {
        date: '2021 - 2022',
        title: 'Desenvolvedor Frontend',
        company: 'WebAgency Pro',
        description: 'Criação de interfaces responsivas e interativas para diversos clientes, com foco em performance e acessibilidade.',
        skills: ['JavaScript', 'CSS3', 'SASS', 'Webpack', 'Git']
      }
    ])

    // Carregar timeline do Firestore
    const loadTimeline = async () => {
      try {
        const docRef = doc(db, 'settings', 'timeline')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.timeline && data.timeline.length > 0) {
            timelineItems.value = data.timeline
            console.log('✅ Timeline carregada do Firestore:', data.timeline)
          }
        } else {
          console.log('📅 Usando timeline padrão')
        }
      } catch (error) {
        console.error('❌ Erro ao carregar timeline:', error)
      }
    }

    // Escutar atualizações da timeline via eventos customizados
    const handleTimelineUpdate = (event) => {
      if (event.detail && event.detail.length > 0) {
        timelineItems.value = event.detail
        console.log('🔄 Timeline atualizada via evento:', event.detail)
      }
    }

    onMounted(async () => {
      console.log('🚀 Timeline montado, carregando dados...')
      await loadTimeline()
      
      window.addEventListener('timelineUpdated', handleTimelineUpdate)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('timelineUpdated', handleTimelineUpdate)
    })

    return {
      timelineItems
    }
  }
}
</script>

<style scoped>
.timeline-section {
  padding: 100px 0;
  background: var(--bg-primary);
}

.timeline {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  width: 50%;
}

.timeline-left {
  left: 0;
  padding-right: 40px;
}

.timeline-right {
  left: 50%;
  padding-left: 40px;
}

.timeline-marker {
  position: absolute;
  top: 20px;
  width: 20px;
  height: 20px;
}

.timeline-left .timeline-marker {
  right: -10px;
}

.timeline-right .timeline-marker {
  left: -10px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--text-primary);
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 4px var(--accent);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.1);
  }
  100% {
    box-shadow: 0 0 0 4px var(--accent);
  }
}

.timeline-content {
  background: var(--bg-primary);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  position: relative;
}

.timeline-content::before {
  content: '';
  position: absolute;
  top: 25px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.timeline-left .timeline-content::before {
  right: -20px;
  border-left-color: var(--bg-card);
}

.timeline-right .timeline-content::before {
  left: -20px;
  border-right-color: var(--bg-card);
}

.timeline-content:hover {
  border-color: var(--text-primary);
}

.timeline-date {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.timeline-title {
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.timeline-company {
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 15px;
}

.timeline-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.timeline-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-skill {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    width: 100%;
    left: 0 !important;
    padding-left: 60px !important;
    padding-right: 0 !important;
  }
  
  .timeline-marker {
    left: 10px !important;
    right: auto !important;
  }
  
  .timeline-content::before {
    left: -20px !important;
    right: auto !important;
    border-right-color: var(--bg-card) !important;
    border-left-color: transparent !important;
  }
}
</style>
