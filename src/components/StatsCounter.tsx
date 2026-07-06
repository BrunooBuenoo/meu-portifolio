'use client'

import React, { useEffect, useRef, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  icon: string
  number: number
  suffix: string
  label: string
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const duration = 2000

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setDisplayValue(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isInView, value])

  return <span ref={ref}>{displayValue}</span>
}

export default function StatsCounter() {
  const [stats, setStats] = useState<StatItem[]>([
    { icon: '🚀', number: 25, suffix: '+', label: 'Projetos Concluídos' },
    { icon: '⭐', number: 98, suffix: '%', label: 'Satisfação do Cliente' },
    { icon: '☕', number: 1247, suffix: '', label: 'Xícaras de Café' },
    { icon: '🏆', number: 15, suffix: '+', label: 'Prêmios Recebidos' },
  ])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const docRef = doc(db, 'settings', 'stats')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.stats && data.stats.length > 0) {
            setStats(data.stats)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas do Firebase:', error)
      }
    }

    loadStats()

    const handleStatsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && customEvent.detail.length > 0) {
        setStats(customEvent.detail)
      }
    }

    window.addEventListener('statsUpdated', handleStatsUpdate)
    return () => window.removeEventListener('statsUpdated', handleStatsUpdate)
  }, [])

  return (
    <section className="py-20 bg-primary border-t border-b border-border-custom/50 transition-colors duration-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
              className="text-center p-8 bg-primary border border-border-custom/70 rounded-2xl shadow-apple hover:shadow-apple-hover hover:border-txt-primary/10 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 transform group-hover:scale-105 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold text-txt-primary tracking-tight mb-2 font-sans">
                <AnimatedNumber value={stat.number} />
                {stat.suffix}
              </div>
              <div className="text-[11px] font-semibold text-txt-secondary uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
