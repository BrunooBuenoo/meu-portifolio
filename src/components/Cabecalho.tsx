"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface CabecalhoProps {
  name?: string;
}

export default function Cabecalho({ name = "Bueno" }: CabecalhoProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { label: "Sobre Mim", href: "#sobre-mim" },
    { label: "Serviços", href: "#servicos" },
    { label: "Tecnologias", href: "#tecnologias" },
    { label: "Projetos", href: "#projetos" },
    { label: "Jornada", href: "#jornada" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-primary/80 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative size-8 rounded-lg overflow-hidden bg-border/20 flex items-center justify-center border border-border/20 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z"
                fill="var(--accent)"
                className="transition-colors duration-300"
              />
              <circle cx="10" cy="10" r="2.5" fill="var(--primary)" className="transition-colors duration-300" />
            </svg>
          </div>
          <span className="font-sans font-semibold text-text-primary text-xl tracking-tight uppercase">
            {name.toLowerCase()}
            <span className="text-accent font-black">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans font-medium text-sm text-text-secondary hover:text-text-primary transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Actions (Theme + Contact Button) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-border/40 hover:bg-border/10 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <a
            href="#contato"
            className="bg-accent text-primary font-sans font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all cursor-pointer"
          >
            Falar Comigo
          </a>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border/40 text-text-secondary"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button
            className="p-2 text-text-primary border border-border/40 rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border/40 bg-primary/95 backdrop-blur-md px-6 py-6 flex flex-col gap-5 overflow-hidden"
          >
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-sans font-medium text-base text-text-secondary hover:text-text-primary transition-colors py-1.5"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-accent text-primary font-sans font-semibold text-base py-3 rounded-full hover:opacity-90 transition-all mt-2"
            >
              Falar Comigo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
