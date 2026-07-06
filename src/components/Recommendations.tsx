'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Quote } from 'lucide-react'

interface Recommendation {
  id: number
  text: string
  author: string
  role: string
  company: string
}

export default function Recommendations({ id }: { id?: string }) {
  const recommendations: Recommendation[] = [
    {
      id: 1,
      text: 'Bruno é um desenvolvedor excepcional. Sua capacidade de resolver problemas complexos com soluções elegantes e sua atenção aos detalhes tornaram nosso projeto um sucesso absoluto.',
      author: 'Guilherme Silva',
      role: 'Tech Lead',
      company: 'InovaTech',
    },
    {
      id: 2,
      text: 'Trabalhar com o Bruno foi uma experiência incrível. Ele é altamente técnico, proativo e sempre entrega código de alta qualidade no prazo.',
      author: 'Ana Costa',
      role: 'Product Manager',
      company: 'Soluções Digitais',
    },
    {
      id: 3,
      text: 'Extremamente profissional e comprometido. O Bruno entende além do código, focando sempre no valor que a solução traz para o negócio.',
      author: 'Marcos Oliveira',
      role: 'CEO',
      company: 'Startup XYZ',
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section id={id} className="py-24 bg-primary relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary mb-16">
          Recomendações <span className="opacity-40 font-normal">& Depoimentos</span>
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="p-8 bg-primary border border-border-custom rounded-2xl hover:border-txt-primary flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-8 text-border-custom group-hover:text-txt-primary/10 transition-colors duration-300 pointer-events-none">
                <Quote size={48} className="transform rotate-180" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <p className="text-base leading-relaxed text-txt-primary italic mb-8 font-medium">
                  &ldquo;{rec.text}&rdquo;
                </p>
                
                <div className="flex flex-col mt-auto">
                  <span className="font-bold text-txt-primary text-base">
                    {rec.author}
                  </span>
                  <span className="text-sm text-txt-secondary mt-1">
                    {rec.role} @ {rec.company}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
