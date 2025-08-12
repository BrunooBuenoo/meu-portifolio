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
        secondary: '#f8fafc',
        card: '#f1f5f9',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        textMuted: '#64748b',
        accent: '#3b82f6',
        accentHover: '#2563eb',
        border: '#e2e8f0'
      },
      dark: {
        primary: '#0f172a',
        secondary: '#1e293b',
        card: '#334155',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
        accent: '#3b82f6',
        accentHover: '#2563eb',
        border: '#475569'
      }
    })

    const themeConfig = ref({
      dark: {
        heroBackground: {
          circleColor: '#3b82f6',
          circleOpacity: 30,
          circleSize: 120,
          circleX: 50,
          circleY: 50,
          innerGlowColor: '#60a5fa',
          innerGlowOpacity: 20,
          outerGlowColor: '#1d4ed8',
          outerGlowOpacity: 10
        }
      },
      light: {
        heroBackground: {
          circleColor: '#e2e8f0',
          circleOpacity: 40,
          circleSize: 120,
          circleX: 50,
          circleY: 50,
          innerGlowColor: '#cbd5e1',
          innerGlowOpacity: 30,
          outerGlowColor: '#94a3b8',
          outerGlowOpacity: 15
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

      await loadThemeColors()
      await loadThemeConfig()
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
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --border: #475569;
  --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --hero-circle-color: #3b82f6;
  --hero-circle-opacity: 0.3;
  --hero-circle-size: 120%;
  --hero-circle-x: 50%;
  --hero-circle-y: 50%;
  --hero-inner-glow-color: #60a5fa;
  --hero-inner-glow-opacity: 0.2;
  --hero-outer-glow-color: #1d4ed8;
  --hero-outer-glow-opacity: 0.1;
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
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
}

.btn-outline:hover {
  background: var(--accent);
  color: white;
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
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
