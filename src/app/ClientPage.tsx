/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, X, ArrowUpRight, ExternalLink, Send } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const GithubIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


import { sendContactMessage } from "@/lib/dataService";

import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import ContadorEstatisticas from "@/components/ContadorEstatisticas";
import CarrosselTecnologias from "@/components/CarrosselTecnologias";
import OQueDesenvolvo from "@/components/OQueDesenvolvo";
import CasoReal from "@/components/CasoReal";
import LinhaDoTempo from "@/components/LinhaDoTempo";
import Depoimentos from "@/components/Depoimentos";
import Certificacoes from "@/components/Certificacoes";
import LinksProfissionais from "@/components/LinksProfissionais";
import BotaoFlutuante from "@/components/BotaoFlutuante";

interface SiteSettings {
  name?: string;
  title?: string;
  about?: string;
  thought?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  whatsapp?: string;
  editableTexts?: Record<string, string>;
  [key: string]: unknown;
}

interface HeroSettings {
  messages?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseStart?: number;
  pauseEnd?: number;
  [key: string]: unknown;
}

interface StatItem {
  icon?: string;
  number: number;
  suffix?: string;
  label: string;
}

interface StatsSettings {
  stats?: StatItem[];
}

interface TimelineItem {
  date: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

interface TimelineSettings {
  timeline?: TimelineItem[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  [key: string]: unknown;
}

interface Technology {
  name: string;
  icon?: string;
  category?: string;
  [key: string]: unknown;
}

interface Skill {
  name: string;
  percentage: number;
  [key: string]: unknown;
}

interface Service {
  id?: string;
  title: string;
  description: string;
  iconName?: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface CaseReal {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  company: string;
  highlights: string[];
  buttonText: string;
}

interface EducationItem {
  id?: string;
  title: string;
  institution: string;
  date: string;
  description: string;
}

interface CertificationItem {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface HeroBackgroundConfig {
  circleColor?: string;
  circleOpacity?: number;
  circleSize?: number;
  circleX?: number;
  circleY?: number;
}

interface ThemeConfigEntry {
  heroBackground?: HeroBackgroundConfig;
}

type ThemeConfig = Record<string, ThemeConfigEntry | undefined>;

const KEYBOARD_SPACE_SAMPLE_PATH = "/sounds/space.mp3";
const KEYBOARD_FALLBACK_SAMPLE_PATH = "/sounds/type-1.mp3";

// ==========================================
// TYPEWRITER COMPONENT
// ==========================================
function Typewriter({
  messages,
  typingSpeed,
  deletingSpeed,
  pauseStart,
  pauseEnd,
}: {
  messages: string[];
  typingSpeed: number;
  deletingSpeed: number;
  pauseStart: number;
  pauseEnd: number;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const prevLengthRef = useRef(0);
  const keyboardSamplesRef = useRef<HTMLAudioElement[]>([]);
  const keyboardSpaceSampleRef = useRef<HTMLAudioElement | null>(null);
  const lastSoundAtRef = useRef(0);
  const canPlaySoundRef = useRef(false);

  useEffect(() => {
    const unlockAudio = () => {
      canPlaySoundRef.current = true;

      const loadSamples = async () => {
        if (!keyboardSpaceSampleRef.current) {
          const spaceAudio = new Audio(KEYBOARD_SPACE_SAMPLE_PATH);
          spaceAudio.preload = "auto";
          spaceAudio.load();
          keyboardSpaceSampleRef.current = spaceAudio;
        }

        if (keyboardSamplesRef.current.length > 0) return;

        try {
          const response = await fetch("/api/sounds/typing", { cache: "no-store" });
          if (!response.ok) {
            throw new Error("failed to fetch typing sounds");
          }

          const data = (await response.json()) as { keySamples?: string[] };
          const samples = Array.isArray(data.keySamples) ? data.keySamples : [];

          keyboardSamplesRef.current = samples.map((path) => {
            const audio = new Audio(path);
            audio.preload = "auto";
            audio.load();
            return audio;
          });
        } catch {
          const fallbackAudio = new Audio(KEYBOARD_FALLBACK_SAMPLE_PATH);
          fallbackAudio.preload = "auto";
          fallbackAudio.load();
          keyboardSamplesRef.current = [fallbackAudio];
        }
      };

      void loadSamples();
    };

    const cleanupAudio = () => {
      for (const sample of keyboardSamplesRef.current) {
        sample.pause();
        sample.src = "";
      }

      keyboardSamplesRef.current = [];

      if (keyboardSpaceSampleRef.current) {
        keyboardSpaceSampleRef.current.pause();
        keyboardSpaceSampleRef.current.src = "";
        keyboardSpaceSampleRef.current = null;
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    const typedNewChar = currentText.length > prevLengthRef.current && !isDeleting;

    if (typedNewChar && canPlaySoundRef.current) {
      const nowPerf = performance.now();
      // Prevent unnaturally dense clicks on very fast typing settings.
      if (nowPerf - lastSoundAtRef.current >= 28) {
        lastSoundAtRef.current = nowPerf;

        const typedChar = currentText[currentText.length - 1] || "";
        if (typedChar === " " && keyboardSpaceSampleRef.current) {
          const spaceClick = keyboardSpaceSampleRef.current.cloneNode(true) as HTMLAudioElement;
          spaceClick.volume = 0.2;
          spaceClick.playbackRate = 1;
          spaceClick.play().catch(() => undefined);
        } else if (keyboardSamplesRef.current.length > 0) {
          const sampleIndex = Math.floor(Math.random() * keyboardSamplesRef.current.length);
          const click = keyboardSamplesRef.current[sampleIndex].cloneNode(true) as HTMLAudioElement;
          click.volume = 0.18;
          click.playbackRate = 1;
          click.play().catch(() => undefined);
        }
      }
    }

    prevLengthRef.current = currentText.length;
  }, [currentText, isDeleting]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const fullText = messages[currentIdx] || "";

    if (!isDeleting) {
      if (currentText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), pauseEnd);
      } else {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, currentText.length === 0 ? pauseStart : typingSpeed);
      }
    } else {
      if (currentText === "") {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIdx((prev) => (prev + 1) % messages.length);
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1));
        }, deletingSpeed);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentText, isDeleting, currentIdx, messages, typingSpeed, deletingSpeed, pauseStart, pauseEnd]);

  return (
    <span className="border-r-2 border-accent pr-1 animate-pulse font-mono text-accent">
      {currentText}
    </span>
  );
}

// ==========================================
// INTERACTIVE PORTFOLIO PAGE
// ==========================================
interface ClientPageProps {
  siteSettings: SiteSettings;
  heroSettings: HeroSettings;
  statsSettings: StatsSettings;
  timelineSettings: TimelineSettings;
  projects: Project[];
  technologies: Technology[];
  skills: Skill[];
  themeConfig: ThemeConfig;
  services: Service[];
  testimonials: Testimonial[];
  caseReal: CaseReal;
  education: EducationItem[];
  certifications: CertificationItem[];
  sectionsSettings?: Record<string, boolean | undefined>;
  isEditable?: boolean;
  onUpdateSite?: (updatedSite: SiteSettings) => void;
  onUpdateHero?: (updatedHero: HeroSettings) => void;
}

export default function ClientPage({
  siteSettings,
  heroSettings,
  statsSettings,
  timelineSettings,
  projects,
  technologies,
  skills,
  themeConfig,
  services = [],
  testimonials = [],
  caseReal,
  education = [],
  certifications = [],
  sectionsSettings = {},
  isEditable = false,
  onUpdateSite,
  onUpdateHero
}: ClientPageProps) {
  const { theme } = useTheme();

  const editableTexts = siteSettings?.editableTexts || {};

  const getEditableText = (key: string, fallback: string) => {
    return editableTexts[key] || fallback;
  };

  const updateEditableText = (key: string, value: string) => {
    if (!onUpdateSite) return;
    onUpdateSite({
      ...siteSettings,
      editableTexts: {
        ...editableTexts,
        [key]: value
      }
    });
  };

  // Projects states
  const [projFilter, setProjFilter] = useState<"todos" | "destaques">("destaques");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Contact form states
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  // Filtered projects
  const filteredProjects = projects.filter((p) => projFilter === "todos" || p.featured);

  // Handle contact form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSending(true);
    setSendSuccess(null);
    try {
      await sendContactMessage(formState.name, formState.email, formState.message);
      setSendSuccess(true);
      setFormState({ name: "", email: "", message: "" });
    } catch {
      setSendSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  // Glow config inline styles based on theme configuration
  const getGlowStyle = () => {
    const defaultGlow = {
      background: "radial-gradient(ellipse, rgba(148,255,71,0.15) 0%, transparent 70%)"
    };

    if (!themeConfig || !themeConfig[theme] || !themeConfig[theme].heroBackground) {
      return defaultGlow;
    }

    const bg = themeConfig[theme]?.heroBackground;
    if (!bg) return defaultGlow;

    const color = bg.circleColor;
    const size = bg.circleSize || 80;
    const opacity = (bg.circleOpacity || 15) / 100;
    const posX = bg.circleX !== undefined ? bg.circleX : 50;
    const posY = bg.circleY !== undefined ? bg.circleY : 50;

    // Convert hex or plain rgb/rgba to format with custom opacity
    let colorString = color;
    if (color && color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      colorString = `rgba(${r},${g},${b},${opacity})`;
    }

    return {
      background: `radial-gradient(ellipse ${size}% at ${posX}% ${posY}%, ${colorString} 0%, transparent 70%)`
    };
  };

  const sectionReveal = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
      },
    },
  };

  const sectionItem = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="relative min-h-screen bg-primary transition-colors flex flex-col font-sans">
      <Cabecalho name={siteSettings?.name || ""} />

      <main className="flex-grow pt-20">
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[90vh] lg:h-[calc(100vh-80px)] flex items-center px-6 sm:px-10 overflow-hidden pt-20 pb-10">
          {/* Radial Dynamic Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="hero-glow w-full h-[700px] absolute top-[-100px] left-1/2 -translate-x-1/2" style={getGlowStyle()} />
          </div>

          {/* Imagem de Fundo da Hero com overlay de simulacao na tela do notebook */}
          <div className="absolute right-0 bottom-0 w-full h-[55%] lg:h-full lg:w-[70%] z-0 pointer-events-none flex items-end justify-end opacity-20 lg:opacity-100 transition-opacity">
            <div className="relative w-full h-auto max-h-[45vh] lg:max-h-[85vh]">
              <img
                src="/images/hero-n.png"
                alt="Bueno Portfolio Background Mockup"
                className="w-full h-auto max-h-[45vh] lg:max-h-[85vh] object-contain object-right-bottom select-none block"
              />              
            </div>
          </div>

          <motion.div
            className="max-w-[1440px] mx-auto w-full z-10 relative"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {/* Bloco 1: Textos e Botões (Esquerda) */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-5xl">
              <motion.h1
                variants={sectionItem}
                className="font-sans font-bold text-text-primary text-5xl sm:text-[60px] lg:text-[60px] xl:text-[60px] leading-[1.05] tracking-tight"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => updateEditableText("heroTitle", e.currentTarget.textContent || "")}
                  className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                >
                  {getEditableText("heroTitle", "Desenvolvendo Soluções")}
                </span>
                <br />
                {isEditable ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!onUpdateHero) return;
                      const text = (e.currentTarget.textContent || "").trim();
                      const currentMessages = Array.isArray(heroSettings?.messages) ? [...heroSettings.messages] : [];
                      if (currentMessages.length === 0) {
                        currentMessages.push(text);
                      } else {
                        currentMessages[0] = text;
                      }
                      onUpdateHero({ ...heroSettings, messages: currentMessages });
                    }}
                    className="border-r-2 border-accent pr-1 font-mono text-accent outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent"
                  >
                    {heroSettings?.messages?.[0] || "Nova mensagem da Hero"}
                  </span>
                ) : (
                  <Typewriter
                    messages={heroSettings?.messages || []}
                    typingSpeed={heroSettings?.typingSpeed || 100}
                    deletingSpeed={heroSettings?.deletingSpeed || 50}
                    pauseStart={heroSettings?.pauseStart || 500}
                    pauseEnd={heroSettings?.pauseEnd || 2000}
                  />
                )}
              </motion.h1>

              <motion.p
                variants={sectionItem}
                className="font-sans text-text-secondary text-base sm:text-lg leading-relaxed max-w-[500px]"
              >
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (onUpdateSite) {
                      const firstSentence = e.currentTarget.textContent || "";
                      const restOfAbout = (siteSettings?.about || "").split(".").slice(1).join(".");
                      onUpdateSite({ ...siteSettings, about: firstSentence.trim() + "." + (restOfAbout ? restOfAbout : "") });
                    }
                  }}
                  className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""}
                >
                  {(siteSettings?.about)}
                </span>
              </motion.p>

              <motion.div variants={sectionItem} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
                <a
                  href="#projetos"
                  className="bg-accent text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(148,255,71,0.2)]"
                >
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => updateEditableText("heroProjectsButton", e.currentTarget.textContent || "")}
                    className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                  >
                    {getEditableText("heroProjectsButton", "Ver Projetos")}
                  </span>
                </a>
                {siteSettings?.linkedin && (
                  <a
                    href={siteSettings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border/40 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <LinkedinIcon size={18} />
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("linkedinButtonLabel", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                    >
                      {getEditableText("linkedinButtonLabel", "LinkedIn")}
                    </span>
                  </a>
                )}
                {siteSettings?.github && (
                  <a
                    href={siteSettings.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border/40 hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:hover:text-primary hover:text-white hover:border-zinc-800 dark:hover:border-zinc-100 text-text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2"
                  >
                    <GithubIcon size={18} />
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("githubButtonLabel", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                    >
                      {getEditableText("githubButtonLabel", "GitHub")}
                    </span>
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 2. STATS SECTION */}
        {sectionsSettings?.stats !== false && <ContadorEstatisticas stats={statsSettings?.stats || []} />}

        {/* 3. SOBRE MIM SECTION */}
        {sectionsSettings?.sobreMim !== false && (
          <section className="bg-primary py-24 px-6 sm:px-10 transition-colors" id="sobre-mim">
            <motion.div
              className="max-w-[1440px] mx-auto"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
                {/* Left Bio Column */}
                <motion.div variants={sectionItem} className="flex-1 flex flex-col justify-between gap-6">
                  <div>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("aboutLabel", e.currentTarget.textContent || "")}
                      className={`font-sans text-accent text-sm font-semibold uppercase tracking-widest ${
                        isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                      }`}
                    >
                      {getEditableText("aboutLabel", "Sobre Mim")}
                    </span>
                    <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-6">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("aboutTitle", e.currentTarget.textContent || "")}
                        className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                      >
                        {getEditableText("aboutTitle", "Minha História")}
                      </span>
                    </h2>
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (onUpdateSite) {
                          onUpdateSite({ ...siteSettings, about: e.currentTarget.textContent || "" });
                        }
                      }}
                      className={`font-sans text-text-secondary text-base sm:text-lg leading-relaxed mb-6 ${
                        isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded-lg focus:outline-accent" : ""
                      }`}
                    >
                      {siteSettings.about}
                    </p>
                  </div>
                  
                  {/* Big Quote / Thought block */}
                  <div className="relative border-l-2 border-accent pl-6 py-2 my-4">
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (onUpdateSite) {
                          let text = e.currentTarget.textContent || "";
                          if (text.startsWith('"')) text = text.slice(1);
                          if (text.endsWith('"')) text = text.slice(0, -1);
                          onUpdateSite({ ...siteSettings, thought: text.trim() });
                        }
                      }}
                      className={`font-sans font-medium text-text-primary text-xl italic leading-relaxed ${
                        isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded-lg focus:outline-accent" : ""
                      }`}
                    >
                      {isEditable ? siteSettings.thought : `"${siteSettings.thought}"`}
                    </p>
                    <p className="font-sans text-text-muted text-xs uppercase tracking-widest mt-2">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("aboutThoughtLabel", e.currentTarget.textContent || "")}
                        className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""}
                      >
                        {getEditableText("aboutThoughtLabel", "- Filosofia de Trabalho")}
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Right Skills Progress Column */}
                <motion.div variants={sectionItem} className="flex-1">
                  <div className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-8 sm:p-10 rounded-[32px] h-full flex flex-col justify-center">
                    <h3 className="font-sans font-bold text-text-primary text-2xl mb-8">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("skillsTitle", e.currentTarget.textContent || "")}
                        className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                      >
                        {getEditableText("skillsTitle", "Habilidades Principais")}
                      </span>
                    </h3>
                    
                    <div className="flex flex-col gap-6">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-sm font-semibold">
                            <span className="font-sans text-text-primary">{skill.name}</span>
                            <span className="font-sans text-accent">{skill.percentage}%</span>
                          </div>
                          {/* Progress Bar Container */}
                          <div className="bg-border/20 h-2.5 rounded-full w-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                              className="bg-accent h-full rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}

        {/* 4. TECNOLOGIAS CAROUSEL */}
        {sectionsSettings?.sobreMim !== false && (
          <CarrosselTecnologias
            technologies={technologies}
            isEditable={isEditable}
            getEditableText={getEditableText}
            onUpdateText={updateEditableText}
          />
        )}

        {/* 5. PROJETOS EM DESTAQUE */}
        {sectionsSettings?.projetos !== false && (
          <section className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="projetos">
            <motion.div
              className="max-w-[1440px] mx-auto"
              variants={sectionReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
                <motion.div variants={sectionItem}>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => updateEditableText("projectsLabel", e.currentTarget.textContent || "")}
                    className={`font-sans text-accent text-sm font-semibold uppercase tracking-widest ${
                      isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                    }`}
                  >
                    {getEditableText("projectsLabel", "Portfólio")}
                  </span>
                  <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("projectsTitle", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                    >
                      {getEditableText("projectsTitle", "Projetos Recentes")}
                    </span>
                  </h2>
                </motion.div>

                {/* Pill filter selector */}
                <motion.div variants={sectionItem} className="bg-secondary/50 border border-border/20 p-1.5 rounded-full flex gap-1 self-start sm:self-auto">
                  <button
                    onClick={() => setProjFilter("destaques")}
                    className={`px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all cursor-pointer ${
                      projFilter === "destaques"
                        ? "bg-accent text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("projectsFilterFeatured", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                    >
                      {getEditableText("projectsFilterFeatured", "Destaques")}
                    </span>
                  </button>
                  <button
                    onClick={() => setProjFilter("todos")}
                    className={`px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all cursor-pointer ${
                      projFilter === "todos"
                        ? "bg-accent text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("projectsFilterAll", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                    >
                      {getEditableText("projectsFilterAll", "Todos")}
                    </span>
                  </button>
                </motion.div>
              </div>

              {/* Projects Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedProject(project)}
                      className="bg-secondary/30 backdrop-blur-sm border border-border/20 rounded-[32px] overflow-hidden group hover:border-border cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Box */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-primary/40 border-b border-border/20">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-accent text-primary p-3 rounded-full shadow-lg">
                              <ArrowUpRight size={20} className="stroke-[2.5]" />
                            </div>
                          </div>
                        </div>

                        {/* Content Box */}
                        <div className="p-6">
                          <h3 className="font-sans font-bold text-text-primary text-xl mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-3 mb-6">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Tech List */}
                      <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2 mt-auto">
                        {project.technologies.slice(0, 3).map((tech: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="bg-primary/50 border border-border/20 text-text-secondary font-sans font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-text-muted text-xs self-center">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* 6. CASE STUDY SECTION */}
        {sectionsSettings?.casoReal !== false && <CasoReal data={caseReal} />}

        {/* 7. O QUE DESENVOLVO (SERVICES) */}
        {sectionsSettings?.servicos !== false && <OQueDesenvolvo services={services} />}

        {/* 8. JORNADA (TIMELINE) */}
        {sectionsSettings?.jornada !== false && (
          <LinhaDoTempo
            timeline={timelineSettings.timeline}
            isEditable={isEditable}
            getEditableText={getEditableText}
            onUpdateText={updateEditableText}
          />
        )}

        {/* 9. DEPOIMENTOS SECTION */}
        {sectionsSettings?.depoimentos !== false && <Depoimentos testimonials={testimonials} />}

        {/* 10. CERTIFICAÇÕES SECTION */}
        {sectionsSettings?.certificacoes !== false && (
          <Certificacoes
            education={education}
            certifications={certifications}
            isEditable={isEditable}
            getEditableText={getEditableText}
            onUpdateText={updateEditableText}
          />
        )}

        {/* 11. CONTATO (FORM + CONTACT DETAILS) */}
        {sectionsSettings?.contato !== false && (
          <section className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="contato">
          <motion.div
            className="max-w-[1440px] mx-auto"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
              {/* Left Contact Info Column */}
              <motion.div variants={sectionItem} className="flex-1 flex flex-col justify-between gap-6">
                <div>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => updateEditableText("contactLabel", e.currentTarget.textContent || "")}
                    className={`font-sans text-accent text-sm font-semibold uppercase tracking-widest ${
                      isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                    }`}
                  >
                    {getEditableText("contactLabel", "Contato")}
                  </span>
                  <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-6">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("contactTitle", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                    >
                      {getEditableText("contactTitle", "Vamos Construir Algo Juntos?")}
                    </span>
                  </h2>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => updateEditableText("contactDescription", e.currentTarget.textContent || "")}
                    className={`font-sans text-text-secondary text-base sm:text-lg leading-relaxed max-w-[500px] ${
                      isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded focus:outline-accent" : ""
                    }`}
                  >
                    {getEditableText(
                      "contactDescription",
                      "Entre em contato para discutirmos projetos de automação comercial, portfólios, integrações de APIs ou contratação de serviços de desenvolvimento."
                    )}
                  </p>
                </div>

                {/* Details List */}
                <div className="flex flex-col gap-6 my-8">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full border border-border/20 flex items-center justify-center text-accent bg-secondary/30">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactEmailLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-muted text-xs uppercase tracking-wider ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                        }`}
                      >
                        {getEditableText("contactEmailLabel", "E-mail")}
                      </p>
                      <a href={`mailto:${siteSettings?.email || ""}`} className="font-sans text-text-primary font-semibold text-base sm:text-lg hover:underline break-all">
                        {siteSettings?.email || ""}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full border border-border/20 flex items-center justify-center text-accent bg-secondary/30">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactPhoneLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-muted text-xs uppercase tracking-wider ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                        }`}
                      >
                        {getEditableText("contactPhoneLabel", "Telefone")}
                      </p>
                      <a href={`tel:${(siteSettings?.phone || "").replace(/[^+\d]/g, "")}`} className="font-sans text-text-primary font-semibold text-base sm:text-lg hover:underline">
                        {siteSettings?.phone || ""}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full border border-border/20 flex items-center justify-center text-accent bg-secondary/30">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactLocationLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-muted text-xs uppercase tracking-wider ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
                        }`}
                      >
                        {getEditableText("contactLocationLabel", "Localização")}
                      </p>
                      <span className="font-sans text-text-primary font-semibold text-base sm:text-lg">
                        {siteSettings?.location || ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Redes Sociais */}
                <LinksProfissionais
                  linkedinUrl={siteSettings?.linkedin || ""}
                  githubUrl={siteSettings?.github || ""}
                  cvUrl="#"
                />
              </motion.div>

              {/* Right Contact Form Column */}
              <motion.div variants={sectionItem} className="flex-1">
                <div className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-8 sm:p-10 rounded-[32px] h-full">
                  <h3 className="font-sans font-bold text-text-primary text-2xl mb-8">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => updateEditableText("contactFormTitle", e.currentTarget.textContent || "")}
                      className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                    >
                      {getEditableText("contactFormTitle", "Envie uma Mensagem")}
                    </span>
                  </h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="form-name"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactFormNameLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-secondary text-sm font-semibold ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent inline-block" : ""
                        }`}
                      >
                        {getEditableText("contactFormNameLabel", "Nome Completo")}
                      </label>
                      <input
                        type="text"
                        id="form-name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={getEditableText("contactFormNamePlaceholder", "Seu nome")}
                        className="bg-primary/50 border border-border/20 text-text-primary font-sans text-base px-5 py-3 rounded-2xl outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="form-email"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactFormEmailLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-secondary text-sm font-semibold ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent inline-block" : ""
                        }`}
                      >
                        {getEditableText("contactFormEmailLabel", "E-mail")}
                      </label>
                      <input
                        type="email"
                        id="form-email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={getEditableText("contactFormEmailPlaceholder", "seu.email@exemplo.com")}
                        className="bg-primary/50 border border-border/20 text-text-primary font-sans text-base px-5 py-3 rounded-2xl outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="form-message"
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("contactFormMessageLabel", e.currentTarget.textContent || "")}
                        className={`font-sans text-text-secondary text-sm font-semibold ${
                          isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent inline-block" : ""
                        }`}
                      >
                        {getEditableText("contactFormMessageLabel", "Sua Mensagem")}
                      </label>
                      <textarea
                        id="form-message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                        placeholder={getEditableText("contactFormMessagePlaceholder", "Escreva sobre o seu projeto ou dúvidas...")}
                        className="bg-primary/50 border border-border/20 text-text-primary font-sans text-base px-5 py-3 rounded-2xl outline-none focus:border-accent resize-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="bg-accent text-primary font-sans font-semibold text-base py-3.5 rounded-full hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                    >
                      {isSending ? (
                        <span>{getEditableText("contactFormSending", "Enviando...")}</span>
                      ) : (
                        <>
                          <span
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => updateEditableText("contactFormSubmit", e.currentTarget.textContent || "")}
                            className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                          >
                            {getEditableText("contactFormSubmit", "Enviar Mensagem")}
                          </span>
                          <Send size={16} />
                        </>
                      )}
                    </button>

                    {/* Feedback Messages */}
                    <AnimatePresence>
                      {sendSuccess === true && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl font-sans text-sm text-center"
                        >
                          Sua mensagem foi enviada com sucesso! Entrarei em contato em breve.
                        </motion.div>
                      )}
                      {sendSuccess === false && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl font-sans text-sm text-center"
                        >
                          Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

    </main>

      <Rodape
        name={siteSettings?.name || ""}
        email={siteSettings?.email || ""}
        phone={siteSettings?.phone || ""}
        location={siteSettings?.location || ""}
        linkedin={siteSettings?.linkedin || ""}
        github={siteSettings?.github || ""}
      />

      <BotaoFlutuante />

      {/* ==========================================
          MODAL DETALHADO DO PROJETO
         ========================================== */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-3xl bg-secondary border border-border/30 rounded-[32px] overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header Image box with Close Button */}
              <div className="relative aspect-[16/9] w-full bg-primary overflow-hidden shrink-0 border-b border-border/20">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-primary/60 hover:bg-primary border border-border/30 text-text-primary p-2.5 rounded-full transition-colors cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6">
                <div>
                  <h3 className="font-sans font-bold text-text-primary text-2xl sm:text-3xl mb-3">
                    {selectedProject.title}
                  </h3>
                  
                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="bg-primary/80 border border-border/20 text-accent font-sans font-semibold text-xs px-3.5 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="font-sans text-text-secondary text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* External buttons links */}
                <div className="flex flex-wrap items-center gap-4 mt-4 border-t border-border/20 pt-6">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-accent text-primary font-sans font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-all"
                    >
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("projectModalOpenLabel", e.currentTarget.textContent || "")}
                        className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                      >
                        {getEditableText("projectModalOpenLabel", "Acessar Projeto")}
                      </span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-border/40 text-text-primary font-sans font-semibold text-sm px-6 py-3 rounded-full hover:bg-border/10 transition-all"
                    >
                      <GithubIcon size={16} />
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => updateEditableText("projectModalCodeLabel", e.currentTarget.textContent || "")}
                        className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""}
                      >
                        {getEditableText("projectModalCodeLabel", "Ver Código")}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
