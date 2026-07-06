'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')

  const messages = [
    'Conectando ao portfólio...',
    'Carregando módulos...',
    'Sincronizando banco de dados...',
    'Inicializando interface...',
  ]

  useEffect(() => {
    let messageIndex = 0
    setCurrentMessage(messages[0])

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + Math.random() * 18 + 7
        
        if (nextProgress >= 25 && nextProgress < 50) {
          setCurrentMessage(messages[1])
        } else if (nextProgress >= 50 && nextProgress < 75) {
          setCurrentMessage(messages[2])
        } else if (nextProgress >= 75) {
          setCurrentMessage(messages[3])
        }

        if (nextProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsLoading(false)
          }, 400)
          return 100
        }
        
        return nextProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.98,
            transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
          }}
          className="fixed inset-0 w-full h-full bg-primary flex flex-col items-center justify-center z-[9999] overflow-hidden"
        >
          <div className="text-center z-10 max-w-xs px-6">
            {/* Logo de Texto Estilo Apple */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-txt-primary tracking-tight font-sans">Bruno Bueno</h2>
              <p className="text-[10px] text-txt-secondary font-medium uppercase tracking-wider mt-1">Sistemas</p>
            </motion.div>

            {/* Spinner Apple style */}
            <div className="mb-8 flex justify-center">
              <svg className="animate-spin h-6 w-6 text-txt-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            {/* Progresso e Mensagem */}
            <div className="flex flex-col items-center space-y-3">
              <p className="text-[11px] font-medium text-txt-secondary tracking-tight min-h-[1.2rem]">
                {currentMessage}
              </p>
              {/* Barra de Progresso Apple */}
              <div className="w-36 h-[2px] bg-border-custom rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-txt-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
