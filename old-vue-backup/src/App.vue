<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <Navbar />
    <router-view />
    <Footer v-if="$route.name !== 'admin' && $route.name !== 'login'" />
  </div>
</template>

<script>
import { ref, provide, onMounted, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const isDarkMode = ref(true)
    const user = ref(null)
    const themeColors = ref({
      light: {
        primary: '#ffffff',
        secondary: '#fafafa',
        card: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#444444',
        textMuted: '#888888',
        accent: '#000000',
        accentHover: '#333333',
        border: '#eaeaea'
      },
      dark: {
        primary: '#000000',
        secondary: '#111111',
        card: '#000000',
        textPrimary: '#ffffff',
        textSecondary: '#a1a1a1',
        textMuted: '#666666',
        accent: '#ffffff',
        accentHover: '#cccccc',
        border: '#333333'
      }
    })

    const themeConfig = ref({
      dark: {
        heroBackground: {
          circleColor: '#111111',
          circleOpacity: 0,
          circleSize: 0,
          circleX: 0,
          circleY: 0,
          innerGlowColor: '#000000',
          innerGlowOpacity: 0,
          outerGlowColor: '#000000',
          outerGlowOpacity: 0
        }
      },
      light: {
        heroBackground: {
          circleColor: '#fafafa',
          circleOpacity: 0,
          circleSize: 0,
          circleX: 0,
          circleY: 0,
          innerGlowColor: '#ffffff',
          innerGlowOpacity: 0,
          outerGlowColor: '#ffffff',
          outerGlowOpacity: 0
        }
      }
    })

    const applyThemeColors = () => {
      const currentTheme = isDarkMode.value ? 'dark' : 'light'
      const colors = themeColors.value[currentTheme]
      const heroConfig = themeConfig.value[currentTheme]?.heroBackground
      
      const root = document.documentElement
      
      // Apply color variables
      root.style.setProperty('--bg-primary', colors.primary)
      root.style.setProperty('--bg-secondary', colors.secondary)
      root.style.setProperty('--bg-card', colors.card)
      root.style.setProperty('--text-primary', colors.textPrimary)
      root.style.setProperty('--text-secondary', colors.textSecondary)
      root.style.setProperty('--text-muted', colors.textMuted)
      root.style.setProperty('--accent', colors.accent)
      root.style.setProperty('--accent-hover', colors.accentHover)
      root.style.setProperty('--border', colors.border)
      
      // Legacy support
      root.style.setProperty('--primary-bg', colors.primary)
      root.style.setProperty('--secondary-bg', colors.secondary)
      root.style.setProperty('--accent-color', colors.accent)
      root.style.setProperty('--card-bg', colors.card)
      root.style.setProperty('--border-color', colors.border)
      
      // Apply hero background configuration
      if (heroConfig) {
        root.style.setProperty('--hero-circle-color', heroConfig.circleColor)
        root.style.setProperty('--hero-circle-opacity', (heroConfig.circleOpacity / 100).toString())
        root.style.setProperty('--hero-circle-size', heroConfig.circleSize + '%')
        root.style.setProperty('--hero-circle-x', heroConfig.circleX + '%')
        root.style.setProperty('--hero-circle-y', heroConfig.circleY + '%')
        root.style.setProperty('--hero-inner-glow-color', heroConfig.innerGlowColor)
        root.style.setProperty('--hero-inner-glow-opacity', (heroConfig.innerGlowOpacity / 100).toString())
        root.style.setProperty('--hero-outer-glow-color', heroConfig.outerGlowColor)
        root.style.setProperty('--hero-outer-glow-opacity', (heroConfig.outerGlowOpacity / 100).toString())
        
        // Trigger a custom event to notify components about theme change
        window.dispatchEvent(new CustomEvent('themeUpdated', { 
          detail: { theme: currentTheme, heroConfig, colors } 
        }))
      }
    }

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('darkMode', isDarkMode.value)
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
      applyThemeColors()
    }

    const loadThemeColors = async () => {
      try {
        const docRef = doc(db, 'theme', 'colors')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          themeColors.value = { ...themeColors.value, ...docSnap.data() }
        }
      } catch (error) {
        console.error('Erro ao carregar cores do tema:', error)
      }
    }

    const loadThemeConfig = async () => {
      try {
        const docRef = doc(db, 'theme', 'config')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          themeConfig.value = { ...themeConfig.value, ...docSnap.data() }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error)
      }
    }

    onMounted(async () => {
      const savedTheme = localStorage.getItem('darkMode')
      if (savedTheme !== null) {
        isDarkMode.value = savedTheme === 'true'
      }

      if (isDarkMode.value) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }

      // Desativado para garantir o novo tema minimalista preto/branco
      // await loadThemeColors()
      // await loadThemeConfig()
      applyThemeColors()

      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
      })
    })

    watch(isDarkMode, () => {
      applyThemeColors()
    })

    watch(themeColors, () => {
      applyThemeColors()
    }, { deep: true })

    watch(themeConfig, () => {
      applyThemeColors()
    }, { deep: true })

    provide('theme', { 
      isDarkMode, 
      toggleTheme, 
      themeColors,
      themeConfig,
      applyThemeColors 
    })
    provide('auth', { user })

    return {
      isDarkMode,
      toggleTheme
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

:root {
  --bg-primary: #000000;
  --bg-secondary: #111111;
  --bg-card: #000000;
  --text-primary: #ffffff;
  --text-secondary: #a1a1a1;
  --text-muted: #666666;
  --accent: #ffffff;
  --accent-hover: #cccccc;
  --border: #333333;
  --gradient: none;
  --hero-circle-color: transparent;
  --hero-circle-opacity: 0;
  --hero-circle-size: 0%;
  --hero-circle-x: 0%;
  --hero-circle-y: 0%;
  --hero-inner-glow-color: transparent;
  --hero-inner-glow-opacity: 0;
  --hero-outer-glow-color: transparent;
  --hero-outer-glow-opacity: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.btn-primary {
  background: var(--text-primary);
  color: var(--bg-primary);
  border: 1px solid var(--text-primary);
}

.btn-primary:hover {
  background: transparent;
  color: var(--text-primary);
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.section {
  padding: 80px 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
}

.gradient-text {
  color: var(--text-primary);
}

.card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.grid {
  display: grid;
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

section[id] {
  scroll-margin-top: 80px;
}

@media (max-width: 768px) {
  .section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .container {
    padding: 0 16px;
  }
}
</style>
