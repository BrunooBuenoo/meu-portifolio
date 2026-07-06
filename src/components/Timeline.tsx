'use client'

import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { motion } from 'framer-motion'

interface TimelineItem {
  date: string
  title: string
  company: string
  description: string
  skills: string[]
}

export default function Timeline({ id }: { id?: string }) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      date: '2024 - Presente',
      title: 'Desenvolvedor Full Stack Freelancer',
      company: 'Autônomo',
      description: 'Desenvolvimento de aplicações web modernas usando Vue.js, React, Node.js e Firebase. Foco em soluções escaláveis e experiência do usuário.',
      skills: ['Vue.js', 'React', 'Node.js', 'Firebase', 'TypeScript'],
    },
    {
      date: '2023 - 2024',
      title: 'Desenvolvedor Frontend Sênior',
      company: 'TechCorp Solutions',
      description: 'Liderança técnica em projetos de grande escala, mentoria de desenvolvedores júnior e implementação de melhores práticas de desenvolvimento.',
      skills: ['React', 'Next.js', 'GraphQL', 'AWS', 'Docker'],
    },
    {
      date: '2022 - 2023',
      title: 'Desenvolvedor Full Stack',
      company: 'StartupXYZ',
      description: 'Desenvolvimento de MVP para startup de tecnologia, desde a concepção até o deploy em produção.',
      skills: ['Vue.js', 'Python', 'PostgreSQL', 'Redis', 'Kubernetes'],
    },
    {
      date: '2021 - 2022',
      title: 'Desenvolvedor Frontend',
      company: 'WebAgency Pro',
      description: 'Criação de interfaces responsivas e interativas para diversos clientes, com foco em performance e acessibilidade.',
      skills: ['JavaScript', 'CSS3', 'SASS', 'Webpack', 'Git'],
    },
  ])

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const docRef = doc(db, 'settings', 'timeline')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.timeline && data.timeline.length > 0) {
            setTimelineItems(data.timeline)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar a timeline do Firebase:', error)
      }
    }

    loadTimeline()

    const handleTimelineUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && customEvent.detail.length > 0) {
        setTimelineItems(customEvent.detail)
      }
    }

    window.addEventListener('timelineUpdated', handleTimelineUpdate)
    return () => window.removeEventListener('timelineUpdated', handleTimelineUpdate)
  }, [])

  return (
    <section id={id} className="py-24 bg-secondary transition-colors duration-400 relative">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-center text-txt-primary tracking-tight mb-16 font-sans">
          Minha <span className="text-txt-secondary font-normal font-sans">Jornada</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Linha vertical central e fina */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-border-custom transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row relative w-full ${
                    isLeft ? 'md:justify-start' : 'md:justify-end'
                  }`}
                >
                  {/* Dot indicador limpo e fino */}
                  <div className="absolute left-4 md:left-1/2 top-5 w-4 h-4 transform -translate-x-1/2 flex items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="w-3.5 h-3.5 rounded-full bg-txt-primary border-4 border-secondary"
                    />
                  </div>

                  {/* Card com efeito Apple (Glow in-view) */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    className={`w-full md:w-[46%] pl-10 md:pl-0 ${
                      isLeft ? 'md:pr-8 text-left' : 'md:pl-8 text-left'
                    }`}
                  >
                    <div className="p-6 bg-primary border border-border-custom/80 rounded-2xl shadow-apple hover:shadow-apple-hover hover:border-txt-primary/10 transition-all duration-300 relative group">
                      <span className="text-[10px] font-bold text-txt-secondary uppercase tracking-wider block mb-2 font-sans">
                        {item.date}
                      </span>
                      <h3 className="text-lg font-bold text-txt-primary mb-1 font-sans">
                        {item.title}
                      </h3>
                      <h4 className="text-xs font-semibold text-txt-secondary mb-4 font-sans">
                        {item.company}
                      </h4>
                      <p className="text-txt-secondary text-xs leading-relaxed mb-6">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 text-[10px] bg-secondary border border-border-custom/75 rounded-md text-txt-secondary font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
