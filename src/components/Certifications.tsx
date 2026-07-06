'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'

interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  link: string
}

export default function Certifications({ id }: { id?: string }) {
  const certifications: Certification[] = [
    {
      id: 1,
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024',
      link: '#',
    },
    {
      id: 2,
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      date: '2023',
      link: '#',
    },
    {
      id: 3,
      title: 'Google Cloud Professional Cloud Developer',
      issuer: 'Google Cloud',
      date: '2023',
      link: '#',
    },
    {
      id: 4,
      title: 'Full Stack Web Development',
      issuer: 'Rocketseat / Alura',
      date: '2022',
      link: '#',
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  }

  return (
    <section id={id} className="py-24 bg-primary relative transition-colors duration-400">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-center text-txt-primary tracking-tight mb-16 font-sans">
          Certificações <span className="text-txt-secondary font-normal font-sans">& Acadêmico</span>
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              whileHover={{ y: -3 }}
              className="p-6 bg-primary border border-border-custom/80 rounded-2xl shadow-apple hover:shadow-apple-hover hover:border-txt-primary/10 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="text-accent mb-4 group-hover:scale-105 transition-transform duration-300 w-fit">
                  <Award size={24} />
                </div>
                <h3 className="text-sm font-bold text-txt-primary leading-snug mb-2 font-sans">
                  {cert.title}
                </h3>
                <p className="text-xs text-txt-secondary mb-1 font-sans">{cert.issuer}</p>
                <p className="text-[10px] text-txt-muted uppercase font-bold font-sans">{cert.date}</p>
              </div>

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 pt-4 border-t border-border-custom/50 flex items-center text-[10px] font-bold uppercase tracking-wider text-accent hover:opacity-85 transition-opacity gap-1.5"
                >
                  Verificar <ExternalLink size={10} />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
