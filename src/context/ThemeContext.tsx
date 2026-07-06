'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

interface ThemeColors {
  primary: string
  secondary: string
  card: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accent: string
  accentHover: string
  border: string
}

interface ThemeConfig {
  light: ThemeColors
  dark: ThemeColors
}

interface HeroBackgroundConfig {
  circleColor: string
  circleOpacity: number
  circleSize: number
  circleX: number
  circleY: number
  innerGlowColor: string
  innerGlowOpacity: number
  outerGlowColor: string
  outerGlowOpacity: number
}

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  themeColors: ThemeConfig
  heroBackground: HeroBackgroundConfig | null
  applyThemeColors: () => void
  setThemeColors: React.Dispatch<React.SetStateAction<ThemeConfig>>
  setHeroBackground: React.Dispatch<React.SetStateAction<HeroBackgroundConfig | null>>
}

const defaultColors: ThemeConfig = {
  light: {
    primary: '#ffffff',
    secondary: '#fafafa',
    card: '#ffffff',
    textPrimary: '#000000',
    textSecondary: '#444444',
    textMuted: '#888888',
    accent: '#000000',
    accentHover: '#333333',
    border: '#eaeaea',
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
    border: '#333333',
  },
}

const defaultHeroConfig: HeroBackgroundConfig = {
  circleColor: '#ffffff',
  circleOpacity: 10,
  circleSize: 80,
  circleX: 50,
  circleY: 50,
  innerGlowColor: '#1e293b',
  innerGlowOpacity: 10,
  outerGlowColor: '#0f172a',
  outerGlowOpacity: 5,
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  themeColors: defaultColors,
  heroBackground: null,
  applyThemeColors: () => {},
  setThemeColors: () => {},
  setHeroBackground: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [themeColors, setThemeColors] = useState<ThemeConfig>(defaultColors)
  const [heroBackground, setHeroBackground] = useState<HeroBackgroundConfig | null>(defaultHeroConfig)

  const applyThemeColors = () => {
    const currentTheme = isDarkMode ? 'dark' : 'light'
    const colors = themeColors[currentTheme]
    const root = document.documentElement

    // Aplica as variáveis de cores globais
    root.style.setProperty('--bg-primary', colors.primary)
    root.style.setProperty('--bg-secondary', colors.secondary)
    root.style.setProperty('--bg-card', colors.card)
    root.style.setProperty('--text-primary', colors.textPrimary)
    root.style.setProperty('--text-secondary', colors.textSecondary)
    root.style.setProperty('--text-muted', colors.textMuted)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--accent-hover', colors.accentHover)
    root.style.setProperty('--border', colors.border)

    // Suporte legado
    root.style.setProperty('--primary-bg', colors.primary)
    root.style.setProperty('--secondary-bg', colors.secondary)
    root.style.setProperty('--accent-color', colors.accent)
    root.style.setProperty('--card-bg', colors.card)
    root.style.setProperty('--border-color', colors.border)

    // Aplica a configuração do background do hero
    if (heroBackground) {
      root.style.setProperty('--hero-circle-color', heroBackground.circleColor)
      root.style.setProperty('--hero-circle-opacity', (heroBackground.circleOpacity / 100).toString())
      root.style.setProperty('--hero-circle-size', heroBackground.circleSize + '%')
      root.style.setProperty('--hero-circle-x', heroBackground.circleX + '%')
      root.style.setProperty('--hero-circle-y', heroBackground.circleY + '%')
      root.style.setProperty('--hero-inner-glow-color', heroBackground.innerGlowColor)
      root.style.setProperty('--hero-inner-glow-opacity', (heroBackground.innerGlowOpacity / 100).toString())
      root.style.setProperty('--hero-outer-glow-color', heroBackground.outerGlowColor)
      root.style.setProperty('--hero-outer-glow-opacity', (heroBackground.outerGlowOpacity / 100).toString())
    }

    // Dispara evento customizado para outros componentes que necessitam saber
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('themeUpdated', {
          detail: { theme: currentTheme, colors, heroConfig: heroBackground },
        })
      )
    }
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newVal = !prev
      localStorage.setItem('darkMode', String(newVal))
      if (newVal) {
        document.documentElement.classList.add('dark-theme')
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark-theme')
        document.documentElement.classList.remove('dark')
      }
      return newVal
    })
  }

  // Carrega configurações iniciais do localStorage e Firebase
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    const initialDarkMode = savedTheme !== null ? savedTheme === 'true' : true
    setIsDarkMode(initialDarkMode)

    if (initialDarkMode) {
      document.documentElement.classList.add('dark-theme')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark-theme')
      document.documentElement.classList.remove('dark')
    }

    const loadData = async () => {
      try {
        // Carrega cores do tema no Firestore
        const colorsRef = doc(db, 'theme', 'colors')
        const colorsSnap = await getDoc(colorsRef)
        if (colorsSnap.exists()) {
          setThemeColors((prev) => ({ ...prev, ...colorsSnap.data() }))
        }

        // Carrega configuração de background do Hero no Firestore
        const configRef = doc(db, 'theme', 'config')
        const configSnap = await getDoc(configRef)
        if (configSnap.exists()) {
          const data = configSnap.data()
          const currentTheme = initialDarkMode ? 'dark' : 'light'
          if (data[currentTheme]?.heroBackground) {
            setHeroBackground(data[currentTheme].heroBackground)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do tema do Firebase:', err)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    applyThemeColors()
  }, [isDarkMode, themeColors, heroBackground])

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        themeColors,
        heroBackground,
        applyThemeColors,
        setThemeColors,
        setHeroBackground,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
