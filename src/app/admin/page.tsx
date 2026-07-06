'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  orderBy,
  query,
} from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette,
  Settings,
  Sparkles,
  BarChart2,
  Calendar,
  Briefcase,
  Code,
  Sliders,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

// Tipagens do Painel
interface ProjectItem {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

interface TechItem {
  id: string
  name: string
  category: string
  icon: string
}

interface SkillItem {
  id: string
  name: string
  percentage: number
}

interface MessageItem {
  id: string
  name: string
  email: string
  message: string
  createdAt: any
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { applyThemeColors, themeColors, setThemeColors, heroBackground, setHeroBackground } = useTheme()

  // Estados Globais do Painel
  const [activeTab, setActiveTab] = useState('config')
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Abas do Painel
  const tabs = [
    { id: 'config', name: 'Configurações', icon: Settings },
    { id: 'theme', name: 'Tema e Cores', icon: Palette },
    { id: 'hero', name: 'Mensagens Hero', icon: Sparkles },
    { id: 'stats', name: 'Estatísticas', icon: BarChart2 },
    { id: 'timeline', name: 'Timeline', icon: Calendar },
    { id: 'projects', name: 'Projetos', icon: Briefcase },
    { id: 'technologies', name: 'Tecnologias', icon: Code },
    { id: 'skills', name: 'Habilidades', icon: Sliders },
    { id: 'messages', name: 'Mensagens', icon: Mail },
  ]

  // Redirecionamento se deslogado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const showStatus = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMessage({ text, type })
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (err) {
      showStatus('Erro ao sair.', 'error')
    }
  }

  // COMPRESSÃO DE IMAGENS (Preserva lógica do Canvas)
  const compressImage = (file: File, maxSizeKB = 300): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        let { width, height } = img
        const maxDimension = 800

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        if (ctx) ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.8
        let base64 = canvas.toDataURL('image/jpeg', quality)

        while (base64.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1
          base64 = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(base64)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // ==========================================
  // ABA 1: CONFIGURAÇÕES GERAIS (Firestore)
  // ==========================================
  const [siteConfig, setSiteConfig] = useState({
    name: '',
    title: '',
    about: '',
    thought: '',
    email: '',
    phone: '',
    location: '',
  })

  useEffect(() => {
    if (!user) return
    const loadSiteConfig = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site'))
        if (docSnap.exists()) {
          setSiteConfig((prev) => ({ ...prev, ...docSnap.data() }))
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadSiteConfig()
  }, [user])

  const saveSiteConfig = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'site'), siteConfig)
      showStatus('Configurações gerais salvas com sucesso!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar configurações: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // ABA 2: TEMA E CORES (ThemeContext)
  // ==========================================
  const saveThemeColors = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'theme', 'colors'), themeColors)
      showStatus('Cores do tema salvas com sucesso!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar cores: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveHeroBackgroundConfig = async () => {
    setSaving(true)
    try {
      const configDoc = {
        dark: { heroBackground },
        light: { heroBackground },
      }
      await setDoc(doc(db, 'theme', 'config'), configDoc)
      showStatus('Configurações do background do Hero salvas com sucesso!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar hero config: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // ABA 3: HERO MESSAGES (Typing Effect)
  // ==========================================
  const [heroMessages, setHeroMessages] = useState<string[]>([])
  const [typingConfig, setTypingConfig] = useState({
    typingSpeed: 85,
    deletingSpeed: 40,
    pauseEnd: 2500,
    pauseStart: 400,
  })

  useEffect(() => {
    if (!user) return
    const loadHeroConfig = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'hero'))
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.messages) setHeroMessages(data.messages)
          setTypingConfig({
            typingSpeed: data.typingSpeed || 85,
            deletingSpeed: data.deletingSpeed || 40,
            pauseEnd: data.pauseEnd || 2500,
            pauseStart: data.pauseStart || 400,
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadHeroConfig()
  }, [user])

  const saveHeroConfig = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        messages: heroMessages.filter((m) => m.trim() !== ''),
        ...typingConfig,
      })
      showStatus('Configurações do Hero salvas com sucesso!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar Hero: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // ==========================================
  // ABA 4: ESTATÍSTICAS (Stats)
  // ==========================================
  const [stats, setStats] = useState<any[]>([])
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  const [statForm, setStatForm] = useState({ icon: '', number: 0, suffix: '', label: '' })

  const loadStats = async () => {
    const docSnap = await getDoc(doc(db, 'settings', 'stats'))
    if (docSnap.exists()) {
      setStats(docSnap.data().stats || [])
    }
  }

  useEffect(() => {
    if (user) loadStats()
  }, [user])

  const saveStat = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let updatedStats = [...stats]
      if (editingStatIndex !== null) {
        updatedStats[editingStatIndex] = statForm
      } else {
        updatedStats.push(statForm)
      }

      await setDoc(doc(db, 'settings', 'stats'), { stats: updatedStats })
      setStats(updatedStats)
      setShowStatsModal(false)
      showStatus('Estatística salva!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar estatística: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteStat = async (index: number) => {
    if (!confirm('Deseja excluir esta estatística?')) return
    try {
      const updated = stats.filter((_, i) => i !== index)
      await setDoc(doc(db, 'settings', 'stats'), { stats: updated })
      setStats(updated)
      showStatus('Estatística excluída!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  // ==========================================
  // ABA 5: TIMELINE (Carreira)
  // ==========================================
  const [timeline, setTimeline] = useState<any[]>([])
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [editingTimelineIndex, setEditingTimelineIndex] = useState<number | null>(null)
  const [timelineForm, setTimelineForm] = useState({
    date: '',
    title: '',
    company: '',
    description: '',
    skills: '',
  })

  const loadTimeline = async () => {
    const docSnap = await getDoc(doc(db, 'settings', 'timeline'))
    if (docSnap.exists()) {
      setTimeline(docSnap.data().timeline || [])
    }
  }

  useEffect(() => {
    if (user) loadTimeline()
  }, [user])

  const saveTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const skillsArray = timelineForm.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')

      const itemToSave = {
        date: timelineForm.date,
        title: timelineForm.title,
        company: timelineForm.company,
        description: timelineForm.description,
        skills: skillsArray,
      }

      let updatedTimeline = [...timeline]
      if (editingTimelineIndex !== null) {
        updatedTimeline[editingTimelineIndex] = itemToSave
      } else {
        updatedTimeline.push(itemToSave)
      }

      await setDoc(doc(db, 'settings', 'timeline'), { timeline: updatedTimeline })
      setTimeline(updatedTimeline)
      setShowTimelineModal(false)
      showStatus('Item da timeline salvo!', 'success')
    } catch (err: any) {
      showStatus('Erro ao salvar timeline: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteTimelineItem = async (index: number) => {
    if (!confirm('Deseja excluir esta experiência da timeline?')) return
    try {
      const updated = timeline.filter((_, i) => i !== index)
      await setDoc(doc(db, 'settings', 'timeline'), { timeline: updated })
      setTimeline(updated)
      showStatus('Item excluído!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  // ==========================================
  // ABA 6: PROJETOS (CRUD Firestore)
  // ==========================================
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([])
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
  })

  const loadProjects = async () => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(projQ)
    const loaded = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProjectItem[]
    setProjectsList(loaded)
  }

  const projQ = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))

  useEffect(() => {
    if (user) loadProjects()
  }, [user])

  const handleProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const compressed = await compressImage(file)
      setProjectForm((prev) => ({ ...prev, image: compressed }))
    }
  }

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const techsArray = projectForm.technologies
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '')

      const data: any = {
        title: projectForm.title,
        description: projectForm.description,
        image: projectForm.image,
        technologies: techsArray,
        liveUrl: projectForm.liveUrl,
        githubUrl: projectForm.githubUrl,
        featured: projectForm.featured,
        createdAt: new Date(),
      }

      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), data)
        showStatus('Projeto atualizado!', 'success')
      } else {
        await addDoc(collection(db, 'projects'), data)
        showStatus('Projeto criado!', 'success')
      }

      loadProjects()
      setShowProjectModal(false)
    } catch (err: any) {
      showStatus('Erro ao salvar projeto: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Deseja excluir este projeto?')) return
    try {
      await deleteDoc(doc(db, 'projects', id))
      loadProjects()
      showStatus('Projeto excluído!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  // ==========================================
  // ABA 7: TECNOLOGIAS (CRUD Firestore)
  // ==========================================
  const [techList, setTechList] = useState<TechItem[]>([])
  const [showTechModal, setShowTechModal] = useState(false)
  const [editingTechId, setEditingTechId] = useState<string | null>(null)
  const [techForm, setTechForm] = useState({ name: '', category: '', icon: '' })

  const loadTechs = async () => {
    const snap = await getDocs(query(collection(db, 'technologies'), orderBy('name')))
    const loaded = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TechItem[]
    setTechList(loaded)
  }

  useEffect(() => {
    if (user) loadTechs()
  }, [user])

  const handleTechIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const compressed = await compressImage(file, 100) // ícone menor
      setTechForm((prev) => ({ ...prev, icon: compressed }))
    }
  }

  const saveTech = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...techForm }
      if (editingTechId) {
        await updateDoc(doc(db, 'technologies', editingTechId), data)
        showStatus('Tecnologia atualizada!', 'success')
      } else {
        await addDoc(collection(db, 'technologies'), data)
        showStatus('Tecnologia adicionada!', 'success')
      }
      loadTechs()
      setShowTechModal(false)
    } catch (err: any) {
      showStatus('Erro ao salvar: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteTech = async (id: string) => {
    if (!confirm('Deseja excluir esta tecnologia?')) return
    try {
      await deleteDoc(doc(db, 'technologies', id))
      loadTechs()
      showStatus('Tecnologia excluída!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  // ==========================================
  // ABA 8: HABILIDADES (CRUD Firestore)
  // ==========================================
  const [skillsList, setSkillsList] = useState<SkillItem[]>([])
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [skillFormState, setSkillFormState] = useState({ name: '', percentage: 0 })

  const loadSkills = async () => {
    const snap = await getDocs(query(collection(db, 'skills'), orderBy('name')))
    const loaded = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SkillItem[]
    setSkillsList(loaded)
  }

  useEffect(() => {
    if (user) loadSkills()
  }, [user])

  const saveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...skillFormState }
      if (editingSkillId) {
        await updateDoc(doc(db, 'skills', editingSkillId), data)
        showStatus('Habilidade atualizada!', 'success')
      } else {
        await addDoc(collection(db, 'skills'), data)
        showStatus('Habilidade adicionada!', 'success')
      }
      loadSkills()
      setShowSkillModal(false)
    } catch (err: any) {
      showStatus('Erro ao salvar: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Deseja excluir esta habilidade?')) return
    try {
      await deleteDoc(doc(db, 'skills', id))
      loadSkills()
      showStatus('Habilidade excluída!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  // ==========================================
  // ABA 9: MENSAGENS (Caixa de Entrada)
  // ==========================================
  const [messagesList, setMessagesList] = useState<MessageItem[]>([])

  const loadMessages = async () => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    const loaded = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MessageItem[]
    setMessagesList(loaded)
  }

  useEffect(() => {
    if (user && activeTab === 'messages') loadMessages()
  }, [user, activeTab])

  const deleteMessage = async (id: string) => {
    if (!confirm('Deseja excluir esta mensagem?')) return
    try {
      await deleteDoc(doc(db, 'messages', id))
      loadMessages()
      showStatus('Mensagem excluída!', 'success')
    } catch (err: any) {
      showStatus('Erro ao excluir: ' + err.message, 'error')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-[2px] border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-secondary border-b md:border-b-0 md:border-r border-border-custom flex flex-col shrink-0">
        <div className="p-6 border-b border-border-custom flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-txt-primary">BB Admin</span>
            <span className="text-[10px] text-txt-secondary font-medium truncate max-w-[150px]">
              {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 border border-border-custom rounded-lg hover:border-rose-500 hover:text-rose-500 hover:bg-rose-500/10 text-txt-secondary transition-all cursor-pointer"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>

        <nav className="p-4 flex-grow space-y-1 overflow-y-auto max-h-[50vh] md:max-h-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-txt-primary text-primary'
                    : 'text-txt-secondary hover:text-txt-primary hover:bg-primary'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-5xl">
        {/* Status Alert Banner */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border mb-6 flex items-center gap-3 text-sm font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------- ABA: CONFIGURAÇÕES GERAIS -------------------- */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Configurações Gerais</h2>
            <div className="p-6 bg-secondary border border-border-custom rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Nome</label>
                  <input
                    type="text"
                    value={siteConfig.name}
                    onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Título Profissional</label>
                  <input
                    type="text"
                    value={siteConfig.title}
                    onChange={(e) => setSiteConfig({ ...siteConfig, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Email</label>
                  <input
                    type="email"
                    value={siteConfig.email}
                    onChange={(e) => setSiteConfig({ ...siteConfig, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Telefone</label>
                  <input
                    type="text"
                    value={siteConfig.phone}
                    onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Localização</label>
                  <input
                    type="text"
                    value={siteConfig.location}
                    onChange={(e) => setSiteConfig({ ...siteConfig, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-txt-primary">Sobre Mim</label>
                <textarea
                  rows={4}
                  value={siteConfig.about}
                  onChange={(e) => setSiteConfig({ ...siteConfig, about: e.target.value })}
                  className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-txt-primary">Citação / Pensamento</label>
                <textarea
                  rows={2}
                  value={siteConfig.thought}
                  onChange={(e) => setSiteConfig({ ...siteConfig, thought: e.target.value })}
                  className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm resize-none"
                />
              </div>

              <button
                onClick={saveSiteConfig}
                disabled={saving}
                className="px-6 py-2.5 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary font-semibold rounded-lg text-sm transition-all cursor-pointer"
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}

        {/* -------------------- ABA: TEMA E CORES -------------------- */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Tema e Cores Dinâmicas</h2>
            <div className="p-6 bg-secondary border border-border-custom rounded-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-txt-primary mb-4">Cores do Tema Escuro</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.keys(themeColors.dark).map((key) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-txt-secondary">{key}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(themeColors.dark as any)[key]}
                          onChange={(e) =>
                            setThemeColors((prev) => ({
                              ...prev,
                              dark: { ...prev.dark, [key]: e.target.value },
                            }))
                          }
                          className="w-8 h-8 rounded border border-border-custom cursor-pointer"
                        />
                        <span className="text-xs font-mono">{(themeColors.dark as any)[key]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={saveThemeColors}
                disabled={saving}
                className="px-6 py-2.5 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary font-semibold rounded-lg text-sm transition-all cursor-pointer"
              >
                {saving ? 'Salvando...' : 'Salvar Cores do Tema'}
              </button>
            </div>

            {/* Configurações do Hero Background Glow */}
            {heroBackground && (
              <div className="p-6 bg-secondary border border-border-custom rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-txt-primary">Efeitos de Glow no Hero</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-txt-primary">Cor do Círculo Principal</label>
                    <input
                      type="color"
                      value={heroBackground.circleColor}
                      onChange={(e) =>
                        setHeroBackground((prev) => prev ? { ...prev, circleColor: e.target.value } : null)
                      }
                      className="w-full h-10 rounded border border-border-custom cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-txt-primary">Opacidade do Círculo ({heroBackground.circleOpacity}%)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={heroBackground.circleOpacity}
                      onChange={(e) =>
                        setHeroBackground((prev) => prev ? { ...prev, circleOpacity: Number(e.target.value) } : null)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-txt-primary">Tamanho do Círculo ({heroBackground.circleSize}%)</label>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      value={heroBackground.circleSize}
                      onChange={(e) =>
                        setHeroBackground((prev) => prev ? { ...prev, circleSize: Number(e.target.value) } : null)
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={saveHeroBackgroundConfig}
                  disabled={saving}
                  className="px-6 py-2.5 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary font-semibold rounded-lg text-sm transition-all cursor-pointer"
                >
                  {saving ? 'Salvando...' : 'Salvar Glow Config'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: HERO CONFIG (Typing Effect) -------------------- */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Efeito de Digitação</h2>
            <div className="p-6 bg-secondary border border-border-custom rounded-2xl space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-txt-primary">Mensagens (uma por linha)</label>
                <textarea
                  rows={5}
                  value={heroMessages.join('\n')}
                  onChange={(e) => setHeroMessages(e.target.value.split('\n'))}
                  className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  placeholder="Olá, eu sou Bruno Bueno."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Velocidade de Escrita (ms)</label>
                  <input
                    type="number"
                    value={typingConfig.typingSpeed}
                    onChange={(e) => setTypingConfig({ ...typingConfig, typingSpeed: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-txt-primary">Velocidade de Remoção (ms)</label>
                  <input
                    type="number"
                    value={typingConfig.deletingSpeed}
                    onChange={(e) => setTypingConfig({ ...typingConfig, deletingSpeed: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-primary border border-border-custom rounded-lg text-txt-primary text-sm"
                  />
                </div>
              </div>

              <button
                onClick={saveHeroConfig}
                disabled={saving}
                className="px-6 py-2.5 bg-txt-primary text-primary border border-txt-primary hover:bg-transparent hover:text-txt-primary font-semibold rounded-lg text-sm transition-all cursor-pointer"
              >
                {saving ? 'Salvando...' : 'Salvar Hero'}
              </button>
            </div>
          </div>
        )}

        {/* -------------------- ABA: ESTATÍSTICAS (Stats) -------------------- */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Estatísticas</h2>
              <button
                onClick={() => {
                  setEditingStatIndex(null)
                  setStatForm({ icon: '🚀', number: 0, suffix: '', label: '' })
                  setShowStatsModal(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-6 bg-secondary border border-border-custom rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <h4 className="text-xl font-bold text-txt-primary">
                      {stat.number}
                      {stat.suffix}
                    </h4>
                    <p className="text-xs text-txt-secondary">{stat.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingStatIndex(idx)
                        setStatForm(stat)
                        setShowStatsModal(true)
                      }}
                      className="p-2 border border-border-custom rounded-lg hover:border-txt-primary text-txt-secondary hover:text-txt-primary transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteStat(idx)}
                      className="p-2 border border-border-custom rounded-lg hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Estatística */}
            {showStatsModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <form onSubmit={saveStat} className="bg-primary border border-border-custom rounded-2xl p-6 max-w-sm w-full space-y-4">
                  <h3 className="text-lg font-bold text-txt-primary">
                    {editingStatIndex !== null ? 'Editar Estatística' : 'Nova Estatística'}
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Ícone (Emoji)</label>
                    <input
                      type="text"
                      required
                      value={statForm.icon}
                      onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">Número</label>
                      <input
                        type="number"
                        required
                        value={statForm.number}
                        onChange={(e) => setStatForm({ ...statForm, number: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">Sufixo</label>
                      <input
                        type="text"
                        value={statForm.suffix}
                        onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                        placeholder="+, %"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Descrição</label>
                    <input
                      type="text"
                      required
                      value={statForm.label}
                      onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowStatsModal(false)}
                      className="px-4 py-2 border border-border-custom rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-txt-primary text-primary rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: TIMELINE (Histórico) -------------------- */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Timeline</h2>
              <button
                onClick={() => {
                  setEditingTimelineIndex(null)
                  setTimelineForm({ date: '', title: '', company: '', description: '', skills: '' })
                  setShowTimelineModal(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="p-6 bg-secondary border border-border-custom rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-grow">
                    <span className="text-xs text-txt-secondary font-semibold">{item.date}</span>
                    <h3 className="text-lg font-bold text-txt-primary">{item.title}</h3>
                    <h4 className="text-sm font-semibold text-txt-secondary">{item.company}</h4>
                    <p className="text-xs text-txt-secondary leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.skills.map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] bg-primary border border-border-custom text-txt-secondary rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-start">
                    <button
                      onClick={() => {
                        setEditingTimelineIndex(idx)
                        setTimelineForm({
                          date: item.date,
                          title: item.title,
                          company: item.company,
                          description: item.description,
                          skills: item.skills.join(', '),
                        })
                        setShowTimelineModal(true)
                      }}
                      className="p-2 border border-border-custom rounded-lg hover:border-txt-primary text-txt-secondary hover:text-txt-primary transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteTimelineItem(idx)}
                      className="p-2 border border-border-custom rounded-lg hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Timeline */}
            {showTimelineModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <form onSubmit={saveTimelineItem} className="bg-primary border border-border-custom rounded-2xl p-6 max-w-md w-full space-y-4">
                  <h3 className="text-lg font-bold text-txt-primary">
                    {editingTimelineIndex !== null ? 'Editar Item' : 'Novo Item'}
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Período / Ano</label>
                    <input
                      type="text"
                      required
                      value={timelineForm.date}
                      onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      placeholder="2024 - Presente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">Cargo</label>
                      <input
                        type="text"
                        required
                        value={timelineForm.title}
                        onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">Empresa</label>
                      <input
                        type="text"
                        required
                        value={timelineForm.company}
                        onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Descrição</label>
                    <textarea
                      required
                      rows={3}
                      value={timelineForm.description}
                      onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Habilidades (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={timelineForm.skills}
                      onChange={(e) => setTimelineForm({ ...timelineForm, skills: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      placeholder="React, Next.js, Node.js"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTimelineModal(false)}
                      className="px-4 py-2 border border-border-custom rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-txt-primary text-primary rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: PROJETOS -------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Projetos</h2>
              <button
                onClick={() => {
                  setEditingProjectId(null)
                  setProjectForm({ title: '', description: '', image: '', technologies: '', liveUrl: '', githubUrl: '', featured: false })
                  setShowProjectModal(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Novo Projeto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectsList.map((project) => (
                <div key={project.id} className="bg-secondary border border-border-custom rounded-2xl overflow-hidden flex flex-col group relative">
                  <div className="h-40 bg-primary overflow-hidden relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    {project.featured && (
                      <span className="absolute top-3 left-3 bg-txt-primary text-primary text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-txt-primary mb-1">{project.title}</h3>
                      <p className="text-xs text-txt-secondary line-clamp-3 mb-4">{project.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border-custom/30 mt-auto">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProjectId(project.id)
                            setProjectForm({
                              title: project.title,
                              description: project.description,
                              image: project.image,
                              technologies: project.technologies.join(', '),
                              liveUrl: project.liveUrl || '',
                              githubUrl: project.githubUrl || '',
                              featured: project.featured,
                            })
                            setShowProjectModal(true)
                          }}
                          className="p-2 border border-border-custom rounded-lg hover:border-txt-primary text-txt-secondary hover:text-txt-primary transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 border border-border-custom rounded-lg hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Projetos */}
            {showProjectModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                <form onSubmit={saveProject} className="bg-primary border border-border-custom rounded-2xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-txt-primary">
                    {editingProjectId ? 'Editar Projeto' : 'Novo Projeto'}
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Título</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Descrição</label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Imagem (Upload)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImage}
                      className="w-full text-xs"
                    />
                    {projectForm.image && (
                      <div className="relative h-20 w-32 border border-border-custom rounded overflow-hidden mt-2">
                        <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Tecnologias (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      placeholder="Next.js, React, TailwindCSS"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">URL de Deploy</label>
                      <input
                        type="text"
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-txt-primary">URL do GitHub</label>
                      <input
                        type="text"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-txt-primary cursor-pointer">
                      Projeto em Destaque
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="px-4 py-2 border border-border-custom rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-txt-primary text-primary rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: TECNOLOGIAS -------------------- */}
        {activeTab === 'technologies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Tecnologias</h2>
              <button
                onClick={() => {
                  setEditingTechId(null)
                  setTechForm({ name: '', category: '', icon: '' })
                  setShowTechModal(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Nova Tecnologia</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {techList.map((tech) => (
                <div key={tech.id} className="p-4 bg-secondary border border-border-custom rounded-xl flex flex-col items-center justify-between text-center relative group">
                  <div className="w-12 h-12 mb-3">
                    <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-sm font-bold text-txt-primary">{tech.name}</h3>
                  <span className="text-[10px] text-txt-secondary uppercase mt-0.5">{tech.category}</span>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-border-custom/30 w-full justify-center">
                    <button
                      onClick={() => {
                        setEditingTechId(tech.id)
                        setTechForm({ name: tech.name, category: tech.category, icon: tech.icon })
                        setShowTechModal(true)
                      }}
                      className="p-1.5 border border-border-custom rounded hover:border-txt-primary text-txt-secondary hover:text-txt-primary transition-colors cursor-pointer"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => deleteTech(tech.id)}
                      className="p-1.5 border border-border-custom rounded hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Tecnologias */}
            {showTechModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <form onSubmit={saveTech} className="bg-primary border border-border-custom rounded-2xl p-6 max-w-sm w-full space-y-4">
                  <h3 className="text-lg font-bold text-txt-primary">
                    {editingTechId ? 'Editar Tecnologia' : 'Nova Tecnologia'}
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Nome</label>
                    <input
                      type="text"
                      required
                      value={techForm.name}
                      onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Categoria</label>
                    <select
                      required
                      value={techForm.category}
                      onChange={(e) => setTechForm({ ...techForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Ferramentas</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Ícone (Upload)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTechIcon}
                      className="w-full text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTechModal(false)}
                      className="px-4 py-2 border border-border-custom rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-txt-primary text-primary rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: HABILIDADES -------------------- */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Habilidades</h2>
              <button
                onClick={() => {
                  setEditingSkillId(null)
                  setSkillFormState({ name: '', percentage: 0 })
                  setShowSkillModal(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-txt-primary text-primary hover:bg-transparent hover:text-txt-primary border border-txt-primary rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Nova Habilidade</span>
              </button>
            </div>

            <div className="space-y-4">
              {skillsList.map((skill) => (
                <div key={skill.id} className="p-4 bg-secondary border border-border-custom rounded-xl flex items-center justify-between gap-4">
                  <div className="flex-grow space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-txt-primary">{skill.name}</span>
                      <span className="text-txt-secondary">{skill.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-primary border border-border-custom rounded-full overflow-hidden">
                      <div style={{ width: `${skill.percentage}%` }} className="h-full bg-txt-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setEditingSkillId(skill.id)
                        setSkillFormState({ name: skill.name, percentage: skill.percentage })
                        setShowSkillModal(true)
                      }}
                      className="p-2 border border-border-custom rounded-lg hover:border-txt-primary text-txt-secondary hover:text-txt-primary transition-colors cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-2 border border-border-custom rounded-lg hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Habilidade */}
            {showSkillModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                <form onSubmit={saveSkill} className="bg-primary border border-border-custom rounded-2xl p-6 max-w-sm w-full space-y-4">
                  <h3 className="text-lg font-bold text-txt-primary">
                    {editingSkillId ? 'Editar Habilidade' : 'Nova Habilidade'}
                  </h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Nome</label>
                    <input
                      type="text"
                      required
                      value={skillFormState.name}
                      onChange={(e) => setSkillFormState({ ...skillFormState, name: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary/50 border border-border-custom rounded-lg text-txt-primary text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-txt-primary">Nível ({skillFormState.percentage}%)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={skillFormState.percentage}
                      onChange={(e) => setSkillFormState({ ...skillFormState, percentage: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSkillModal(false)}
                      className="px-4 py-2 border border-border-custom rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-txt-primary text-primary rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------- ABA: MENSAGENS -------------------- */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Caixa de Entrada</h2>

            <div className="space-y-4">
              {messagesList.length === 0 ? (
                <div className="p-8 text-center bg-secondary border border-border-custom rounded-2xl">
                  <p className="text-sm text-txt-secondary">Nenhuma mensagem recebida.</p>
                </div>
              ) : (
                messagesList.map((msg) => (
                  <div key={msg.id} className="p-6 bg-secondary border border-border-custom rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-txt-primary text-sm">{msg.name}</span>
                        <span className="text-[10px] text-txt-muted">
                          {msg.createdAt?.seconds
                            ? new Date(msg.createdAt.seconds * 1000).toLocaleString('pt-BR')
                            : 'Data desconhecida'}
                        </span>
                      </div>
                      <span className="text-xs text-txt-secondary font-medium block">{msg.email}</span>
                      <p className="text-xs text-txt-primary pt-2 bg-primary/30 p-3 rounded-lg border border-border-custom/50 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 border border-border-custom rounded-lg hover:border-rose-500 text-txt-secondary hover:text-rose-500 transition-colors cursor-pointer self-end sm:self-start"
                      title="Excluir Mensagem"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
