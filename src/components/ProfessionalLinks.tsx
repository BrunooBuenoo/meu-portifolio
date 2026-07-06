'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, FileDown } from 'lucide-react'

// Ícone do LinkedIn em SVG (removido das versões recentes do Lucide)
const LinkedInIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function ProfessionalLinks({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-primary relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl mx-auto p-12 bg-primary border border-border-custom rounded-2xl text-center"
        >
          <h2 className="text-3xl font-extrabold text-txt-primary mb-4 tracking-tight">
            Vamos nos <span className="opacity-40 font-normal">conectar?</span>
          </h2>
          <p className="text-txt-secondary text-base mb-8 max-w-lg mx-auto">
            Estou sempre aberto a novas oportunidades e conexões. Veja meu perfil completo e recomendações nestas plataformas.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://linkedin.com/in/seuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a66c2] text-white border border-[#0a66c2] rounded-lg font-semibold w-full sm:w-auto transition-opacity hover:opacity-90"
            >
              <LinkedInIcon size={18} />
              <span>LinkedIn</span>
            </motion.a>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://glassdoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-txt-primary border border-border-custom hover:border-txt-primary rounded-lg font-semibold w-full sm:w-auto transition-colors"
            >
              <Briefcase size={18} />
              <span>Glassdoor</span>
            </motion.a>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/curriculo.pdf"
              download
              className="flex items-center justify-center gap-2 px-6 py-3 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary rounded-lg font-semibold w-full sm:w-auto transition-colors"
            >
              <FileDown size={18} />
              <span>Baixar CV</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
