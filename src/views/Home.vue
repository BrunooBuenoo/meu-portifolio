<template>
  <div class="home">
    <!-- Loading Screen -->
    <LoadingScreen />
    
    <!-- Custom Cursor -->
    <CustomCursor />
    
    <!-- Scroll Progress -->
    <ScrollProgress />
    
    <!-- Floating Action Button -->
    <FloatingActionButton />

    <!-- Hero Section -->
    <section id="home" class="hero">
      <div 
        class="hero-background" 
        :style="{ 
          backgroundImage: `url(${isDarkMode ? heroBackgroundDark : heroBackgroundLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
      ></div>
      <ParticleBackground />
      <div class="container">
        <div class="hero-content" data-aos="fade-up">
          <h1 class="hero-title" :aria-label="displayedText">
            <span class="typed">{{ displayedText }}</span><span class="cursor">|</span>
          </h1>
          
           <p v-if="settings.title" class="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            <span class="gradient-text">{{ settings.title }}</span>
            </p>
            <p v-else class="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                <span class="gradient-text">Analista e Desenvolvedor de Sistemas!!!!!!!!!</span>
            </p>
          <div class="hero-actions" data-aos="fade-up" data-aos-delay="400">
            <a href="#projetos" class="btn btn-primary">Ver Projetos</a>
            <a href="#contato" class="btn btn-outline">Entre em Contato</a>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-arrow"></div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <StatsCounter />

    <!-- Projetos Section -->
    <section id="projetos" class="section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Meus <span class="gradient-text">Projetos</span></h2>
        
        <div class="projects-filter" data-aos="fade-up" data-aos-delay="200">
          <button 
            @click="filterProjects('all')"
            :class="{ active: activeFilter === 'all' }"
            class="filter-btn"
          >
            Todos
          </button>
          <button 
            @click="filterProjects('featured')"
            :class="{ active: activeFilter === 'featured' }"
            class="filter-btn"
          >
            Destaques
          </button>
        </div>

        <div class="projects-grid" v-if="filteredProjects.length">
          <div 
            v-for="(project, index) in filteredProjects" 
            :key="project.id" 
            class="project-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="project-image">
              <img :src="project.image || '/placeholder.svg?height=200&width=300'" :alt="project.title" />
              <div class="project-badge" v-if="project.featured">Destaque</div>
              <div class="project-overlay">
                <button @click="openProjectModal(project)" class="project-quick-view">
                  Ver Detalhes
                </button>
              </div>
            </div>
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ truncateText(project.description, 100) }}</p>
              <div class="project-tech">
                <span v-for="tech in project.technologies?.slice(0, 3)" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
                <span v-if="project.technologies?.length > 3" class="tech-more">
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>
              <button @click="openProjectModal(project)" class="project-action">
                Ver detalhes
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="no-projects">
          <p>Nenhum projeto encontrado.</p>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <Timeline />

    <!-- Tecnologias Section -->
    <section id="tecnologias" class="section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up"><span class="gradient-text">Tecnologias</span></h2>
        
        <div class="tech-carousel-container" data-aos="fade-up" data-aos-delay="200">
          <div class="tech-carousel" ref="techCarousel">
            <!-- Primeira sequência de tecnologias -->
            <div class="tech-track" :style="{ animationDuration: animationDuration }">
              <div v-for="tech in allTechnologies" :key="`first-${tech.id}`" class="tech-card-carousel">
                <div class="tech-icon">
                  <img :src="tech.icon || '/placeholder.svg?height=64&width=64'" :alt="tech.name" />
                </div>
                <h3>{{ tech.name }}</h3>
              </div>
            </div>
            
            <!-- Segunda sequência (duplicada para loop infinito) -->
            <div class="tech-track tech-track-duplicate" :style="{ animationDuration: animationDuration }">
              <div v-for="tech in allTechnologies" :key="`second-${tech.id}`" class="tech-card-carousel">
                <div class="tech-icon">
                  <img :src="tech.icon || '/placeholder.svg?height=64&width=64'" :alt="tech.name" />
                </div>
                <h3>{{ tech.name }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid estático para fallback -->
        <div class="grid grid-4 tech-grid-fallback" v-if="!allTechnologies.length">
          <div class="no-technologies">
            <p>Nenhuma tecnologia cadastrada.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sobre Section -->
    <section id="sobre" class="section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Sobre <span class="gradient-text">Mim</span></h2>
        
        <div class="about-content">
          <div class="about-text" data-aos="fade-right">
            <div class="about-description">
              <p v-if="settings.about">{{ settings.about }}</p>
              <p v-else>
                Olá! Sou um desenvolvedor de software apaixonado por criar soluções 
                elegantes e eficientes. Tenho experiência em desenvolvimento web 
                full-stack, com foco em tecnologias modernas como React, Node.js e 
                muito mais.
              </p>
            </div>
            
            <div class="quote">
              <blockquote v-if="settings.thought">
                 {{ settings.thought }}
              </blockquote>
             <blockquote v-else>
                "Acredito que o melhor código é aquele que resolve 
                problemas reais de forma simples e elegante."
             </blockquote>
            </div>
          </div>
          
          <div class="skills-section" data-aos="fade-left">
            <h3>Minhas Habilidades</h3>
            <div class="skills-list">
              <div v-for="skill in skills" :key="skill.name" class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-percentage">{{ skill.percentage }}%</span>
                </div>
                <div class="skill-bar">
                  <div 
                    class="skill-progress" 
                    :style="{ width: skill.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contato Section -->
    <section id="contato" class="section">
      <div class="container">
        <h2 class="section-title" data-aos="fade-up">Entre em <span class="gradient-text">Contato</span></h2>
        
        <div class="contact-content">
          <div class="contact-info" data-aos="fade-right">
            <h3>Vamos conversar</h3>
            <p>
              Preencha o formulário ao lado ou entre em contato através dos canais 
              abaixo:
            </p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <font-awesome-icon :icon="['fas', 'envelope']" />
                <div class="method-content">
                  <h4>Email</h4>
                  <p>{{ settings.email || 'bruno@exemplo.com' }}</p>
                </div>
              </div>
              
              <div class="contact-method">
                <font-awesome-icon :icon="['fas', 'phone']" />
                <div class="method-content">
                  <h4>Telefone</h4>
                  <p>{{ settings.phone || '+55 (11) 99999-9999' }}</p>
                </div>
              </div>
              
              <div class="contact-method">
                <font-awesome-icon :icon="['fas', 'location-dot']" />
                <div class="method-content">
                  <h4>Localização</h4>
                  <p>{{ settings.location || 'São Paulo, SP - Brasil' }}</p>
                </div>
              </div>
            </div>
            
            <div class="social-links">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">Instagram</a>
              <a href="#" class="social-link">LinkedIn</a>
            </div>
          </div>
          
          <div class="contact-form-container" data-aos="fade-left">
            <form @submit.prevent="sendMessage" class="contact-form">
              <div class="form-group">
                <label>Nome</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  placeholder="seu@email.com"
                />
              </div>
              
              <div class="form-group">
                <label>Mensagem</label>
                <textarea 
                  v-model="form.message" 
                  rows="6" 
                  required 
                  placeholder="Sua mensagem..."
                ></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary" :disabled="sending">
                {{ sending ? 'Enviando...' : 'Enviar Mensagem' }}
              </button>
              
              <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
    <!-- Modal de Detalhes do Projeto -->
    <div v-if="showProjectModal" class="modal-overlay" @click="closeProjectModal">
      <div class="modal project-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProject?.title }}</h3>
          <button @click="closeProjectModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-content">
          <div class="project-modal-image">
            <img :src="selectedProject?.image || '/placeholder.svg?height=400&width=600'" :alt="selectedProject?.title" />
            <div class="project-modal-badge" v-if="selectedProject?.featured">Projeto em Destaque</div>
          </div>
          
          <div class="project-modal-info">
            <div class="project-modal-description">
              <h4>Descrição</h4>
              <p>{{ selectedProject?.description }}</p>
            </div>
            
            <div class="project-modal-tech">
              <h4>Tecnologias Utilizadas</h4>
              <div class="tech-tags">
                <span v-for="tech in selectedProject?.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <div class="project-modal-links">
              <a v-if="selectedProject?.url" :href="selectedProject.url" target="_blank" class="btn btn-primary">
                Ver Projeto
                <span>🔗</span>
              </a>
              <a v-if="selectedProject?.github" :href="selectedProject.github" target="_blank" class="btn btn-outline">
                Ver Código
                <span>📱</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { collection, getDocs, orderBy, query, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import heroBackgroundLight from '../assets/hero-background-light.png'
import heroBackgroundDark from '../assets/hero-background-dark.png'

// Import new components
import LoadingScreen from '../components/LoadingScreen.vue'
import CustomCursor from '../components/CustomCursor.vue'
import ScrollProgress from '../components/ScrollProgress.vue'
import FloatingActionButton from '../components/FloatingActionButton.vue'
import ParticleBackground from '../components/ParticleBackground.vue'
import StatsCounter from '../components/StatsCounter.vue'
import Timeline from '../components/Timeline.vue'

export default {
  name: 'Home',
  components: {
    LoadingScreen,
    CustomCursor,
    ScrollProgress,
    FloatingActionButton,
    ParticleBackground,
    StatsCounter,
    Timeline
  },
  setup() {
    // Inject theme context
    const themeContext = inject('theme')
    const { isDarkMode } = themeContext || { isDarkMode: ref(true) }
    
    // Hero typing effect --------------------------
    const messages = [
      'Olá, eu sou Bruno Bueno.',
      'Seja Bem-vindo ao meu portifólio.'
    ]
    const displayedText = ref('')
    const animationDuration = ref('30s')

    let msgIndex = 0
    let charIndex = 0
    let deleting = false
    let timer = null

    let TYPING_SPEED = 85
    let DELETING_SPEED = 40
    let PAUSE_END = 2500
    let PAUSE_START = 400

    const tick = () => {
      const current = messages[msgIndex]

      if (!deleting) {
        displayedText.value = current.slice(0, charIndex + 1)
        charIndex++

        if (charIndex === current.length) {
          deleting = true
          timer = setTimeout(tick, PAUSE_END)
          return
        }
        timer = setTimeout(tick, TYPING_SPEED)
      } else {
        displayedText.value = current.slice(0, charIndex - 1)
        charIndex--

        if (charIndex === 0) {
          deleting = false
          msgIndex = (msgIndex + 1) % messages.length
          timer = setTimeout(tick, PAUSE_START)
          return
        }
        timer = setTimeout(tick, DELETING_SPEED)
      }
    }

    const projects = ref([])
    const technologies = ref([])
    const settings = ref({})
    const activeFilter = ref('all')
    
    // Modal state
    const showProjectModal = ref(false)
    const selectedProject = ref(null)
    
    // Form data
    const form = ref({
      name: '',
      email: '',
      message: ''
    })
    const sending = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    // Skills data
    const skills = ref([
      { name: 'React', percentage: 84 },
      { name: 'Node.js', percentage: 77 },
      { name: 'PostgreSQL', percentage: 74 },
      { name: 'UI/UX Design', percentage: 95 },
      { name: 'Git/GitHub', percentage: 78 }
    ])

    const filteredProjects = computed(() => {
      if (activeFilter.value === 'all') {
        return projects.value
      }
      return projects.value.filter(project => project.featured)
    })

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength) + '...'
    }

    const openProjectModal = (project) => {
      selectedProject.value = project
      showProjectModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeProjectModal = () => {
      showProjectModal.value = false
      selectedProject.value = null
      document.body.style.overflow = 'auto'
    }

    const loadProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        projects.value = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      } catch (error) {
        console.error('Erro ao carregar projetos:', error)
        // Mock
        projects.value = [
          {
            id: 1,
            title: 'Projeto Portfolio',
            description: 'Site pessoal desenvolvido com Vue.js e Firebase para apresentar meus projetos e habilidades de desenvolvimento web.',
            technologies: ['Vue.js', 'Firebase', 'CSS', 'JavaScript'],
            featured: true,
            url: '#',
            github: '#',
            image: '/placeholder.svg?height=200&width=300&text=Portfolio'
          },
          {
            id: 2,
            title: 'E-commerce App',
            description: 'Aplicação de e-commerce completa com carrinho de compras, sistema de pagamento e painel administrativo.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            featured: true,
            url: '#',
            github: '#',
            image: '/placeholder.svg?height=200&width=300&text=E-commerce'
          },
          {
            id: 3,
            title: 'Task Manager',
            description: 'Sistema de gerenciamento de tarefas com funcionalidades de colaboração em equipe.',
            technologies: ['Next.js', 'PostgreSQL', 'Prisma'],
            featured: false,
            url: '#',
            github: '#',
            image: '/placeholder.svg?height=200&width=300&text=Tasks'
          }
        ]
      }
    }

    const loadTechnologies = async () => {
      try {
        const q = query(collection(db, 'technologies'), orderBy('name'))
        const querySnapshot = await getDocs(q)
        technologies.value = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      } catch (error) {
        console.error('Erro ao carregar tecnologias:', error)
        // Mock expandido
        technologies.value = [
          { id: 1, name: 'JavaScript', icon: '/placeholder.svg?height=64&width=64&text=JS' },
          { id: 2, name: 'Vue.js', icon: '/placeholder.svg?height=64&width=64&text=Vue' },
          { id: 3, name: 'React', icon: '/placeholder.svg?height=64&width=64&text=React' },
          { id: 4, name: 'Node.js', icon: '/placeholder.svg?height=64&width=64&text=Node' },
          { id: 5, name: 'Python', icon: '/placeholder.svg?height=64&width=64&text=Python' },
          { id: 6, name: 'TypeScript', icon: '/placeholder.svg?height=64&width=64&text=TS' },
          { id: 7, name: 'MongoDB', icon: '/placeholder.svg?height=64&width=64&text=Mongo' },
          { id: 8, name: 'PostgreSQL', icon: '/placeholder.svg?height=64&width=64&text=SQL' },
          { id: 9, name: 'Docker', icon: '/placeholder.svg?height=64&width=64&text=Docker' },
          { id: 10, name: 'AWS', icon: '/placeholder.svg?height=64&width=64&text=AWS' },
          { id: 11, name: 'Firebase', icon: '/placeholder.svg?height=64&width=64&text=Firebase' },
          { id: 12, name: 'Git', icon: '/placeholder.svg?height=64&width=64&text=Git' }
        ]
      }
    }

    const loadSettings = async () => {
      try {
        // Carregar configurações do site
        const siteDocRef = doc(db, 'settings', 'site')
        const siteDocSnap = await getDoc(siteDocRef)
        if (siteDocSnap.exists()) {
          const data = siteDocSnap.data()
          settings.value = data
        }

        // Carregar configurações do hero
        const heroDocRef = doc(db, 'settings', 'hero')
        const heroDocSnap = await getDoc(heroDocRef)
        if (heroDocSnap.exists()) {
          const heroData = heroDocSnap.data()
          if (heroData.messages && heroData.messages.length > 0) {
            messages.splice(0, messages.length, ...heroData.messages)
          }
          // Aplicar outras configurações do hero se necessário
          if (heroData.typingSpeed) TYPING_SPEED = heroData.typingSpeed
          if (heroData.deletingSpeed) DELETING_SPEED = heroData.deletingSpeed
          if (heroData.pauseEnd) PAUSE_END = heroData.pauseEnd
          if (heroData.pauseStart) PAUSE_START = heroData.pauseStart
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }

    const loadSkills = async () => {
      try {
        const q = query(collection(db, 'skills'), orderBy('name'))
        const querySnapshot = await getDocs(q)
        const loadedSkills = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        if (loadedSkills.length > 0) {
          skills.value = loadedSkills
        }
      } catch (error) {
        console.error('Erro ao carregar habilidades:', error)
      }
    }

    const filterProjects = (filter) => {
      activeFilter.value = filter
    }

    const sendMessage = async () => {
      sending.value = true
      successMessage.value = ''
      errorMessage.value = ''
      
      try {
        await addDoc(collection(db, 'messages'), {
          ...form.value,
          createdAt: new Date(),
          read: false
        })
        
        successMessage.value = 'Mensagem enviada com sucesso! Entrarei em contato em breve.'
        form.value = { name: '', email: '', message: '' }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        errorMessage.value = 'Erro ao enviar mensagem. Tente novamente.'
      } finally {
        sending.value = false
      }
    }

    // Duplicação para carrossel
    const allTechnologies = computed(() => {
      if (technologies.value.length < 8) {
        return [...technologies.value, ...technologies.value, ...technologies.value]
      }
      return technologies.value
    })

    onMounted(async () => {
      console.log('🚀 Componente Home montado')
      console.log('📸 Hero backgrounds:', { heroBackgroundLight, heroBackgroundDark })
      
      await loadSettings()
      
      tick()
      loadProjects()
      loadTechnologies()
      loadSkills()
    })

    onBeforeUnmount(() => {
      if (timer) clearTimeout(timer)
    })

    return {
      displayedText,
      projects,
      technologies,
      allTechnologies,
      animationDuration,
      settings,
      filteredProjects,
      activeFilter,
      skills,
      form,
      sending,
      successMessage,
      errorMessage,
      showProjectModal,
      selectedProject,
      isDarkMode,
      heroBackgroundLight,
      heroBackgroundDark,
      filterProjects,
      sendMessage,
      truncateText,
      openProjectModal,
      closeProjectModal
    }
  }
}
</script>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 0 !important;
  transition: all 0.5s ease;
  animation: heroGlow 6s ease-in-out infinite alternate;
}

/* Enhanced glow animation for futuristic effect */
@keyframes heroGlow {
  0% {
    filter: brightness(1) blur(0px);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.05) blur(0.3px);
    transform: scale(1.002);
  }
  100% {
    filter: brightness(1.1) blur(0.5px);
    transform: scale(1.005);
  }
}

.hero-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
}

.typed {
  /* deixa a largura se ajustar ao texto */
}

.cursor {
  display: inline-block;
  margin-left: 4px;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border: 2px solid var(--accent);
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) rotate(-45deg) translateY(0);
  }
  40% {
    transform: translateX(-50%) rotate(-45deg) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) rotate(-45deg) translateY(-5px);
  }
}

/* Projetos */
.projects-filter {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 60px;
}

.filter-btn {
  background: transparent;
  border: 2px solid var(--border);
  color: var(--text-secondary);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
  transform: translateY(-2px);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  max-width: 350px;
  margin: 0 auto;
  border-radius: 12px;
  background: var(--bg-card);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.project-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-quick-view {
  background: var(--accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-quick-view:hover {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.project-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.project-content {
  padding: 24px;
}

.project-title {
  color: var(--text-primary);
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-desc {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  align-items: center;
}

.tech-tag {
  background: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-more {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.project-action {
  display: inline-flex;
  margin-top: 8px;
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.project-action:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.project-action span {
  transition: transform 0.3s ease;
}

.project-action:hover span {
  transform: translateX(4px);
}

/* Modal de Projeto */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.project-modal {
  background: var(--bg-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.modal-content {
  padding: 0;
}

.project-modal-image {
  position: relative;
  width: 100%;
  min-height: 250px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.project-modal-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  object-position: center;
}

.project-modal-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--accent);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-modal-info {
  padding: 32px;
}

.project-modal-description {
  margin-bottom: 32px;
}

.project-modal-description h4 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.project-modal-description p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}

.project-modal-tech {
  margin-bottom: 32px;
}

.project-modal-tech h4 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-tags .tech-tag {
  background: var(--accent);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.project-modal-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.project-modal-links .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* Carrossel de Tecnologias */
.tech-carousel-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 40px 0;
}

.tech-carousel {
  display: flex;
  width: fit-content;
}

.tech-track {
  display: flex;
  gap: 32px;
  animation: scroll-left linear infinite;
  will-change: transform;
}

.tech-track-duplicate {
  margin-left: 32px;
}

.tech-card-carousel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 150px;
  flex-shrink: 0;
}

.tech-card-carousel:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
}

.tech-card-carousel .tech-icon {
  margin-bottom: 16px;
}

.tech-card-carousel .tech-icon img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.tech-card-carousel:hover .tech-icon img {
  filter: grayscale(0%);
}

.tech-card-carousel h3 {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.tech-carousel-container:hover .tech-track {
  animation-play-state: paused;
}

.tech-grid-fallback {
  display: none;
}

/* Sobre */
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.about-description {
  margin-bottom: 40px;
}

.about-description p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
  font-size: 1.1rem;
}

.quote {
  padding: 32px;
  background: var(--bg-card);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
}

.quote blockquote {
  font-style: italic;
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.skills-section h3 {
  color: var(--text-primary);
  margin-bottom: 32px;
  font-size: 1.5rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skill-item {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.skill-name {
  font-weight: 600;
  color: var(--text-primary);
}

.skill-percentage {
  color: var(--accent);
  font-weight: 600;
}

.skill-bar {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #2563eb);
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

/* Contato */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.contact-info h3 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 16px;
}

.contact-info > p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40px;
}

.contact-methods {
  margin-bottom: 40px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.contact-method:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.method-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 50%;
}

.method-content h4 {
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 1rem;
}

.method-content p {
  color: var(--accent);
  font-weight: 500;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.contact-form-container {
  background: var(--bg-card);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.contact-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.success-message {
  color: #10b981;
  margin-top: 16px;
  font-weight: 500;
}

.error-message {
  color: #ef4444;
  margin-top: 16px;
  font-weight: 500;
}

.no-projects,
.no-technologies {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .projects-filter {
    flex-wrap: wrap;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .project-card {
    max-width: 100%;
  }

  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .contact-form-container {
    padding: 24px;
  }
  
  .contact-method {
    padding: 16px;
  }
  
  .social-links {
    flex-wrap: wrap;
  }

  .tech-track {
    gap: 20px;
  }
  
  .tech-track-duplicate {
    margin-left: 20px;
  }

  .tech-card-carousel {
    min-width: 120px;
    padding: 16px;
  }

  .tech-card-carousel .tech-icon img {
    width: 48px;
    height: 48px;
  }

  .project-modal {
    margin: 10px;
    max-width: none;
  }

  .project-modal-info {
    padding: 24px;
  }

  .project-modal-links {
    flex-direction: column;
  }

  .project-modal-links .btn {
    justify-content: center;
  }
}
</style>
