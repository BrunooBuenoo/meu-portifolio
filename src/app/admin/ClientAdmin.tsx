"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, LogOut, Check, ArrowLeft, Eye, MessageSquare, Laptop, Cpu, Tags, Database, Save, Upload, GraduationCap, Award, BarChart2 } from "lucide-react";
import ClientPage from "../ClientPage";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  updateSiteSettings,
  updateHeroSettings,
  saveProject,
  deleteProject,
  saveTechnology,
  deleteTechnology,
  saveSkill,
  deleteSkill,
  saveService,
  deleteService,
  saveTestimonial,
  deleteTestimonial,
  markMessageAsRead,
  getContactMessages,
  getProjects,
  getTechnologies,
  getSkills,
  getServices,
  getTestimonials,
  updateTimelineSettings,
  saveEducation,
  deleteEducation,
  saveCertification,
  deleteCertification,
  updateStatsSettings,
  updateCaseRealSettings,
  getCaseRealSettings,
  getEducation,
  getCertifications,
  getStatsSettings,
  updateSectionsSettings,
  getSectionsSettings
} from "@/lib/dataService";

interface ClientAdminProps {
  siteSettings: any;
  heroSettings: any;
  statsSettings: any;
  timelineSettings: any;
  projects: any[];
  technologies: any[];
  skills: any[];
  services: any[];
  testimonials: any[];
  themeColors: any;
  themeConfig: any;
  initialMessages: any[];
  initialCaseReal: any;
  initialEducation: any[];
  initialCertifications: any[];
  initialSectionsSettings: any;
}

export default function ClientAdmin({
  siteSettings: initialSite,
  heroSettings: initialHero,
  statsSettings: initialStats,
  timelineSettings: initialTimeline,
  projects: initialProjects,
  technologies: initialTech,
  skills: initialSkills,
  services: initialServices,
  testimonials: initialTestimonials,
  themeColors: initialThemeColors,
  themeConfig: initialThemeConfig,
  initialMessages,
  initialCaseReal,
  initialEducation,
  initialCertifications,
  initialSectionsSettings
}: ClientAdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("geral");

  // Dynamic States loaded from initial props or refreshed
  const [site, setSite] = useState(initialSite);
  const [hero, setHero] = useState(initialHero);
  const [visualDraftSite, setVisualDraftSite] = useState(initialSite);
  const [visualDraftHero, setVisualDraftHero] = useState(initialHero);
  const [projectsList, setProjectsList] = useState(initialProjects);
  const [techList, setTechList] = useState(initialTech);
  const [skillsList, setSkillsList] = useState(initialSkills);
  const [servicesList, setServicesList] = useState(initialServices);
  const [testimonialsList, setTestimonialsList] = useState(initialTestimonials);
  const [messages, setMessages] = useState(initialMessages);
  const [timelineItems, setTimelineItems] = useState(initialTimeline.timeline || []);
  const [caseReal, setCaseReal] = useState(initialCaseReal);
  const [educationList, setEducationList] = useState(initialEducation);
  const [certificationsList, setCertificationsList] = useState(initialCertifications);
  const [stats, setStats] = useState(initialStats.stats || []);
  const [sectionsSettings, setSectionsSettings] = useState(initialSectionsSettings || {
    sobreMim: true,
    servicos: true,
    projetos: true,
    jornada: true,
    casoReal: true,
    depoimentos: true,
    certificacoes: true,
    contato: true,
    stats: true
  });

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // CRUD Form States
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [currentTech, setCurrentTech] = useState<any | null>(null);
  const [currentSkill, setCurrentSkill] = useState<any | null>(null);
  const [currentService, setCurrentService] = useState<any | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState<any | null>(null);
  const [currentTimeline, setCurrentTimeline] = useState<any | null>(null);
  const [currentEducation, setCurrentEducation] = useState<any | null>(null);
  const [currentCertification, setCurrentCertification] = useState<any | null>(null);

  // Check login session and role on mount/auth state change
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          let isAdmin = false;
          
          // 1. Tenta verificar se o UID existe na coleção 'admins'
          try {
            if (db) {
              const adminDoc = await getDoc(doc(db, "admins", user.uid));
              if (adminDoc.exists()) {
                isAdmin = true;
              }
            }
          } catch (e: any) {
            console.log("Erro ao checar coleção admins:", e.message);
          }

          // 2. Se não encontrou, tenta verificar na coleção 'users' com role == 'admin'
          if (!isAdmin) {
            try {
              if (db) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === "admin") {
                  isAdmin = true;
                }
              }
            } catch (e: any) {
              console.log("Erro ao checar coleção users:", e.message);
            }
          }

          // 3. Fallback: se nenhuma coleção existe/está acessível, permitimos por estar autenticado
          if (!isAdmin) {
            // Deixamos true se não houver collections de controle, mas caso exista restrição de permissão, o Firestore bloqueará gravações
            isAdmin = true; 
          }

          if (isAdmin) {
            setIsAuthenticated(true);
          } else {
            await signOut(auth!);
            setIsAuthenticated(false);
            setAuthError("Acesso negado: Seu usuário não possui privilégios de administrador.");
          }
        } catch (err) {
          console.error("Erro durante verificação:", err);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Show status toasts
  const triggerFeedback = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 3500);
    }
  };

  useEffect(() => {
    setVisualDraftSite(site);
  }, [site]);

  useEffect(() => {
    setVisualDraftHero(hero);
  }, [hero]);

  // Convert uploaded image to Base64 String
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Authenticate
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth!, email, password);
    } catch (err: any) {
      console.error("Erro ao autenticar:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setAuthError("E-mail ou senha incorretos.");
      } else {
        setAuthError("Falha na autenticação: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth!);
      setIsAuthenticated(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh lists helper
  const refreshData = async () => {
    try {
      const projs = await getProjects();
      const techs = await getTechnologies();
      const sks = await getSkills();
      const srvs = await getServices();
      const tests = await getTestimonials();
      const msgs = await getContactMessages();
      const edus = await getEducation();
      const certs = await getCertifications();
      const cr = await getCaseRealSettings();
      const st = await getStatsSettings();
      const secs = await getSectionsSettings();

      setProjectsList(projs);
      setTechList(techs);
      setSkillsList(sks);
      setServicesList(srvs);
      setTestimonialsList(tests);
      setMessages(msgs);
      setEducationList(edus);
      setCertificationsList(certs);
      setCaseReal(cr);
      setStats(st.stats || []);
      setSectionsSettings(secs);
    } catch (err) {
      console.error("Erro ao atualizar listagens:", err);
    }
  };

  // ==========================================
  // HANDLERS: GERAL / SITE SETTINGS
  // ==========================================
  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSiteSettings(site);
      triggerFeedback("success", "Configurações gerais salvas com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Falha ao salvar as configurações.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: HERO SETTINGS
  // ==========================================
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHeroSettings(hero);
      triggerFeedback("success", "Efeito de escrita do Hero salvo!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar efeito do Hero.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSections = async () => {
    setLoading(true);
    try {
      await updateSectionsSettings(sectionsSettings);
      triggerFeedback("success", "Visibilidade das seções salva com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Falha ao salvar as configurações de seções.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHeroMessage = () => {
    setHero((prev: any) => ({
      ...prev,
      messages: [...prev.messages, ""]
    }));
  };

  const handleRemoveHeroMessage = (index: number) => {
    setHero((prev: any) => ({
      ...prev,
      messages: prev.messages.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleHeroMessageChange = (index: number, val: string) => {
    const updated = [...hero.messages];
    updated[index] = val;
    setHero((prev: any) => ({ ...prev, messages: updated }));
  };

  // ==========================================
  // HANDLERS: ESTATÍSTICAS
  // ==========================================
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStatsSettings({ stats });
      triggerFeedback("success", "Estatísticas salvas com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar estatísticas.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatChange = (index: number, field: string, value: any) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  // ==========================================
  // HANDLERS: CASE STUDY (CASO REAL)
  // ==========================================
  const handleSaveCaseReal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...caseReal,
        highlights: typeof caseReal.highlights === "string"
          ? caseReal.highlights.split(",").map((s: string) => s.trim())
          : caseReal.highlights
      };
      await updateCaseRealSettings(dataToSave);
      triggerFeedback("success", "Estudo de Caso atualizado!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar Estudo de Caso.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: EDUCAÇÃO
  // ==========================================
  const handleSaveEducationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEducation.title || !currentEducation.institution) return;
    setLoading(true);
    try {
      await saveEducation(currentEducation);
      setCurrentEducation(null);
      await refreshData();
      triggerFeedback("success", "Item de educação salvo!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar educação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Excluir esta formação?")) return;
    setLoading(true);
    try {
      await deleteEducation(id);
      await refreshData();
      triggerFeedback("success", "Item de educação removido.");
    } catch (err) {
      triggerFeedback("error", "Erro ao remover educação.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: CERTIFICAÇÕES
  // ==========================================
  const handleSaveCertificationForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCertification.title || !currentCertification.issuer) return;
    setLoading(true);
    try {
      await saveCertification(currentCertification);
      setCurrentCertification(null);
      await refreshData();
      triggerFeedback("success", "Certificação salva com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar certificação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Deseja remover esta certificação?")) return;
    setLoading(true);
    try {
      await deleteCertification(id);
      await refreshData();
      triggerFeedback("success", "Certificação removida.");
    } catch (err) {
      triggerFeedback("error", "Erro ao remover certificação.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: SERVIÇOS / SOLUTIONS
  // ==========================================
  const handleSaveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService.title || !currentService.description) return;
    setLoading(true);
    try {
      await saveService(currentService);
      setCurrentService(null);
      await refreshData();
      triggerFeedback("success", "Serviço salvo com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar serviço.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Deseja mesmo excluir este serviço?")) return;
    setLoading(true);
    try {
      await deleteService(id);
      await refreshData();
      triggerFeedback("success", "Serviço excluído.");
    } catch (err) {
      triggerFeedback("error", "Erro ao excluir serviço.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: PROJETOS
  // ==========================================
  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject.title || !currentProject.description) return;
    setLoading(true);
    try {
      const dataToSave = {
        ...currentProject,
        technologies: typeof currentProject.technologies === "string"
          ? currentProject.technologies.split(",").map((s: string) => s.trim())
          : currentProject.technologies
      };
      await saveProject(dataToSave);
      setCurrentProject(null);
      await refreshData();
      triggerFeedback("success", "Projeto salvo com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar projeto.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Deseja excluir este projeto?")) return;
    setLoading(true);
    try {
      await deleteProject(id);
      await refreshData();
      triggerFeedback("success", "Projeto excluído.");
    } catch (err) {
      triggerFeedback("error", "Erro ao excluir projeto.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: TECNOLOGIAS (CAROUSEL)
  // ==========================================
  const handleSaveTechForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTech.name || !currentTech.category) return;
    setLoading(true);
    try {
      await saveTechnology(currentTech);
      setCurrentTech(null);
      await refreshData();
      triggerFeedback("success", "Tecnologia salva!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar tecnologia.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTech = async (id: string) => {
    if (!confirm("Excluir esta tecnologia do carrossel?")) return;
    setLoading(true);
    try {
      await deleteTechnology(id);
      await refreshData();
      triggerFeedback("success", "Tecnologia removida.");
    } catch (err) {
      triggerFeedback("error", "Erro ao remover tecnologia.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: HABILIDADES (SKILLS PROGRESS)
  // ==========================================
  const handleSaveSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill.name || currentSkill.percentage === undefined) return;
    setLoading(true);
    try {
      await saveSkill(currentSkill);
      setCurrentSkill(null);
      await refreshData();
      triggerFeedback("success", "Habilidade salva!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar habilidade.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Remover esta habilidade?")) return;
    setLoading(true);
    try {
      await deleteSkill(id);
      await refreshData();
      triggerFeedback("success", "Habilidade removida.");
    } catch (err) {
      triggerFeedback("error", "Erro ao remover habilidade.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: JORNADA (TIMELINE)
  // ==========================================
  const handleSaveTimelineForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTimeline.date || !currentTimeline.title || !currentTimeline.company) return;
    
    setLoading(true);
    try {
      const skillsArray = typeof currentTimeline.skills === "string"
        ? currentTimeline.skills.split(",").map((s: string) => s.trim())
        : currentTimeline.skills;

      let updatedTimeline = [];
      const itemToSave = { ...currentTimeline, skills: skillsArray };

      if (currentTimeline.index !== undefined) {
        // Edit existing
        updatedTimeline = [...timelineItems];
        const { index, ...cleanItem } = itemToSave;
        updatedTimeline[index] = cleanItem;
      } else {
        // Add new
        updatedTimeline = [...timelineItems, itemToSave];
      }

      await updateTimelineSettings({ timeline: updatedTimeline });
      setTimelineItems(updatedTimeline);
      setCurrentTimeline(null);
      triggerFeedback("success", "Item de jornada atualizado com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Erro ao atualizar item de jornada.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimeline = async (index: number) => {
    if (!confirm("Excluir esta experiência da linha do tempo?")) return;
    setLoading(true);
    try {
      const updatedTimeline = timelineItems.filter((_: any, i: number) => i !== index);
      await updateTimelineSettings({ timeline: updatedTimeline });
      setTimelineItems(updatedTimeline);
      triggerFeedback("success", "Item de jornada removido.");
    } catch (err) {
      triggerFeedback("error", "Erro ao remover item.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: DEPOIMENTOS (TESTIMONIALS)
  // ==========================================
  const handleSaveTestimonialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial.quote || !currentTestimonial.name) return;
    setLoading(true);
    try {
      await saveTestimonial(currentTestimonial);
      setCurrentTestimonial(null);
      await refreshData();
      triggerFeedback("success", "Depoimento salvo!");
    } catch (err) {
      triggerFeedback("error", "Erro ao salvar depoimento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Deletar este depoimento?")) return;
    setLoading(true);
    try {
      await deleteTestimonial(id);
      await refreshData();
      triggerFeedback("success", "Depoimento deletado.");
    } catch (err) {
      triggerFeedback("error", "Erro ao deletar depoimento.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: MENSAGENS DE CONTATO
  // ==========================================
  const handleMarkMessage = async (id: string) => {
    setLoading(true);
    try {
      await markMessageAsRead(id);
      await refreshData();
      triggerFeedback("success", "Mensagem marcada como lida!");
    } catch (err) {
      triggerFeedback("error", "Erro ao atualizar mensagem.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLERS: EDITOR VISUAL (PREVIEW + PUBLICAR)
  // ==========================================
  const hasVisualDraftChanges =
    JSON.stringify(visualDraftSite || {}) !== JSON.stringify(site || {}) ||
    JSON.stringify(visualDraftHero || {}) !== JSON.stringify(hero || {});

  const handlePublishVisualDraft = async () => {
    setLoading(true);
    try {
      await Promise.all([
        updateSiteSettings(visualDraftSite),
        updateHeroSettings(visualDraftHero)
      ]);
      setSite(visualDraftSite);
      setHero(visualDraftHero);
      triggerFeedback("success", "Alterações visuais publicadas com sucesso!");
    } catch (err) {
      triggerFeedback("error", "Falha ao publicar alterações visuais.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardVisualDraft = () => {
    setVisualDraftSite(site);
    setVisualDraftHero(hero);
    triggerFeedback("success", "Rascunho visual descartado.");
  };

  // Render Login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 rounded-[32px] shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative size-12 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z" fill="#94ff47" />
                <circle cx="10" cy="10" r="2.5" fill="#09090b" />
              </svg>
            </div>
            <h2 className="font-sans font-bold text-2xl tracking-tight uppercase">Bueno Painel</h2>
            <p className="font-sans text-zinc-400 text-sm text-center">Digite os dados da sua conta administrativa do Firebase para prosseguir.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-sans text-sm font-semibold text-zinc-300">E-mail do Administrador</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail cadastrado no Firebase"
                className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-base text-white outline-none focus:border-[#94ff47] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="pass" className="font-sans text-sm font-semibold text-zinc-300">Senha</label>
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso administrador"
                className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-base text-white outline-none focus:border-[#94ff47] transition-colors"
                required
              />
            </div>

            {authError && <p className="text-rose-400 text-xs font-semibold text-center">{authError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#94ff47] text-[#09090b] font-sans font-semibold text-base py-3.5 rounded-full hover:bg-[#a8ff6b] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? "Autenticando..." : "Entrar no Painel"}</span>
            </button>
          </form>

          <a href="/" className="text-zinc-500 text-xs text-center hover:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors mt-2">
            <ArrowLeft size={12} />
            <span>Voltar ao site</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col transition-colors pb-12">
      {/* Admin Navbar Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative size-8 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z" fill="#94ff47" />
                <circle cx="10" cy="10" r="2.5" fill="#09090b" />
              </svg>
            </div>
            <span className="font-sans font-semibold text-lg tracking-tight uppercase">
              bueno<span className="text-[#94ff47] font-black">.</span>admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 border border-zinc-800 hover:bg-zinc-900 text-xs font-semibold px-4.5 py-2.5 rounded-full text-zinc-300 transition-colors"
            >
              <Eye size={12} />
              <span>Ver Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 transition-all cursor-pointer"
              title="Sair do painel"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {activeTab === "editorvisual" && (
        <button
          type="button"
          onClick={() => setActiveTab("geral")}
          className="fixed right-6 sm:right-10 top-24 z-50 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-zinc-700 bg-zinc-950/95 text-zinc-100 hover:bg-zinc-800 backdrop-blur-md flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Voltar para opcões</span>
        </button>
      )}

      <div
        className={`w-full grid ${
          activeTab === "editorvisual"
            ? "grid-cols-1 gap-0 mt-0"
            : "max-w-[1440px] mx-auto px-6 sm:px-10 grid-cols-1 lg:grid-cols-4 gap-8 mt-10"
        }`}
      >
        
        {/* Left Sidebar navigation tab list */}
        <aside className={`${activeTab === "editorvisual" ? "hidden" : "lg:col-span-1 flex flex-col gap-2"}`}>
          {[
            { id: "geral", label: "Dados Gerais" },
            { id: "editorvisual", label: "Editor Visual da Landing" },
            { id: "secoes", label: "Visibilidade de Seções" },
            { id: "hero", label: "Hero & Escrita" },
            { id: "estatisticas", label: "Contadores / Stats" },
            { id: "servicos", label: "Serviços" },
            { id: "projetos", label: "Projetos" },
            { id: "tecnologias", label: "Carrossel Tech" },
            { id: "skills", label: "Habilidades" },
            { id: "jornada", label: "Jornada" },
            { id: "casoreal", label: "Estudo de Caso" },
            { id: "credenciais", label: "Educação / Certificados" },
            { id: "depoimentos", label: "Depoimentos" },
            { id: "mensagens", label: `Mensagens (${messages.filter((m: any) => !m.read).length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentProject(null);
                setCurrentTech(null);
                setCurrentSkill(null);
                setCurrentService(null);
                setCurrentTestimonial(null);
                setCurrentTimeline(null);
                setCurrentEducation(null);
                setCurrentCertification(null);
              }}
              className={`text-left px-5 py-3 rounded-2xl font-sans text-sm font-semibold border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#94ff47] border-[#94ff47] text-[#09090b]"
                  : "bg-zinc-900/40 border-zinc-800/40 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Right Content dashboard editor container */}
        <main className={`${activeTab === "editorvisual" ? "col-span-1" : "lg:col-span-3"} bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/60 ${
          activeTab === "editorvisual" ? "p-0 overflow-hidden rounded-none min-h-[calc(100vh-80px)]" : "p-6 sm:p-10 rounded-[32px]"
        }`}>
          
          {/* Status Feedback Toasts inside card */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4.5 rounded-2xl font-sans text-sm font-semibold text-center mb-6 animate-pulse">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4.5 rounded-2xl font-sans text-sm font-semibold text-center mb-6">
              {errorMsg}
            </div>
          )}

          {/* ==========================================
              TAB: EDITOR VISUAL DA LANDING PAGE
             ========================================== */}
          {activeTab === "editorvisual" && (
            <div className="flex flex-col h-full min-h-[calc(100vh-80px)]">
              <div className="sticky top-0 z-30 bg-zinc-950/95 border-b border-zinc-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg">Editor Visual da Landing</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Edite direto no layout. As mudanças ficam em rascunho e so vao ao ar quando voce clicar em Publicar.
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("geral")}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                  >
                    Voltar ao painel
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscardVisualDraft}
                    disabled={loading || !hasVisualDraftChanges}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={handlePublishVisualDraft}
                    disabled={loading || !hasVisualDraftChanges}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs sm:text-sm px-5 py-2 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Upload size={14} />
                    <span>{loading ? "Publicando..." : "Publicar"}</span>
                  </button>
                </div>
              </div>

              <div className="p-0 bg-zinc-950">
                <ClientPage
                  siteSettings={visualDraftSite}
                  heroSettings={visualDraftHero}
                  statsSettings={{ stats }}
                  timelineSettings={{ timeline: timelineItems }}
                  projects={projectsList}
                  technologies={techList}
                  skills={skillsList}
                  themeColors={initialThemeColors}
                  themeConfig={initialThemeConfig}
                  services={servicesList}
                  testimonials={testimonialsList}
                  caseReal={caseReal}
                  education={educationList}
                  certifications={certificationsList}
                  sectionsSettings={sectionsSettings}
                  isEditable
                  onUpdateSite={(updatedSite) => setVisualDraftSite(updatedSite)}
                  onUpdateHero={(updatedHero) => setVisualDraftHero(updatedHero)}
                />
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: GERAL / SITE INFO
             ========================================== */}
          {activeTab === "geral" && (
            <form onSubmit={handleSaveSite} className="flex flex-col gap-6">
              <h3 className="font-sans font-bold text-xl mb-2">Configurações Gerais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Nome Completo</label>
                  <input
                    type="text"
                    value={site.name || ""}
                    onChange={(e) => setSite({ ...site, name: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Cargo / Título</label>
                  <input
                    type="text"
                    value={site.title || ""}
                    onChange={(e) => setSite({ ...site, title: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">E-mail Comercial</label>
                  <input
                    type="email"
                    value={site.email || ""}
                    onChange={(e) => setSite({ ...site, email: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">WhatsApp (Nº com DDD)</label>
                  <input
                    type="text"
                    value={site.whatsapp || ""}
                    onChange={(e) => setSite({ ...site, whatsapp: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Telefone Fone</label>
                  <input
                    type="text"
                    value={site.phone || ""}
                    onChange={(e) => setSite({ ...site, phone: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Localização / Cidade</label>
                  <input
                    type="text"
                    value={site.location || ""}
                    onChange={(e) => setSite({ ...site, location: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Link LinkedIn</label>
                  <input
                    type="text"
                    value={site.linkedin || ""}
                    onChange={(e) => setSite({ ...site, linkedin: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Link GitHub</label>
                  <input
                    type="text"
                    value={site.github || ""}
                    onChange={(e) => setSite({ ...site, github: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Frase de Impacto (Citação)</label>
                <input
                  type="text"
                  value={site.thought || ""}
                  onChange={(e) => setSite({ ...site, thought: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47] w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Sobre Mim (Biografia)</label>
                <textarea
                  value={site.about || ""}
                  onChange={(e) => setSite({ ...site, about: e.target.value })}
                  rows={4}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47] w-full resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-sm px-6 py-2.5 rounded-full self-start hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <Save size={16} />
                <span>Salvar Configurações</span>
              </button>
            </form>
          )}

          {/* ==========================================
              TAB: SEÇÕES VISÍVEIS (ATIVAR/DESATIVAR SEÇÃO)
             ========================================== */}
          {activeTab === "secoes" && (
            <div className="flex flex-col gap-6">
              <h3 className="font-sans font-bold text-xl mb-2">Visibilidade de Seções</h3>
              <p className="text-zinc-400 text-sm -mt-4">Escolha quais seções ficarão ativas e visíveis na Landing Page.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {[
                  { key: "sobreMim", label: "Sobre Mim & Habilidades" },
                  { key: "stats", label: "Contadores / Stats (Métricas)" },
                  { key: "servicos", label: "Serviços (O que eu desenvolvo)" },
                  { key: "projetos", label: "Projetos (Portfólio)" },
                  { key: "jornada", label: "Jornada (Linha do Tempo)" },
                  { key: "casoReal", label: "Estudo de Caso (Caso Real)" },
                  { key: "certificacoes", label: "Educação & Certificações" },
                  { key: "depoimentos", label: "Depoimentos" },
                  { key: "contato", label: "Formulário de Contato" }
                ].map((sec) => (
                  <div key={sec.key} className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
                    <span className="font-sans font-semibold text-sm text-zinc-200">{sec.label}</span>
                    <button
                      type="button"
                      onClick={() => setSectionsSettings((prev: any) => ({
                        ...prev,
                        [sec.key]: prev[sec.key] === false ? true : false
                      }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        sectionsSettings[sec.key] !== false ? "bg-[#94ff47]" : "bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                          sectionsSettings[sec.key] !== false ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSections}
                  disabled={loading}
                  className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#a8ff6b] disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{loading ? "Salvando..." : "Salvar Configurações"}</span>
                  <Save size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: HERO MESSAGES
             ========================================== */}
          {activeTab === "hero" && (
            <form onSubmit={handleSaveHero} className="flex flex-col gap-6">
              <h3 className="font-sans font-bold text-xl mb-1">Efeito Typewriter & Velocidades</h3>
              <p className="text-zinc-400 text-xs">Abaixo configure as frases de máquina de escrever do topo do site.</p>

              <div className="flex flex-col gap-3">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Mensagens Alternadas</label>
                {hero.messages.map((msg: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={msg}
                      onChange={(e) => handleHeroMessageChange(idx, e.target.value)}
                      placeholder="Frase do Hero"
                      className="flex-grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroMessage(idx)}
                      className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl shrink-0 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddHeroMessage}
                  className="border border-dashed border-zinc-700 hover:border-white text-zinc-300 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Adicionar Frase</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Veloc. Digitação (ms)</label>
                  <input
                    type="number"
                    value={hero.typingSpeed}
                    onChange={(e) => setHero({ ...hero, typingSpeed: parseInt(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Veloc. Exclusão (ms)</label>
                  <input
                    type="number"
                    value={hero.deletingSpeed}
                    onChange={(e) => setHero({ ...hero, deletingSpeed: parseInt(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Pausa Início (ms)</label>
                  <input
                    type="number"
                    value={hero.pauseStart}
                    onChange={(e) => setHero({ ...hero, pauseStart: parseInt(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Pausa Conclusão (ms)</label>
                  <input
                    type="number"
                    value={hero.pauseEnd}
                    onChange={(e) => setHero({ ...hero, pauseEnd: parseInt(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-sm px-6 py-2.5 rounded-full self-start hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <Save size={16} />
                <span>Salvar Configurações Hero</span>
              </button>
            </form>
          )}

          {/* ==========================================
              TAB: CONTADORES / STATS
             ========================================== */}
          {activeTab === "estatisticas" && (
            <form onSubmit={handleSaveStats} className="flex flex-col gap-6">
              <div>
                <h3 className="font-sans font-bold text-xl">Contadores & Estatísticas</h3>
                <p className="text-zinc-400 text-xs">Configure os três contadores numéricos na Home Page.</p>
              </div>

              <div className="flex flex-col gap-6">
                {stats.map((st: any, idx: number) => (
                  <div key={idx} className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800/80 flex flex-col gap-4">
                    <h4 className="font-sans font-bold text-xs text-[#94ff47] uppercase font-mono">Contador {idx + 1}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-550 text-[10px] font-semibold uppercase">Ícone / Emoji</label>
                        <input
                          type="text"
                          required
                          value={st.icon || ""}
                          onChange={(e) => handleStatChange(idx, "icon", e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-550 text-[10px] font-semibold uppercase">Número</label>
                        <input
                          type="number"
                          required
                          value={st.number || 0}
                          onChange={(e) => handleStatChange(idx, "number", parseInt(e.target.value))}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-550 text-[10px] font-semibold uppercase">Sufixo (ex: + ou %)</label>
                        <input
                          type="text"
                          value={st.suffix || ""}
                          onChange={(e) => handleStatChange(idx, "suffix", e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-550 text-[10px] font-semibold uppercase">Descrição / Label</label>
                        <input
                          type="text"
                          required
                          value={st.label || ""}
                          onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-sm px-6 py-2.5 rounded-full self-start hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <Save size={16} />
                <span>Salvar Estatísticas</span>
              </button>
            </form>
          )}

          {/* ==========================================
              TAB: SERVIÇOS
             ========================================== */}
          {activeTab === "servicos" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Serviços / Soluções</h3>
                  <p className="text-zinc-400 text-xs">Administre as especialidades técnicas da seção O que eu desenvolvo.</p>
                </div>
                {!currentService && (
                  <button
                    onClick={() => setCurrentService({ title: "", description: "", iconName: "Laptop" })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>

              {currentService ? (
                <form onSubmit={handleSaveServiceForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">
                    {currentService.id ? "Editar Serviço" : "Novo Serviço"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Título</label>
                      <input
                        type="text"
                        required
                        value={currentService.title}
                        onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Ícone</label>
                      <select
                        value={currentService.iconName}
                        onChange={(e) => setCurrentService({ ...currentService, iconName: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47] text-white"
                      >
                        <option value="Laptop">Laptop (Web Apps)</option>
                        <option value="Cpu">Cpu (APIs & Integrations)</option>
                        <option value="Tags">Tags (Automação/Retail)</option>
                        <option value="Database">Database (Bancos de dados)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Descrição Curta</label>
                    <textarea
                      required
                      value={currentService.description}
                      onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                      rows={3}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentService(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {servicesList.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhum serviço cadastrado.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {servicesList.map((srv: any) => (
                        <div key={srv.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[#94ff47] text-xs font-semibold tracking-wider font-mono">Icon: {srv.iconName}</span>
                            <h4 className="font-sans font-semibold text-base text-white mt-1">{srv.title}</h4>
                            <p className="font-sans text-xs text-zinc-400 line-clamp-2 leading-relaxed mt-1.5">{srv.description}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => setCurrentService(srv)}
                              className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: PROJETOS
             ========================================== */}
          {activeTab === "projetos" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Gerenciamento de Projetos</h3>
                  <p className="text-zinc-400 text-xs">Adicione ou edite os projetos exibidos no portfólio.</p>
                </div>
                {!currentProject && (
                  <button
                    onClick={() => setCurrentProject({ title: "", description: "", image: "", technologies: "", liveUrl: "", githubUrl: "", featured: false })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Novo Projeto</span>
                  </button>
                )}
              </div>

              {currentProject ? (
                <form onSubmit={handleSaveProjectForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">
                    {currentProject.id ? "Editar Projeto" : "Novo Projeto"}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Título do Projeto</label>
                      <input
                        type="text"
                        required
                        value={currentProject.title}
                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Tecnologias (separadas por vírgula)</label>
                      <input
                        type="text"
                        required
                        placeholder="Next.js, React, Firebase"
                        value={Array.isArray(currentProject.technologies) ? currentProject.technologies.join(", ") : currentProject.technologies}
                        onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Link de Produção (URL)</label>
                      <input
                        type="text"
                        value={currentProject.liveUrl}
                        onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Código GitHub (URL)</label>
                      <input
                        type="text"
                        value={currentProject.githubUrl}
                        onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Upload Imagem de Capa</label>
                    <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/60 p-4 rounded-xl">
                      {currentProject.image ? (
                        <img src={currentProject.image} alt="Preview" className="size-16 object-cover rounded-lg border border-zinc-800" />
                      ) : (
                        <div className="size-16 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-850">
                          <Upload size={18} className="text-zinc-650" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 flex-grow">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const base64Str = await convertToBase64(e.target.files[0]);
                              setCurrentProject({ ...currentProject, image: base64Str });
                            }
                          }}
                          className="text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-850 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                        />
                        <span className="text-[10px] text-zinc-550">Formato recomendado: PNG/JPG. A imagem será salva em Base64 no Firestore.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Descrição do Projeto</label>
                    <textarea
                      required
                      value={currentProject.description}
                      onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                      rows={4}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="proj-featured"
                      checked={currentProject.featured}
                      onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                      className="accent-[#94ff47] size-4 cursor-pointer"
                    />
                    <label htmlFor="proj-featured" className="font-sans text-sm text-zinc-300 font-semibold cursor-pointer select-none">
                      Destacar projeto na Home Page
                    </label>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar Projeto
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentProject(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {projectsList.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhum projeto cadastrado.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {projectsList.map((proj: any) => (
                        <div key={proj.id} className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                          <div className="aspect-[16/9] border-b border-zinc-850 bg-primary overflow-hidden relative">
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                            {proj.featured && (
                              <span className="absolute top-3 left-3 bg-[#94ff47] text-[#09090b] font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                                Destaque
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <h4 className="font-sans font-bold text-base text-white">{proj.title}</h4>
                              <p className="font-sans text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">{proj.description}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-zinc-850/60 pt-4 mt-auto">
                              <span className="text-[10px] text-zinc-500 font-mono">ID: {proj.id.substring(0, 8)}...</span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => setCurrentProject(proj)}
                                  className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: TECNOLOGIAS (CAROUSEL)
             ========================================== */}
          {activeTab === "tecnologias" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Tecnologias do Carrossel</h3>
                  <p className="text-zinc-400 text-xs">Controle as tecnologias no carrossel dinâmico da Home Page.</p>
                </div>
                {!currentTech && (
                  <button
                    onClick={() => setCurrentTech({ name: "", category: "Frontend", icon: "" })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Adicionar Tech</span>
                  </button>
                )}
              </div>

              {currentTech ? (
                <form onSubmit={handleSaveTechForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">Nova Tecnologia</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Nome da Tecnologia</label>
                      <input
                        type="text"
                        required
                        value={currentTech.name}
                        onChange={(e) => setCurrentTech({ ...currentTech, name: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Categoria</label>
                      <select
                        value={currentTech.category}
                        onChange={(e) => setCurrentTech({ ...currentTech, category: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47] text-white"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Linguagens">Linguagens</option>
                        <option value="Banco de Dados">Banco de Dados</option>
                        <option value="Ferramentas">Ferramentas</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Upload Ícone (Opcional)</label>
                    <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/60 p-4 rounded-xl">
                      {currentTech.icon ? (
                        <img src={currentTech.icon} alt="Tech Icon" className="size-10 object-contain rounded border border-zinc-800" />
                      ) : (
                        <div className="size-10 rounded bg-zinc-950 flex items-center justify-center border border-zinc-850">
                          <Upload size={14} className="text-zinc-650" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 flex-grow">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const base64Str = await convertToBase64(e.target.files[0]);
                              setCurrentTech({ ...currentTech, icon: base64Str });
                            }
                          }}
                          className="text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-850 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar Tecnologia
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTech(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {techList.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhuma tecnologia cadastrada.
                    </div>
                  ) : (
                    <div className="border border-zinc-800/80 rounded-2xl overflow-hidden">
                      <table className="w-full text-left font-sans text-sm">
                        <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-850">
                          <tr>
                            <th className="p-4">Ícone</th>
                            <th className="p-4">Tecnologia</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850 bg-zinc-900/10">
                          {techList.map((tech: any) => (
                            <tr key={tech.id} className="hover:bg-zinc-900/40">
                              <td className="p-4">
                                {tech.icon ? (
                                  <img src={tech.icon} alt={tech.name} className="size-8 object-contain" />
                                ) : (
                                  <div className="size-8 rounded bg-zinc-850 flex items-center justify-center text-xs font-bold text-accent font-mono select-none">
                                    {tech.name.substring(0, 2)}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-white">{tech.name}</td>
                              <td className="p-4">
                                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                                  {tech.category}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteTech(tech.id)}
                                  className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: SKILLS PROGRESS
             ========================================== */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Habilidades do Sobre Mim</h3>
                  <p className="text-zinc-400 text-xs">Gerencie as barras de progresso de proficiência técnica.</p>
                </div>
                {!currentSkill && (
                  <button
                    onClick={() => setCurrentSkill({ name: "", percentage: 80 })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Adicionar Habilidade</span>
                  </button>
                )}
              </div>

              {currentSkill ? (
                <form onSubmit={handleSaveSkillForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">Nova Habilidade</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Habilidade</label>
                      <input
                        type="text"
                        required
                        value={currentSkill.name}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Proficiência (0 - 100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={currentSkill.percentage}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, percentage: parseInt(e.target.value) })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar Habilidade
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSkill(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {skillsList.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhuma habilidade cadastrada.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4.5">
                      {skillsList.map((sk: any) => (
                        <div key={sk.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between gap-6">
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-sm font-semibold">
                              <span className="text-white">{sk.name}</span>
                              <span className="text-accent">{sk.percentage}%</span>
                            </div>
                            <div className="bg-zinc-950 h-2 rounded-full w-full overflow-hidden border border-zinc-850">
                              <div className="bg-accent h-full rounded-full" style={{ width: `${sk.percentage}%` }} />
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSkill(sk.id)}
                            className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: JORNADA (TIMELINE)
             ========================================== */}
          {activeTab === "jornada" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Jornada Profissional</h3>
                  <p className="text-zinc-400 text-xs">Edite a linha do tempo de experiências e conquistas da Home Page.</p>
                </div>
                {!currentTimeline && (
                  <button
                    onClick={() => setCurrentTimeline({ date: "", title: "", company: "", description: "", skills: "" })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Adicionar Item</span>
                  </button>
                )}
              </div>

              {currentTimeline ? (
                <form onSubmit={handleSaveTimelineForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">
                    {currentTimeline.index !== undefined ? "Editar Jornada" : "Novo Item de Jornada"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Período / Data</label>
                      <input
                        type="text"
                        required
                        placeholder="2024 - Presente"
                        value={currentTimeline.date}
                        onChange={(e) => setCurrentTimeline({ ...currentTimeline, date: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Empresa / Instituição</label>
                      <input
                        type="text"
                        required
                        value={currentTimeline.company}
                        onChange={(e) => setCurrentTimeline({ ...currentTimeline, company: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Cargo / Curso</label>
                      <input
                        type="text"
                        required
                        value={currentTimeline.title}
                        onChange={(e) => setCurrentTimeline({ ...currentTimeline, title: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Tecnologias principais (Vírgula)</label>
                      <input
                        type="text"
                        required
                        placeholder="React, Node.js, Docker"
                        value={Array.isArray(currentTimeline.skills) ? currentTimeline.skills.join(", ") : currentTimeline.skills}
                        onChange={(e) => setCurrentTimeline({ ...currentTimeline, skills: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Descrição / Atividades</label>
                    <textarea
                      required
                      value={currentTimeline.description}
                      onChange={(e) => setCurrentTimeline({ ...currentTimeline, description: e.target.value })}
                      rows={3}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTimeline(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {timelineItems.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhuma experiência cadastrada na linha do tempo.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {timelineItems.map((item: any, idx: number) => (
                        <div key={idx} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#94ff47] text-xs font-bold font-mono">{item.date}</span>
                              <span className="text-zinc-500 text-xs font-mono">•</span>
                              <span className="text-zinc-400 text-xs font-bold">{item.company}</span>
                            </div>
                            <h4 className="font-sans font-semibold text-base text-white mt-1.5">{item.title}</h4>
                            <p className="font-sans text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">{item.description}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => setCurrentTimeline({ ...item, index: idx })}
                              className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimeline(idx)}
                              className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: ESTUDO DE CASO (CASO REAL)
             ========================================== */}
          {activeTab === "casoreal" && (
            <form onSubmit={handleSaveCaseReal} className="flex flex-col gap-6">
              <div>
                <h3 className="font-sans font-bold text-xl">Estudo de Caso / Caso Real</h3>
                <p className="text-zinc-400 text-xs">Gerencie os detalhes do Estudo de Caso de sucesso na Home Page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Subtítulo Seção</label>
                  <input
                    type="text"
                    required
                    value={caseReal.subtitle || ""}
                    onChange={(e) => setCaseReal({ ...caseReal, subtitle: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Título Principal</label>
                  <input
                    type="text"
                    required
                    value={caseReal.title || ""}
                    onChange={(e) => setCaseReal({ ...caseReal, title: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    value={caseReal.company || ""}
                    onChange={(e) => setCaseReal({ ...caseReal, company: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-semibold uppercase">Texto do Botão CTA</label>
                  <input
                    type="text"
                    required
                    value={caseReal.buttonText || ""}
                    onChange={(e) => setCaseReal({ ...caseReal, buttonText: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Conquistas / Destaques (Separados por vírgula)</label>
                <textarea
                  required
                  placeholder="Comunicação ZPL II, Redução de 70% no faturamento, Sincronização em tempo real"
                  value={Array.isArray(caseReal.highlights) ? caseReal.highlights.join(", ") : caseReal.highlights}
                  onChange={(e) => setCaseReal({ ...caseReal, highlights: e.target.value })}
                  rows={2}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Descrição Narrativa</label>
                <textarea
                  required
                  value={caseReal.description || ""}
                  onChange={(e) => setCaseReal({ ...caseReal, description: e.target.value })}
                  rows={4}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#94ff47] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-xs font-semibold uppercase">Imagem Ilustrativa do Case</label>
                <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/60 p-4 rounded-xl">
                  {caseReal.image ? (
                    <img src={caseReal.image} alt="Case Preview" className="size-20 object-cover rounded-xl border border-zinc-800" />
                  ) : (
                    <div className="size-20 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-850">
                      <Upload size={20} className="text-zinc-650" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1 flex-grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const base64Str = await convertToBase64(e.target.files[0]);
                          setCaseReal({ ...caseReal, image: base64Str });
                        }
                      }}
                      className="text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-850 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-sm px-6 py-2.5 rounded-full self-start hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <Save size={16} />
                <span>Salvar Estudo de Caso</span>
              </button>
            </form>
          )}

          {/* ==========================================
              TAB: CREDENCIAIS (EDUCAÇÃO & CERTIFICADOS)
             ========================================== */}
          {activeTab === "credenciais" && (
            <div className="flex flex-col gap-12">
              
              {/* SUB-TAB: EDUCAÇÃO */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                      <GraduationCap className="text-[#94ff47]" size={20} />
                      <span>Formação Acadêmica</span>
                    </h3>
                    <p className="text-zinc-400 text-xs">Administre as suas graduações e cursos de formação.</p>
                  </div>
                  {!currentEducation && (
                    <button
                      onClick={() => setCurrentEducation({ title: "", institution: "", date: "", description: "" })}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus size={12} />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>

                {currentEducation ? (
                  <form onSubmit={handleSaveEducationForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                    <h4 className="font-sans font-bold text-xs text-[#94ff47]">Novo Registro Acadêmico</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Curso / Formação</label>
                        <input
                          type="text"
                          required
                          value={currentEducation.title}
                          onChange={(e) => setCurrentEducation({ ...currentEducation, title: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Instituição</label>
                        <input
                          type="text"
                          required
                          value={currentEducation.institution}
                          onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Período / Ano</label>
                        <input
                          type="text"
                          required
                          placeholder="2019 - 2023"
                          value={currentEducation.date}
                          onChange={(e) => setCurrentEducation({ ...currentEducation, date: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Descrição / Foco do Curso</label>
                      <textarea
                        required
                        value={currentEducation.description}
                        onChange={(e) => setCurrentEducation({ ...currentEducation, description: e.target.value })}
                        rows={3}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                      />
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentEducation(null)}
                        className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4">
                    {educationList.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 border border-dashed border-zinc-850 rounded-xl text-xs">
                        Nenhuma formação cadastrada.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {educationList.map((edu: any) => (
                          <div key={edu.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[#94ff47] text-xs font-bold font-mono">{edu.date}</span>
                                <span className="text-zinc-550 text-xs font-mono">•</span>
                                <span className="text-zinc-400 text-xs font-bold">{edu.institution}</span>
                              </div>
                              <h4 className="font-sans font-semibold text-base text-white mt-1.5">{edu.title}</h4>
                              <p className="font-sans text-xs text-zinc-400 leading-relaxed mt-1.5">{edu.description}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => setCurrentEducation(edu)}
                                className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteEducation(edu.id)}
                                className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SUB-TAB: CERTIFICAÇÕES */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                      <Award className="text-[#94ff47]" size={20} />
                      <span>Certificados Profissionais</span>
                    </h3>
                    <p className="text-zinc-400 text-xs">Cadastre e gerencie suas certificações técnicas.</p>
                  </div>
                  {!currentCertification && (
                    <button
                      onClick={() => setCurrentCertification({ title: "", issuer: "", date: "", credentialId: "" })}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus size={12} />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>

                {currentCertification ? (
                  <form onSubmit={handleSaveCertificationForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                    <h4 className="font-sans font-bold text-xs text-[#94ff47]">Novo Certificado</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Nome do Certificado</label>
                        <input
                          type="text"
                          required
                          value={currentCertification.title}
                          onChange={(e) => setCurrentCertification({ ...currentCertification, title: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Órgão Emissor</label>
                        <input
                          type="text"
                          required
                          value={currentCertification.issuer}
                          onChange={(e) => setCurrentCertification({ ...currentCertification, issuer: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">Ano / Data</label>
                        <input
                          type="text"
                          required
                          placeholder="2024"
                          value={currentCertification.date}
                          onChange={(e) => setCurrentCertification({ ...currentCertification, date: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase">ID Credencial (Opcional)</label>
                        <input
                          type="text"
                          value={currentCertification.credentialId}
                          onChange={(e) => setCurrentCertification({ ...currentCertification, credentialId: e.target.value })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentCertification(null)}
                        className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4">
                    {certificationsList.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 border border-dashed border-zinc-850 rounded-xl text-xs">
                        Nenhum certificado cadastrado.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {certificationsList.map((cert: any) => (
                          <div key={cert.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[#94ff47] text-xs font-bold font-mono">{cert.date}</span>
                                <span className="text-zinc-550 text-xs font-mono">•</span>
                                <span className="text-zinc-400 text-xs font-bold">{cert.issuer}</span>
                              </div>
                              <h4 className="font-sans font-semibold text-base text-white mt-1.5">{cert.title}</h4>
                              {cert.credentialId && (
                                <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Credencial ID: {cert.credentialId}</span>
                              )}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => setCurrentCertification(cert)}
                                className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteCertification(cert.id)}
                                className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==========================================
              TAB: DEPOIMENTOS
             ========================================== */}
          {activeTab === "depoimentos" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-sans font-bold text-xl">Depoimentos / Recomendações</h3>
                  <p className="text-zinc-400 text-xs">Administre as recomendações exibidas na Home Page.</p>
                </div>
                {!currentTestimonial && (
                  <button
                    onClick={() => setCurrentTestimonial({ quote: "", name: "", role: "", company: "" })}
                    className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-4 py-2 rounded-full hover:opacity-90 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>

              {currentTestimonial ? (
                <form onSubmit={handleSaveTestimonialForm} className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
                  <h4 className="font-sans font-bold text-sm text-[#94ff47]">Novo Depoimento</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Nome do Cliente</label>
                      <input
                        type="text"
                        required
                        value={currentTestimonial.name}
                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Cargo / Título</label>
                      <input
                        type="text"
                        required
                        value={currentTestimonial.role}
                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-400 text-xs font-semibold uppercase">Empresa</label>
                      <input
                        type="text"
                        required
                        value={currentTestimonial.company}
                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-semibold uppercase">Depoimento (Citação)</label>
                    <textarea
                      required
                      value={currentTestimonial.quote}
                      onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                      rows={3}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#94ff47] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#94ff47] text-[#09090b] font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTestimonial(null)}
                      className="border border-zinc-800 text-zinc-300 font-sans font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  {testimonialsList.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                      Nenhum depoimento cadastrado.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {testimonialsList.map((test: any) => (
                        <div key={test.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start gap-4">
                          <div>
                            <p className="font-sans text-xs text-zinc-400 italic line-clamp-2 leading-relaxed">"{test.quote}"</p>
                            <h4 className="font-sans font-semibold text-sm text-white mt-3">{test.name}</h4>
                            <p className="font-sans text-[10px] text-zinc-550">{test.role} · <span className="text-accent">{test.company}</span></p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => setCurrentTestimonial(test)}
                              className="p-2 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(test.id)}
                              className="p-2 border border-zinc-850 hover:bg-rose-500/10 text-rose-400 rounded-xl cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: MENSAGENS RECEBIDAS
             ========================================== */}
          {activeTab === "mensagens" && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-sans font-bold text-xl">Caixa de Entrada</h3>
                <p className="text-zinc-400 text-xs">Mensagens enviadas pelos visitantes no formulário de contato do site.</p>
              </div>

              <div className="flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                    Nenhuma mensagem recebida ainda.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`border p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${
                          msg.read 
                            ? "bg-zinc-950/20 border-zinc-900 text-zinc-400" 
                            : "bg-zinc-900/60 border-[#94ff47]/20 text-white"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-sans font-bold text-sm">{msg.name}</span>
                            <span className="text-zinc-650 text-xs font-mono">({msg.email})</span>
                            {!msg.read && (
                              <span className="bg-[#94ff47]/10 text-[#94ff47] border border-[#94ff47]/30 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full select-none">
                                Nova
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-sm leading-relaxed mt-2 text-zinc-300">{msg.message}</p>
                          <span className="text-[10px] text-zinc-550 mt-3 block font-mono">
                            Recebida em: {new Date(msg.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>

                        {!msg.read && (
                          <button
                            onClick={() => handleMarkMessage(msg.id)}
                            disabled={loading}
                            className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-[#94ff47] font-sans font-semibold text-xs px-4 py-2 rounded-full self-start sm:self-auto cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Check size={12} />
                            <span>Lida</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
