'use client'

import React, { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/config'
import Image from 'next/image'

interface Technology {
  id: string | number
  name: string
  icon: string
  category?: string
}

export default function TechCarousel() {
  const [technologies, setTechnologies] = useState<Technology[]>([])

  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const q = query(collection(db, 'technologies'), orderBy('name'))
        const querySnapshot = await getDocs(q)
        const loadedTechs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Technology[]

        if (loadedTechs.length > 0) {
          setTechnologies(loadedTechs)
        } else {
          useMockData()
        }
      } catch (error) {
        console.error('Erro ao carregar tecnologias do Firebase:', error)
        useMockData()
      }
    }

    const useMockData = () => {
      setTechnologies([
        { id: 1, name: 'JavaScript', icon: '/placeholder.svg?height=64&width=64&text=JS' },
        { id: 2, name: 'Vue.js', icon: '/placeholder.svg?height=64&width=64&text=Vue' },
        { id: 3, name: 'React', icon: '/placeholder.svg?height=64&width=64&text=React' },
        { id: 4, name: 'Node.js', icon: '/placeholder.svg?height=64&width=64&text=Node' },
        { id: 5, name: 'Python', icon: '/placeholder.svg?height=64&width=64&text=Python' },
        { id: 6, name: 'TypeScript', icon: '/placeholder.svg?height=64&width=64&text=TS' },
        { id: 7, name: 'MongoDB', icon: '/placeholder.svg?height=64&width=64&text=Mongo' },
        { id: 8, name: 'PostgreSQL', icon: '/placeholder.svg?height=64&width=64&text=SQL' },
        { id: 9, name: 'Docker', icon: '/placeholder.svg?height=64&width=64&text=Docker' },
        { id: 10, name: 'AWS', icon: '/placeholder.svg?height=64&width=64&text=AWS' },
        { id: 11, name: 'Firebase', icon: '/placeholder.svg?height=64&width=64&text=Firebase' },
        { id: 12, name: 'Git', icon: '/placeholder.svg?height=64&width=64&text=Git' },
      ])
    }

    loadTechnologies()
  }, [])

  // Duplicar a lista de tecnologias para obter o efeito de loop infinito
  const allTechnologies = [...technologies, ...technologies, ...technologies]

  if (technologies.length === 0) return null

  return (
    <section id="tecnologias" className="py-20 bg-primary overflow-hidden relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary tracking-tight">
          Tecnologias
        </h2>
      </div>

      {/* Container Carrossel */}
      <div className="relative w-full flex overflow-x-hidden border-t border-b border-border-custom/50 py-10 bg-secondary/30">
        {/* Track 1 */}
        <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0 gap-8 items-center">
          {allTechnologies.map((tech, idx) => (
            <div
              key={`track1-${tech.id}-${idx}`}
              className="flex flex-col items-center justify-center min-w-[120px] p-4 bg-primary border border-border-custom rounded-xl hover:border-txt-primary hover:scale-105 transition-all duration-300 select-none group"
            >
              <div className="relative w-12 D-12 h-12 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                <img
                  src={tech.icon || '/placeholder.svg?height=64&width=64'}
                  alt={tech.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-txt-secondary group-hover:text-txt-primary transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 (Cópia para o loop infinito) */}
        <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0 gap-8 items-center" aria-hidden="true">
          {allTechnologies.map((tech, idx) => (
            <div
              key={`track2-${tech.id}-${idx}`}
              className="flex flex-col items-center justify-center min-w-[120px] p-4 bg-primary border border-border-custom rounded-xl hover:border-txt-primary hover:scale-105 transition-all duration-300 select-none group"
            >
              <div className="relative w-12 h-12 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                <img
                  src={tech.icon || '/placeholder.svg?height=64&width=64'}
                  alt={tech.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-txt-secondary group-hover:text-txt-primary transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
