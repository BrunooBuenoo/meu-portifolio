"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Files,
  Search,
  GitBranch,
  Blocks,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  FileCode,
  Folder,
  FolderOpen,
  Terminal as TerminalIcon,
  Check,
  Code2,
  FileJson,
  FileText,
} from "lucide-react";

export type PowerStatus = "off" | "starting" | "on" | "shutting-down";

interface DevFile {
  id: string;
  name: string;
  folder: string;
  language: string;
  content: string;
}

const INITIAL_FILES: DevFile[] = [
  {
    id: "Hero.tsx",
    name: "Hero.tsx",
    folder: "src/components",
    language: "typescriptreact",
    content: `import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold text-white">
          Desenvolvendo Soluções
        </h1>
        <p className="text-lg text-accent mt-4">
          Engenharia de Software & Interface Design
        </p>
      </div>
    </section>
  );
}`,
  },
  {
    id: "page.tsx",
    name: "page.tsx",
    folder: "src/app",
    language: "typescriptreact",
    content: `import ClientPage from "@/app/ClientPage";
import { getSiteSettings } from "@/lib/data";

export default async function Page() {
  const data = await getSiteSettings();
  return <ClientPage siteSettings={data} />;
}`,
  },
  {
    id: "Projects.tsx",
    name: "Projects.tsx",
    folder: "src/components",
    language: "typescriptreact",
    content: `export const projects = [
  {
    id: "1",
    title: "Plataforma Web SaaS",
    techs: ["React", "Next.js", "TailwindCSS"],
    featured: true
  },
  {
    id: "2",
    title: "Sistema E-commerce",
    techs: ["TypeScript", "Node.js", "PostgreSQL"],
    featured: true
  }
];`,
  },
  {
    id: "ContadorEstatisticas.tsx",
    name: "ContadorEstatisticas.tsx",
    folder: "src/components",
    language: "typescriptreact",
    content: `import React from "react";
import { IconeFogueteAnimado } from "@/components/IconesAnimados";

export default function ContadorEstatisticas() {
  return (
    <div className="flex items-center gap-4 py-8">
      <div className="flex items-center gap-2">
        <IconeFogueteAnimado />
        <span className="text-3xl font-bold text-white">20+</span>
        <span className="text-xs text-text-secondary uppercase">
          Projetos Concluídos
        </span>
      </div>
    </div>
  );
}`,
  },
  {
    id: "globals.css",
    name: "globals.css",
    folder: "src/styles",
    language: "css",
    content: `@import "tailwindcss";

:root {
  --primary: #09090b;
  --accent: #94ff47;
  --border: #27272a;
}

body {
  background-color: var(--primary);
  color: #ffffff;
  font-family: var(--font-sans);
}`,
  },
  {
    id: "package.json",
    name: "package.json",
    folder: "root",
    language: "json",
    content: `{
  "name": "meu-portifolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^16.3.0",
    "react": "^19.2.0",
    "framer-motion": "^12.0.0",
    "gsap": "^3.15.0",
    "lucide-react": "^1.23.0"
  }
}`,
  },
  {
    id: "README.md",
    name: "README.md",
    folder: "root",
    language: "markdown",
    content: `# Bruno Bueno — Portfólio

Engenheiro de Software & Desenvolvedor Full Stack.

## 🚀 Tecnologias
- **Frontend**: React 19, Next.js 16, TypeScript, TailwindCSS v4
- **Animações**: GSAP, ScrollTrigger, Framer Motion
- **Design**: Dark Mode Sleek, VS Code Interactive Editor Simulation

## 💻 Instalação Local
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
  },
];

interface SimuladorVSCodeProps {
  powerStatus?: PowerStatus;
}

export default function SimuladorVSCode({ powerStatus = "on" }: SimuladorVSCodeProps) {
  // Pure in-memory file state
  const [filesState, setFilesState] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    INITIAL_FILES.forEach((f) => {
      initial[f.id] = f.content;
    });
    return initial;
  });

  const [openTabs, setOpenTabs] = useState<string[]>(["Hero.tsx", "page.tsx", "globals.css"]);
  const [activeFileId, setActiveFileId] = useState<string>("Hero.tsx");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    components: true,
    app: true,
    styles: true,
  });

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [scrollPos, setScrollPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollPos({
      top: e.currentTarget.scrollTop,
      left: e.currentTarget.scrollLeft,
    });
  };

  // Reset file states whenever computer is turned off or on fresh state
  useEffect(() => {
    if (powerStatus === "off") {
      const initial: Record<string, string> = {};
      INITIAL_FILES.forEach((f) => {
        initial[f.id] = f.content;
      });
      setFilesState(initial);
      setOpenTabs(["Hero.tsx", "page.tsx", "globals.css"]);
      setActiveFileId("Hero.tsx");
    }
  }, [powerStatus]);

  const activeFile = INITIAL_FILES.find((f) => f.id === activeFileId) || INITIAL_FILES[0];
  const currentContent = filesState[activeFile.id] ?? activeFile.content;
  const lines = currentContent.split("\n");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFilesState((prev) => ({
      ...prev,
      [activeFile.id]: val,
    }));
    updateCursorInfo(e.target);
  };

  const updateCursorInfo = (el: HTMLTextAreaElement) => {
    const selStart = el.selectionStart;
    const textBefore = el.value.substring(0, selStart);
    const linesBefore = textBefore.split("\n");
    const currentLineNumber = linesBefore.length;
    const currentColumnNumber = linesBefore[linesBefore.length - 1].length + 1;
    setCursorPos({ line: currentLineNumber, col: currentColumnNumber });
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const openFile = (fileId: string) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs((prev) => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const closeTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const filtered = openTabs.filter((id) => id !== fileId);
    if (filtered.length === 0) {
      setOpenTabs([INITIAL_FILES[0].id]);
      setActiveFileId(INITIAL_FILES[0].id);
    } else {
      setOpenTabs(filtered);
      if (activeFileId === fileId) {
        setActiveFileId(filtered[filtered.length - 1]);
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".tsx") || fileName.endsWith(".jsx")) {
      return <Code2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#519aba] shrink-0" />;
    }
    if (fileName.endsWith(".css")) {
      return <FileCode className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#42a5f5] shrink-0" />;
    }
    if (fileName.endsWith(".json")) {
      return <FileJson className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#cbcb41] shrink-0" />;
    }
    return <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#a0a0a0] shrink-0" />;
  };

  const renderSyntaxLine = (line: string, lang: string) => {
    if (!line) return <span>&nbsp;</span>;

    const parts = line.split(/(".*?"|'.*?'|`.*?`|\b(?:import|export|default|function|return|const|let|var|from|async|await|interface|type)\b)/g);

    return (
      <>
        {parts.map((part, i) => {
          if (!part) return null;
          if (/^(import|export|default|function|return|const|let|var|from|async|await|interface|type)$/.test(part)) {
            return (
              <span key={i} className="text-[#c586c0] font-semibold">
                {part}
              </span>
            );
          }
          if (/^(".*?"|'.*?'|`.*?`)$/.test(part)) {
            return (
              <span key={i} className="text-[#ce9178]">
                {part}
              </span>
            );
          }
          if (part.includes("<") || part.includes(">")) {
            return (
              <span key={i} className="text-[#569cd6]">
                {part}
              </span>
            );
          }
          return (
            <span key={i} className="text-[#d4d4d4]">
              {part}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-[#cccccc] font-sans flex flex-col select-none overflow-hidden text-[8px] sm:text-[9.5px] leading-tight">
      {/* 1. TOP MENU BAR */}
      <div className="h-4 sm:h-5 bg-[#323233] border-b border-[#252526] flex items-center px-1.5 justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27c93f] inline-block" />
          </div>
          <div className="hidden xs:flex items-center gap-2 ml-2 text-[8px] sm:text-[9px] text-[#cccccc]/80">
            <span className="hover:text-white cursor-default">File</span>
            <span className="hover:text-white cursor-default">Edit</span>
            <span className="hover:text-white cursor-default">Selection</span>
            <span className="hover:text-white cursor-default">View</span>
            <span className="hover:text-white cursor-default">Go</span>
            <span className="hover:text-white cursor-default">Run</span>
            <span className="hover:text-white cursor-default">Terminal</span>
          </div>
        </div>

        <div className="text-[7.5px] sm:text-[9px] text-[#a0a0a0] font-mono truncate max-w-[150px] sm:max-w-[250px]">
          {activeFile.name} — meu-portifolio
        </div>
      </div>

      {/* MAIN CONTAINER (Activity Bar + Sidebar + Editor) */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2. ACTIVITY BAR (Far Left) */}
        <div className="w-5 sm:w-7 bg-[#333333] border-r border-[#2b2b2b] flex flex-col items-center py-1.5 justify-between shrink-0">
          <div className="flex flex-col items-center gap-2 text-[#858585]">
            <button className="text-white border-l-2 border-[#007acc] pl-0.5">
              <Files className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button className="hover:text-white transition-colors">
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button className="hover:text-white transition-colors">
              <GitBranch className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button className="hover:text-white transition-colors">
              <Blocks className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
          <button className="text-[#858585] hover:text-white transition-colors">
            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* 3. SIDEBAR / EXPLORER */}
        <div className="w-20 sm:w-28 bg-[#252526] border-r border-[#1e1e1e] flex flex-col shrink-0 overflow-y-auto vscode-scrollbar">
          <div className="px-1.5 py-1 text-[7px] sm:text-[8px] font-bold tracking-wider text-[#bbbbbb] uppercase border-b border-[#2d2d2d] flex items-center justify-between">
            <span>Explorer</span>
          </div>

          <div className="p-1 font-mono text-[7.5px] sm:text-[9px] text-[#cccccc] space-y-0.5">
            {/* Folder src */}
            <div>
              <div
                onClick={() => toggleFolder("src")}
                className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded"
              >
                {expandedFolders["src"] ? (
                  <ChevronDown className="w-2.5 h-2.5 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-2.5 h-2.5 text-[#858585]" />
                )}
                {expandedFolders["src"] ? (
                  <FolderOpen className="w-2.5 h-2.5 text-[#dcb67a]" />
                ) : (
                  <Folder className="w-2.5 h-2.5 text-[#dcb67a]" />
                )}
                <span className="font-semibold text-white">src</span>
              </div>

              {expandedFolders["src"] && (
                <div className="pl-2 space-y-0.5">
                  {/* Folder app */}
                  <div>
                    <div
                      onClick={() => toggleFolder("app")}
                      className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded"
                    >
                      {expandedFolders["app"] ? (
                        <ChevronDown className="w-2 h-2 text-[#858585]" />
                      ) : (
                        <ChevronRight className="w-2 h-2 text-[#858585]" />
                      )}
                      <Folder className="w-2.5 h-2.5 text-[#dcb67a]" />
                      <span>app</span>
                    </div>
                    {expandedFolders["app"] && (
                      <div className="pl-3">
                        <div
                          onClick={() => openFile("page.tsx")}
                          className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                            activeFileId === "page.tsx" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                          }`}
                        >
                          {getFileIcon("page.tsx")}
                          <span className="truncate">page.tsx</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Folder components */}
                  <div>
                    <div
                      onClick={() => toggleFolder("components")}
                      className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded"
                    >
                      {expandedFolders["components"] ? (
                        <ChevronDown className="w-2 h-2 text-[#858585]" />
                      ) : (
                        <ChevronRight className="w-2 h-2 text-[#858585]" />
                      )}
                      <Folder className="w-2.5 h-2.5 text-[#dcb67a]" />
                      <span>components</span>
                    </div>
                    {expandedFolders["components"] && (
                      <div className="pl-3 space-y-0.5">
                        <div
                          onClick={() => openFile("Hero.tsx")}
                          className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                            activeFileId === "Hero.tsx" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                          }`}
                        >
                          {getFileIcon("Hero.tsx")}
                          <span className="truncate">Hero.tsx</span>
                        </div>
                        <div
                          onClick={() => openFile("Projects.tsx")}
                          className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                            activeFileId === "Projects.tsx" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                          }`}
                        >
                          {getFileIcon("Projects.tsx")}
                          <span className="truncate">Projects.tsx</span>
                        </div>
                        <div
                          onClick={() => openFile("ContadorEstatisticas.tsx")}
                          className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                            activeFileId === "ContadorEstatisticas.tsx" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                          }`}
                        >
                          {getFileIcon("ContadorEstatisticas.tsx")}
                          <span className="truncate">Contador.tsx</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Folder styles */}
                  <div>
                    <div
                      onClick={() => toggleFolder("styles")}
                      className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded"
                    >
                      {expandedFolders["styles"] ? (
                        <ChevronDown className="w-2 h-2 text-[#858585]" />
                      ) : (
                        <ChevronRight className="w-2 h-2 text-[#858585]" />
                      )}
                      <Folder className="w-2.5 h-2.5 text-[#dcb67a]" />
                      <span>styles</span>
                    </div>
                    {expandedFolders["styles"] && (
                      <div className="pl-3">
                        <div
                          onClick={() => openFile("globals.css")}
                          className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                            activeFileId === "globals.css" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                          }`}
                        >
                          {getFileIcon("globals.css")}
                          <span className="truncate">globals.css</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* package.json */}
            <div
              onClick={() => openFile("package.json")}
              className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                activeFileId === "package.json" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
              }`}
            >
              {getFileIcon("package.json")}
              <span className="truncate">package.json</span>
            </div>

            {/* README.md */}
            <div
              onClick={() => openFile("README.md")}
              className={`flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded ${
                activeFileId === "README.md" ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
              }`}
            >
              {getFileIcon("README.md")}
              <span className="truncate">README.md</span>
            </div>
          </div>
        </div>

        {/* 4. EDITOR MAIN CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* TABS BAR */}
          <div className="h-5 sm:h-6 bg-[#252526] flex items-center overflow-x-auto vscode-scrollbar border-b border-[#1e1e1e]">
            {openTabs.map((tabId) => {
              const file = INITIAL_FILES.find((f) => f.id === tabId);
              if (!file) return null;
              const isActive = activeFileId === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`h-full px-2 text-[8px] sm:text-[9px] flex items-center gap-1.5 border-r border-[#1e1e1e] cursor-pointer transition-colors shrink-0 ${
                    isActive
                      ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
                      : "bg-[#2d2d2d] text-[#969696] hover:bg-[#282828]"
                  }`}
                >
                  {getFileIcon(file.name)}
                  <span>{file.name}</span>
                  <X
                    onClick={(e) => closeTab(e, tabId)}
                    className="w-2.5 h-2.5 rounded hover:bg-white/20 p-0.5 text-[#969696] hover:text-white"
                  />
                </div>
              );
            })}
          </div>

          {/* BREADCRUMBS */}
          <div className="h-3.5 sm:h-4 bg-[#1e1e1e] border-b border-[#252526] px-2 flex items-center text-[7.5px] sm:text-[8.5px] text-[#858585] font-mono gap-1">
            <span>{activeFile.folder}</span>
            <span>&gt;</span>
            <span className="text-[#cccccc]">{activeFile.name}</span>
          </div>

          {/* INTERACTIVE CODE EDITING AREA */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* CODE EDITOR CONTAINER */}
            <div className="flex-1 flex overflow-hidden relative font-mono text-[8px] sm:text-[9.5px] leading-4 sm:leading-5">
              {/* Line numbers column */}
              <div className="w-5 sm:w-7 select-none text-right pr-1.5 text-[#6e7681] bg-[#1e1e1e] border-r border-[#2d2d2d] py-1 shrink-0 overflow-hidden">
                <div style={{ transform: `translateY(-${scrollPos.top}px)` }}>
                  {lines.map((_, idx) => (
                    <div key={idx} className="h-4 sm:h-5">
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code display layer + Real Editable Textarea overlay */}
              <div className="flex-1 relative overflow-hidden p-1">
                {/* Visual Highlighted Code Layer */}
                <div
                  className="absolute inset-0 p-1 pointer-events-none font-mono whitespace-pre overflow-hidden text-[#d4d4d4]"
                  style={{ transform: `translate(-${scrollPos.left}px, -${scrollPos.top}px)` }}
                >
                  {lines.map((line, idx) => (
                    <div key={idx} className="h-4 sm:h-5">
                      {renderSyntaxLine(line, activeFile.language)}
                    </div>
                  ))}
                </div>

                {/* Real Textarea Overlay allowing cursor placement, typing, selection, backspace, copy, paste, undo/redo */}
                <textarea
                  ref={textareaRef}
                  value={currentContent}
                  onChange={handleTextChange}
                  onScroll={handleScroll}
                  onClick={(e) => updateCursorInfo(e.currentTarget)}
                  onKeyUp={(e) => updateCursorInfo(e.currentTarget)}
                  spellCheck={false}
                  className="absolute inset-0 p-1 font-mono text-transparent caret-[#007acc] bg-transparent resize-none outline-none overflow-auto vscode-scrollbar whitespace-pre leading-4 sm:leading-5 selection:bg-[#264f78] selection:text-transparent w-full h-full"
                />
              </div>
            </div>

            {/* VISUAL MINIMAP */}
            <div className="w-5 sm:w-8 bg-[#1e1e1e] border-l border-[#252526] p-0.5 select-none pointer-events-none hidden xs:block shrink-0">
              <div className="space-y-0.5 opacity-40">
                {lines.slice(0, 25).map((line, idx) => (
                  <div
                    key={idx}
                    className="h-0.5 bg-[#4f4f4f] rounded"
                    style={{ width: `${Math.min(100, Math.max(15, line.length * 2))}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 5. VISUAL TERMINAL (STRICTLY NON-INTERACTIVE) */}
          <div className="h-12 sm:h-16 bg-[#1e1e1e] border-t border-[#2d2d2d] flex flex-col shrink-0">
            <div className="h-3.5 sm:h-4 bg-[#252526] px-2 flex items-center gap-3 text-[7.5px] sm:text-[8.5px] font-mono text-[#858585] border-b border-[#1e1e1e]">
              <span className="text-white border-b-2 border-[#007acc] pb-0.5 font-semibold flex items-center gap-1">
                <TerminalIcon className="w-2.5 h-2.5" /> TERMINAL
              </span>
              <span>PROBLEMS (0)</span>
              <span>OUTPUT</span>
              <span>DEBUG CONSOLE</span>
            </div>

            {/* Terminal Output Logs (Non-interactive pointer-events-none) */}
            <div className="flex-1 p-1 font-mono text-[7.5px] sm:text-[8.5px] text-[#cccccc] space-y-0.5 overflow-hidden select-none pointer-events-none bg-[#181818]">
              <div className="flex items-center gap-1 text-[#3794ff]">
                <span>[portfolio-dev]</span>
                <span className="text-white">npm run dev</span>
              </div>
              <div className="text-[#858585]">▲ Next.js 16.3.0 - Local: http://localhost:3000</div>
              <div className="text-[#4ec9b0] flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-[#3794ff]" />
                <span>Ready in 0.8s — Editing active in memory</span>
              </div>
            </div>
          </div>

          {/* 6. STATUS BAR */}
          <div className="h-3.5 sm:h-4 bg-[#007acc] text-white px-2 flex items-center justify-between text-[7px] sm:text-[8px] font-mono select-none shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <GitBranch className="w-2.5 h-2.5" /> main*
              </span>
              <span>0 ⊗ 0 △</span>
            </div>

            <div className="flex items-center gap-2">
              <span>
                Ln {cursorPos.line}, Col {cursorPos.col}
              </span>
              <span className="hidden xs:inline">UTF-8</span>
              <span>
                {activeFile.name.endsWith(".css")
                  ? "CSS"
                  : activeFile.name.endsWith(".json")
                  ? "JSON"
                  : activeFile.name.endsWith(".md")
                  ? "Markdown"
                  : "TypeScript JSX"}
              </span>
              <span className="hidden xs:inline">Prettier ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
