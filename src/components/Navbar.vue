<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <router-link to="/admin" class="logo">
          BB
        </router-link>
        
        <div class="nav-links" :class="{ active: isMenuOpen }">
          <a href="#home" @click="closeMenu" class="nav-link">Home</a>
          <a href="#timeline" @click="closeMenu" class="nav-link">Jornada</a>
          <a href="#projetos" @click="closeMenu" class="nav-link">Projetos</a>
          <a href="#tecnologias" @click="closeMenu" class="nav-link">Tecnologias</a>
          <a href="#sobre" @click="closeMenu" class="nav-link">Sobre</a>
          <a href="#contato" @click="closeMenu" class="nav-link">Contato</a>
          
          <!-- Switch tema -->
          <label class="switch" @click="handleThemeToggle">
            <input
              type="checkbox"
              :checked="isDarkMode"
              @change="toggleTheme"
              class="theme-input"
            />
            <div class="slider round">
              <div class="sun-moon">
                <!-- Pontos da lua -->
                <div class="moon-dot moon-dot-1"></div>
                <div class="moon-dot moon-dot-2"></div>
                <div class="moon-dot moon-dot-3"></div>
                
                <!-- Raios do sol -->
                <div class="light-ray light-ray-1"></div>
                <div class="light-ray light-ray-2"></div>
                <div class="light-ray light-ray-3"></div>
                <div class="light-ray light-ray-4"></div>
                <div class="light-ray light-ray-5"></div>
                <div class="light-ray light-ray-6"></div>
                <div class="light-ray light-ray-7"></div>
                <div class="light-ray light-ray-8"></div>
              </div>
              
              <!-- Estrelas para modo escuro -->
              <div class="stars" :class="{ visible: isDarkMode }">
                <div class="star star-1">✦</div>
                <div class="star star-2">✧</div>
                <div class="star star-3">✦</div>
                <div class="star star-4">✧</div>
              </div>
            </div>
          </label>
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

export default {
  name: 'Navbar',
  setup() {
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
        handleThemeToggle: () => {}
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

    return {
      isMenuOpen,
      isDarkMode,
      toggleTheme,
      toggleMenu,
      closeMenu,
      handleThemeToggle
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.3s ease;
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
}

.nav-links .nav-link:hover,
.nav-links .nav-link.active {
  color: var(--accent);
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

/* Switch de tema */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  cursor: pointer;
}

.theme-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #87CEEB, #4169E1);
  transition: all 0.4s ease;
  border-radius: 34px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.theme-input:checked + .slider {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.sun-moon {
  position: absolute;
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.theme-input:checked + .slider .sun-moon {
  transform: translateX(26px);
  background: radial-gradient(circle, #F5F5DC, #D3D3D3);
  animation: rotate 0.6s ease-in-out;
}

/* Pontos da lua */
.moon-dot {
  position: absolute;
  background: #999;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.theme-input:checked + .slider .moon-dot {
  opacity: 1;
}

.moon-dot-1 {
  width: 3px;
  height: 3px;
  top: 6px;
  left: 8px;
}

.moon-dot-2 {
  width: 2px;
  height: 2px;
  top: 12px;
  left: 5px;
}

.moon-dot-3 {
  width: 2px;
  height: 2px;
  top: 16px;
  left: 15px;
}

/* Raios do sol */
.light-ray {
  position: absolute;
  background: #FFD700;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.theme-input:not(:checked) + .slider .light-ray {
  opacity: 0.6;
}

.light-ray-1 { width: 2px; height: 8px; top: -10px; left: 12px; }
.light-ray-2 { width: 2px; height: 8px; bottom: -10px; left: 12px; }
.light-ray-3 { width: 8px; height: 2px; left: -10px; top: 12px; }
.light-ray-4 { width: 8px; height: 2px; right: -10px; top: 12px; }
.light-ray-5 { width: 2px; height: 6px; top: -8px; left: 6px; transform: rotate(45deg); }
.light-ray-6 { width: 2px; height: 6px; top: -8px; right: 6px; transform: rotate(-45deg); }
.light-ray-7 { width: 2px; height: 6px; bottom: -8px; left: 6px; transform: rotate(-45deg); }
.light-ray-8 { width: 2px; height: 6px; bottom: -8px; right: 6px; transform: rotate(45deg); }

/* Estrelas */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stars.visible {
  opacity: 1;
}

.star {
  position: absolute;
  color: white;
  font-size: 8px;
  animation: twinkle 2s infinite;
}

.star-1 { top: 5px; left: 10px; animation-delay: 0s; }
.star-2 { top: 15px; right: 15px; animation-delay: 0.5s; }
.star-3 { bottom: 8px; left: 8px; animation-delay: 1s; }
.star-4 { top: 8px; right: 8px; animation-delay: 1.5s; }

@keyframes rotate {
  from { transform: translateX(26px) rotate(0deg); }
  to { transform: translateX(26px) rotate(360deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
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
