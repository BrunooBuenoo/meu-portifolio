'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navigateToSection = async (sectionId: string) => {
    closeMenu()
    
    if (pathname !== '/') {
      router.push(`/#${sectionId}`)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-custom/50 h-12 flex items-center transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="text-sm font-semibold text-txt-primary hover:opacity-70 transition-opacity tracking-tight font-sans">
            Bruno Bueno
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigateToSection('home')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Início
            </button>
            <button onClick={() => navigateToSection('projetos')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Projetos
            </button>
            <button onClick={() => navigateToSection('experiencia')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Experiência
            </button>
            <button onClick={() => navigateToSection('certificacoes')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Carreira
            </button>
            <button onClick={() => navigateToSection('recomendacoes')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Depoimentos
            </button>
            <button onClick={() => navigateToSection('contato')} className="text-xs text-txt-secondary hover:text-txt-primary font-normal transition-colors cursor-pointer tracking-wide">
              Contato
            </button>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-txt-primary hover:text-txt-secondary transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden fixed top-12 left-0 right-0 border-b border-border-custom/50 bg-primary/95 backdrop-blur-lg overflow-hidden flex flex-col p-6 space-y-4"
          >
            <button
              onClick={() => navigateToSection('home')}
              className="text-left py-2 border-b border-border-custom/30 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => navigateToSection('projetos')}
              className="text-left py-2 border-b border-border-custom/30 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Projetos
            </button>
            <button
              onClick={() => navigateToSection('experiencia')}
              className="text-left py-2 border-b border-border-custom/30 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Experiência
            </button>
            <button
              onClick={() => navigateToSection('certificacoes')}
              className="text-left py-2 border-b border-border-custom/30 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Carreira
            </button>
            <button
              onClick={() => navigateToSection('recomendacoes')}
              className="text-left py-2 border-b border-border-custom/30 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Depoimentos
            </button>
            <button
              onClick={() => navigateToSection('contato')}
              className="text-left py-2 text-sm text-txt-secondary hover:text-txt-primary font-normal transition-all cursor-pointer"
            >
              Contato
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
