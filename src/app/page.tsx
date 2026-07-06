'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, orderBy, query, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, Send } from 'lucide-react'

// Ícone do GitHub em SVG (removido das versões recentes do Lucide)
const GitHubIcon = ({ size = 16, className = "" }) => (
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
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Import de Componentes do Portfólio
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'
import FloatingActionButton from '@/components/FloatingActionButton'
import StatsCounter from '@/components/StatsCounter'
import Timeline from '@/components/Timeline'
import Certifications from '@/components/Certifications'
import Recommendations from '@/components/Recommendations'
import ProfessionalLinks from '@/components/ProfessionalLinks'
import TechCarousel from '@/components/TechCarousel'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

interface Skill {
  id?: string
  name: string
  percentage: number
}

interface SiteSettings {
  title?: string
  about?: string
  thought?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  whatsapp?: string
}

export default function HomePage() {
  // Configurações e Mocks
  const [settings, setSettings] = useState<SiteSettings>({
    title: 'Analista e Desenvolvedor de Sistemas',
    about: 'Olá! Sou um desenvolvedor de software apaixonado por criar soluções elegantes e eficientes. Tenho experiência em desenvolvimento web full-stack, com foco em tecnologias modernas como React, Node.js e muito mais.',
    thought: 'Acredito que o melhor código é aquele que resolve problemas reais de forma simples e elegante.',
    email: 'bruno@exemplo.com',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP - Brasil',
  })

  // Hero Typing messages
  const [messages, setMessages] = useState<string[]>([
    'Olá, eu sou Bruno Bueno.',
    'Seja Bem-vindo ao meu portfólio.',
  ])

  // Projetos, Skills e Formulário
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'React', percentage: 84 },
    { name: 'Node.js', percentage: 77 },
    { name: 'PostgreSQL', percentage: 74 },
    { name: 'UI/UX Design', percentage: 95 },
    { name: 'Git/GitHub', percentage: 78 },
  ])
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Typing Effect State
  const [displayedText, setDisplayedText] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Carrega configurações gerais
  useEffect(() => {
    const loadData = async () => {
      try {
        // Site Settings
        const siteSnap = await getDoc(doc(db, 'settings', 'site'))
        if (siteSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...siteSnap.data() }))
        }

        // Hero Config
        const heroSnap = await getDoc(doc(db, 'settings', 'hero'))
        if (heroSnap.exists()) {
          const heroData = heroSnap.data()
          if (heroData.messages && heroData.messages.length > 0) {
            setMessages(heroData.messages)
          }
        }

        // Skills
        const skillsQ = query(collection(db, 'skills'), orderBy('name'))
        const skillsSnap = await getDocs(skillsQ)
        const loadedSkills = skillsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Skill[]
        if (loadedSkills.length > 0) {
          setSkills(loadedSkills)
        }

        // Projects
        const projQ = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
        const projSnap = await getDocs(projQ)
        const loadedProjects = projSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]
        
        if (loadedProjects.length > 0) {
          setProjects(loadedProjects)
        } else {
          setProjects([
            {
              id: '1',
              title: 'Projeto Portfolio',
              description: 'Site pessoal desenvolvido com Next.js, TailwindCSS e Firebase para apresentar meus projetos e habilidades de desenvolvimento web.',
              technologies: ['Next.js', 'TailwindCSS', 'Framer Motion', 'Firebase'],
              featured: true,
              liveUrl: '#',
              githubUrl: '#',
              image: '/placeholder.svg?height=200&width=300&text=Portfolio',
            },
            {
              id: '2',
              title: 'E-commerce App',
              description: 'Aplicação de e-commerce completa com carrinho de compras, sistema de pagamento e painel administrativo.',
              technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
              featured: true,
              liveUrl: '#',
              githubUrl: '#',
              image: '/placeholder.svg?height=200&width=300&text=E-commerce',
            },
            {
              id: '3',
              title: 'Task Manager',
              description: 'Sistema de gerenciamento de tarefas com funcionalidades de colaboração em equipe.',
              technologies: ['Next.js', 'PostgreSQL', 'Prisma'],
              featured: false,
              liveUrl: '#',
              githubUrl: '#',
              image: '/placeholder.svg?height=200&width=300&text=Tasks',
            },
          ])
        }
      } catch (err) {
        console.error('Erro ao carregar dados do Firebase:', err)
      }
    }

    loadData()
  }, [])

  // Typing Effect Logic
  useEffect(() => {
    if (messages.length === 0) return

    let msgIndex = 0
    let charIndex = 0
    let deleting = false
    let timer: NodeJS.Timeout

    const TYPING_SPEED = 85
    const DELETING_SPEED = 40
    const PAUSE_END = 2500
    const PAUSE_START = 400

    const tick = () => {
      const currentMessage = messages[msgIndex]

      if (!deleting) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1))
        charIndex++

        if (charIndex === currentMessage.length) {
          deleting = true
          timer = setTimeout(tick, PAUSE_END)
        } else {
          timer = setTimeout(tick, TYPING_SPEED)
        }
      } else {
        setDisplayedText(currentMessage.slice(0, charIndex - 1))
        charIndex--

        if (charIndex === 0) {
          deleting = false
          msgIndex = (msgIndex + 1) % messages.length
          timer = setTimeout(tick, PAUSE_START)
        } else {
          timer = setTimeout(tick, DELETING_SPEED)
        }
      }
    }

    timer = setTimeout(tick, PAUSE_START)

    return () => clearTimeout(timer)
  }, [messages])

  // Filtragem de Projetos
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects
    return projects.filter((p) => p.featured)
  }, [projects, activeFilter])

  // Envio de Mensagem de Contato
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: new Date(),
        read: false,
      })
      setSuccessMsg('Mensagem enviada com sucesso! Entrarei em contato em breve.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      setErrorMsg('Erro ao enviar mensagem. Tente novamente mais tarde.')
    } finally {
      setSending(false)
    }
  }

  const truncateText = (text: string, max: number) => {
    if (text.length <= max) return text
    return text.slice(0, max) + '...'
  }

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <FloatingActionButton />
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section id="home" className="min-h-[90vh] flex items-center relative overflow-hidden bg-primary py-20">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Futuristic Custom Glow Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              style={{
                width: 'var(--hero-circle-size, 0%)',
                height: 'var(--hero-circle-size, 0%)',
                left: 'var(--hero-circle-x, 0%)',
                top: 'var(--hero-circle-y, 0%)',
                transform: 'translate(-50%, -50%)',
                borderColor: 'var(--hero-circle-color, transparent)',
                opacity: 'var(--hero-circle-opacity, 0)',
                background: `
                  radial-gradient(circle, rgba(var(--hero-inner-glow-rgb, 0,0,0), var(--hero-inner-glow-opacity, 0)) 0%, transparent 60%),
                  radial-gradient(circle, transparent 40%, rgba(var(--hero-outer-glow-rgb, 0,0,0), var(--hero-outer-glow-opacity, 0)) 70%)
                `
              }}
              className="absolute rounded-full border border-dashed transition-all duration-700"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-6xl font-black text-txt-primary tracking-tighter leading-[1.15] mb-6 min-h-[3rem]"
              >
                <span>{displayedText}</span>
                <span className="animate-pulse ml-1 text-accent">|</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-2xl text-txt-secondary mb-10 max-w-xl mx-auto font-medium"
              >
                {settings.title}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <a href="#projetos" className="px-6 py-3 rounded-lg bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary font-semibold transition-colors text-sm shadow-md cursor-pointer">
                  Ver Projetos
                </a>
                <a href="#contato" className="px-6 py-3 rounded-lg bg-transparent text-txt-secondary border border-border-custom hover:border-txt-primary hover:text-txt-primary font-semibold transition-colors text-sm cursor-pointer">
                  Entre em Contato
                </a>
              </motion.div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
            <div className="w-6 h-6 border-b-2 border-r-2 border-txt-secondary transform rotate-45" />
          </div>
        </section>

        {/* Stats Counter Section */}
        <StatsCounter />

        {/* Projetos Section */}
        <section id="projetos" className="py-24 bg-primary transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary mb-12">
              Meus <span className="opacity-40 font-normal">Projetos</span>
            </h2>

            {/* Filtro */}
            <div className="flex justify-center space-x-4 mb-16">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-txt-primary text-primary border-txt-primary'
                    : 'bg-transparent text-txt-secondary border-border-custom hover:border-txt-primary hover:text-txt-primary'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveFilter('featured')}
                className={`px-5 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                  activeFilter === 'featured'
                    ? 'bg-txt-primary text-primary border-txt-primary'
                    : 'bg-transparent text-txt-secondary border-border-custom hover:border-txt-primary hover:text-txt-primary'
                }`}
              >
                Destaques
              </button>
            </div>

            {/* Grid de Projetos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary border border-border-custom rounded-2xl overflow-hidden hover:border-txt-primary transition-all duration-300 flex flex-col group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-48 w-full bg-secondary overflow-hidden">
                    <img
                      src={project.image || '/placeholder.svg?height=200&width=300'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.featured && (
                      <span className="absolute top-4 left-4 bg-txt-primary text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-txt-primary mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-txt-secondary text-sm mb-6 flex-grow">
                      {truncateText(project.description, 100)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] bg-secondary border border-border-custom text-txt-secondary rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] text-txt-muted">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    <button className="text-sm font-semibold text-txt-primary flex items-center gap-1.5 group/btn cursor-pointer">
                      Ver Detalhes
                      <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experiência Section */}
        <Timeline id="experiencia" />

        {/* Certificações Section */}
        <Certifications id="certificacoes" />

        {/* Formação Acadêmica Section */}
        <section id="formacao" className="py-24 bg-primary border-t border-border-custom transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary mb-16">
              Formação <span className="opacity-40 font-normal">Acadêmica</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-8 bg-primary border border-border-custom rounded-2xl hover:border-txt-primary transition-all duration-300"
              >
                <span className="text-xs font-semibold text-txt-secondary tracking-wider block mb-2">2023 - 2025</span>
                <h3 className="text-xl font-bold text-txt-primary mb-1">Análise e Desenvolvimento de Sistemas</h3>
                <p className="text-sm text-txt-secondary mb-4 font-medium">Universidade de Marília - UNIMAR</p>
                <p className="text-txt-secondary text-sm leading-relaxed">
                  Foco em engenharia de software, arquitetura de sistemas corporativos, padrões de projetos e metodologias ágeis de desenvolvimento.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tecnologias Section */}
        <TechCarousel />

        {/* Sobre Mim Section */}
        <section id="sobre" className="py-24 bg-primary border-t border-border-custom transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary mb-16">
              Sobre <span className="opacity-40 font-normal">Mim</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <p className="text-lg leading-relaxed text-txt-secondary">
                  {settings.about}
                </p>
                {settings.thought && (
                  <div className="pl-6 border-l-4 border-txt-primary italic text-txt-primary py-2 text-base font-medium">
                    &ldquo;{settings.thought}&rdquo;
                  </div>
                )}
              </motion.div>

              {/* Habilidades */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 bg-primary border border-border-custom rounded-2xl"
              >
                <h3 className="text-lg font-bold text-txt-primary mb-6">Minhas Habilidades</h3>
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-txt-primary">{skill.name}</span>
                        <span className="text-txt-secondary">{skill.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary border border-border-custom rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-txt-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Recomendações */}
        <Recommendations />

        {/* Contato Section */}
        <section id="contato" className="py-24 bg-primary border-t border-border-custom transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-txt-primary mb-16">
              Entre em <span className="opacity-40 font-normal">Contato</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informações */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-txt-primary mb-4">Vamos conversar</h3>
                  <p className="text-txt-secondary text-sm leading-relaxed max-w-sm">
                    Preencha o formulário ao lado ou entre em contato diretamente através dos canais de comunicação abaixo:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 border border-border-custom bg-secondary/50 rounded-xl text-txt-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-txt-secondary uppercase tracking-wider">Email</h4>
                      <p className="text-sm font-medium text-txt-primary">{settings.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 border border-border-custom bg-secondary/50 rounded-xl text-txt-primary">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-txt-secondary uppercase tracking-wider">Telefone</h4>
                      <p className="text-sm font-medium text-txt-primary">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 border border-border-custom bg-secondary/50 rounded-xl text-txt-primary">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-txt-secondary uppercase tracking-wider">Localização</h4>
                      <p className="text-sm font-medium text-txt-primary">{settings.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Formulário */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 bg-primary border border-border-custom rounded-2xl"
              >
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-txt-primary">Nome</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border-custom hover:border-txt-secondary focus:border-txt-primary rounded-xl text-txt-primary outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-txt-primary">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-secondary/50 border border-border-custom hover:border-txt-secondary focus:border-txt-primary rounded-xl text-txt-primary outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-txt-primary">Mensagem</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Sua mensagem..."
                      className="w-full px-4 py-3 bg-secondary/50 border border-border-custom hover:border-txt-secondary focus:border-txt-primary rounded-xl text-txt-primary outline-none transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md"
                  >
                    {sending ? (
                      'Enviando...'
                    ) : (
                      <>
                        <span>Enviar Mensagem</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  {successMsg && (
                    <p className="text-emerald-500 text-sm text-center font-medium mt-2">{successMsg}</p>
                  )}
                  {errorMsg && (
                    <p className="text-rose-500 text-sm text-center font-medium mt-2">{errorMsg}</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Professional Connections Links */}
        <ProfessionalLinks id="networking" />
      </main>

      <Footer />

      {/* Modal de Detalhes do Projeto */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primary border border-border-custom rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-txt-secondary hover:text-txt-primary z-10 w-8 h-8 flex items-center justify-center rounded-full bg-secondary/80 border border-border-custom cursor-pointer transition-colors"
              >
                &times;
              </button>

              <div className="overflow-y-auto p-8 space-y-6">
                <div className="relative h-64 w-full rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={selectedProject.image || '/placeholder.svg?height=400&width=600'}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedProject.featured && (
                    <span className="absolute top-4 left-4 bg-txt-primary text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                      Destaque
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-txt-primary mb-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-txt-secondary text-sm leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-txt-primary uppercase tracking-wider mb-3">
                    Tecnologias Utilizadas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 text-xs bg-secondary border border-border-custom rounded text-txt-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-custom/50">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors text-sm cursor-pointer w-full sm:w-auto"
                    >
                      <span>Ver Projeto</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-transparent text-txt-secondary border border-border-custom hover:border-txt-primary hover:text-txt-primary rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors text-sm cursor-pointer w-full sm:w-auto"
                    >
                      <GitHubIcon size={14} />
                      <span>Ver Código</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
