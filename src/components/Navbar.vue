<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <router-link to="/login" class="logo">
          BB
        </router-link>
        
        <div class="nav-links" :class="{ active: isMenuOpen }">
          <a @click="navigateToSection('home')" class="nav-link">Home</a>
          <a @click="navigateToSection('projetos')" class="nav-link">Projetos</a>
          <a @click="navigateToSection('experiencia')" class="nav-link">Experiência</a>
          <a @click="navigateToSection('certificacoes')" class="nav-link">Carreira</a>
          <a @click="navigateToSection('recomendacoes')" class="nav-link">Depoimentos</a>
          <a @click="navigateToSection('contato')" class="nav-link">Contato</a>
          
          <!-- Switch tema minimalista -->
          <button @click="handleThemeToggle" class="theme-toggle-btn" :title="isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'">
            <font-awesome-icon :icon="isDarkMode ? ['fas', 'moon'] : ['fas', 'sun']" class="theme-icon" />
          </button>
        </div>
        
        <button class="menu-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isMenuOpen = ref(false)
    const themeContext = inject('theme')
    
    if (!themeContext) {
      console.error('Theme context not found')
      return {
        isMenuOpen,
        isDarkMode: ref(true),
        toggleTheme: () => {},
        toggleMenu: () => {},
        closeMenu: () => {},
        handleThemeToggle: () => {},
        navigateToSection: () => {}
      }
    }
    
    const { isDarkMode, toggleTheme } = themeContext

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const handleThemeToggle = () => {
      console.log('Theme toggle clicked, current mode:', isDarkMode.value)
      toggleTheme()
      console.log('New mode:', isDarkMode.value)
    }

    const navigateToSection = async (sectionId) => {
      closeMenu()
      
      // Se estamos em qualquer página que não seja a home, navegar para home primeiro
      if (route.path !== '/') {
        console.log(`🧭 Navegando de ${route.path} para /#${sectionId}`)
        await router.push('/')
        
        // Aguardar um pouco para garantir que a página carregou
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 100)
      } else {
        // Se já estamos na home, apenas fazer scroll
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    return {
      isMenuOpen,
      isDarkMode,
      toggleTheme,
      toggleMenu,
      closeMenu,
      handleThemeToggle,
      navigateToSection
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid var(--border);
  transition: all 0.3s ease;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
  letter-spacing: -0.02em;
}

.logo:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links .nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-links .nav-link:hover,
.nav-links .nav-link.active {
  color: var(--text-primary);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.menu-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  margin: 3px 0;
  transition: all 0.3s ease;
}

.theme-toggle-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.theme-icon {
  color: var(--text-primary);
}

.theme-toggle-btn:hover {
  border-color: var(--text-primary);
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 24px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border-bottom: 1px solid var(--border);
  }

  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
