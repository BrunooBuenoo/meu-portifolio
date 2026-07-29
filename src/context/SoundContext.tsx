"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SoundContextProps {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("hero_sound_enabled");
    if (saved !== null) {
      setSoundEnabledState(saved === "true");
    }
  }, []);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("hero_sound_enabled", String(enabled));
  };

  const toggleSound = () => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      localStorage.setItem("hero_sound_enabled", String(next));
      return next;
    });
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound precisa ser usado dentro de um SoundProvider");
  }
  return context;
}
