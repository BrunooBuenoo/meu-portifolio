"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getThemeColors, getThemeConfig } from "@/lib/dataService";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  colors: any;
  config: any;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const SHARED_ACCENT = "#94ff47";
const SHARED_ACCENT_HOVER = "#a8ff6b";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Default to premium dark theme
  const [colors, setColors] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load local storage theme choice
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  // Fetch Firestore colors and configurations
  useEffect(() => {
    async function loadThemeData() {
      try {
        const themeColors = await getThemeColors();
        const themeConfig = await getThemeConfig();
        setColors(themeColors);
        setConfig(themeConfig);
      } catch (err) {
        console.error("Failed to load theme from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadThemeData();
  }, []);

  // Apply theme variables to DOM root
  useEffect(() => {
    const root = document.documentElement;
    
    // Toggle dark class
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);

    // Apply color custom properties
    if (colors && colors[theme]) {
      const themeColors = colors[theme];
      root.style.setProperty("--primary", themeColors.primary);
      root.style.setProperty("--secondary", themeColors.secondary);
      root.style.setProperty("--card", themeColors.card);
      root.style.setProperty("--text-primary", themeColors.textPrimary);
      root.style.setProperty("--text-secondary", themeColors.textSecondary);
      root.style.setProperty("--text-muted", themeColors.textMuted);
      root.style.setProperty("--accent", SHARED_ACCENT);
      root.style.setProperty("--accent-hover", SHARED_ACCENT_HOVER);
      root.style.setProperty("--border", themeColors.border);
    } else {
      // Fallback defaults
      if (theme === "dark") {
        root.style.setProperty("--primary", "#09090b");
        root.style.setProperty("--secondary", "#09090b");
        root.style.setProperty("--card", "rgba(9,9,11,0.5)");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255,255,255,0.7)");
        root.style.setProperty("--text-muted", "rgba(255,255,255,0.4)");
        root.style.setProperty("--accent", SHARED_ACCENT);
        root.style.setProperty("--accent-hover", SHARED_ACCENT_HOVER);
        root.style.setProperty("--border", "#27272a");
      } else {
        root.style.setProperty("--primary", "#ffffff");
        root.style.setProperty("--secondary", "#fafafa");
        root.style.setProperty("--card", "#f4f4f5");
        root.style.setProperty("--text-primary", "#09090b");
        root.style.setProperty("--text-secondary", "#52525b");
        root.style.setProperty("--text-muted", "#71717a");
        root.style.setProperty("--accent", SHARED_ACCENT);
        root.style.setProperty("--accent-hover", SHARED_ACCENT_HOVER);
        root.style.setProperty("--border", "#e4e4e7");
      }
    }
  }, [theme, colors]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, config, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
