"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type DevFile = {
  name: string;
  language: string;
  lines: string[];
};

type Phase = {
  fileIndex: number;
  typeMs: number;
  holdMs: number;
};

const FILES: DevFile[] = [
  {
    name: "page.tsx",
    language: "typescriptreact",
    lines: [
      "import { motion } from \"framer-motion\";",
      "",
      "const sectionReveal = {",
      "  hidden: {},",
      "  visible: { transition: { staggerChildren: 0.14 } },",
      "};",
      "",
      "export default function HomeSection() {",
      "  return (",
      "    <motion.div variants={sectionReveal}",
      "      initial=\"hidden\"",
      "      whileInView=\"visible\"",
      "      viewport={{ once: true, amount: 0.2 }}",
      "    >",
      "      <h2>Desenvolvendo solucoes reais</h2>",
      "    </motion.div>",
      "  );",
      "}",
    ],
  },
  {
    name: "ClientPage.tsx",
    language: "typescriptreact",
    lines: [
      "const sectionReveal = {",
      "  hidden: {},",
      "  visible: { transition: { staggerChildren: 0.14 } },",
      "};",
      "",
      "const sectionItem = {",
      "  hidden: { opacity: 0, y: 24 },",
      "  visible: { opacity: 1, y: 0 },",
      "};",
      "",
      "<motion.div variants={sectionReveal}>",
      "  <motion.h2 variants={sectionItem}>Minha Jornada</motion.h2>",
      "  <motion.p variants={sectionItem}>",
      "    Animando um elemento por vez na rolagem",
      "  </motion.p>",
      "</motion.div>",
    ],
  },
  {
    name: "firebase.ts",
    language: "typescript",
    lines: [
      "const firebaseConfig = {",
      "  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,",
      "  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,",
      "  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,",
      "};",
      "",
      "const missing = Object.entries(firebaseConfig)",
      "  .filter(([, v]) => !v)",
      "  .map(([k]) => k);",
      "",
      "export const db = app ? getFirestore(app) : null;",
      "export const auth = app ? getAuth(app) : null;",
    ],
  },
];

const CURSOR_PATHS = [
  [
    { x: 7, y: 24 },
    { x: 10, y: 31 },
    { x: 18, y: 35 },
    { x: 27, y: 40 },
    { x: 42, y: 47 },
    { x: 58, y: 58 },
  ],
  [
    { x: 8, y: 30 },
    { x: 15, y: 37 },
    { x: 24, y: 43 },
    { x: 37, y: 49 },
    { x: 52, y: 56 },
    { x: 63, y: 62 },
  ],
  [
    { x: 7, y: 27 },
    { x: 14, y: 34 },
    { x: 26, y: 42 },
    { x: 40, y: 51 },
    { x: 55, y: 58 },
    { x: 68, y: 65 },
  ],
];

const PHASES: Phase[] = [
  { fileIndex: 0, typeMs: 9000, holdMs: 1000 },
  { fileIndex: 1, typeMs: 9000, holdMs: 1000 },
  { fileIndex: 2, typeMs: 9000, holdMs: 1000 },
];

const TOTAL_MS = PHASES.reduce((acc, phase) => acc + phase.typeMs + phase.holdMs, 0);
const STEP_MS = 80;

function getPhaseByElapsed(elapsedMs: number) {
  let start = 0;
  for (let i = 0; i < PHASES.length; i++) {
    const phase = PHASES[i];
    const duration = phase.typeMs + phase.holdMs;
    const end = start + duration;
    if (elapsedMs <= end) {
      return {
        phase,
        phaseIndex: i,
        phaseElapsed: Math.max(0, elapsedMs - start),
      };
    }
    start = end;
  }

  const lastIndex = PHASES.length - 1;
  return {
    phase: PHASES[lastIndex],
    phaseIndex: lastIndex,
    phaseElapsed: PHASES[lastIndex].typeMs + PHASES[lastIndex].holdMs,
  };
}

interface SimuladorVSCodeProps {
  className?: string;
}

export default function SimuladorVSCode({ className = "" }: SimuladorVSCodeProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finished, setFinished] = useState(false);

  const { phase, phaseIndex, phaseElapsed } = useMemo(() => getPhaseByElapsed(elapsedMs), [elapsedMs]);

  const activeFile = FILES[phase.fileIndex];
  const fullText = useMemo(() => activeFile.lines.join("\n"), [activeFile]);

  const charCount = useMemo(() => {
    if (phaseElapsed >= phase.typeMs) return fullText.length;
    const progress = phaseElapsed / phase.typeMs;
    return Math.floor(fullText.length * progress);
  }, [phaseElapsed, phase.typeMs, fullText]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMs((prev) => {
        if (prev >= TOTAL_MS) {
          setFinished(true);
          return TOTAL_MS;
        }
        return Math.min(prev + STEP_MS, TOTAL_MS);
      });
    }, STEP_MS);

    return () => clearInterval(timer);
  }, []);

  const visibleCode = fullText.slice(0, charCount);
  const visibleLines = visibleCode.split("\n");

  const activeCursorPath = CURSOR_PATHS[phaseIndex] || CURSOR_PATHS[0];
  const cursorProgress = Math.min(1, phaseElapsed / phase.typeMs);
  const cursorPointIndex = Math.min(
    activeCursorPath.length - 1,
    Math.floor(cursorProgress * (activeCursorPath.length - 1))
  );
  const cursorPoint = activeCursorPath[cursorPointIndex];

  const renderLine = (line: string) => {
    if (line.trim().startsWith("import ")) {
      return (
        <>
          <span className="text-[#c586c0]">import</span>
          <span className="text-[#d4d4d4]"> {line.slice("import".length)}</span>
        </>
      );
    }

    if (line.includes("export default function")) {
      return (
        <>
          <span className="text-[#c586c0]">export</span>
          <span className="text-[#c586c0]"> default</span>
          <span className="text-[#569cd6]"> function</span>
          <span className="text-[#dcdcaa]"> {line.split("function")[1] || ""}</span>
        </>
      );
    }

    if (line.trim().startsWith("const ")) {
      const [first, ...rest] = line.split("=");
      return (
        <>
          <span className="text-[#4fc1ff]">{first}</span>
          {rest.length > 0 && <span className="text-[#d4d4d4]">={rest.join("=")}</span>}
        </>
      );
    }

    if (line.trim().startsWith("  ") || line.trim().startsWith("    ")) {
      return <span className="text-[#d4d4d4]">{line}</span>;
    }

    return <span className="text-[#d4d4d4]">{line}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative w-full h-full ${className}`}
    >
      <div className="relative w-full h-full rounded-[8px] border border-[#2f3e66] bg-[#1e1e1ee8] shadow-[0_10px_24px_rgba(0,0,0,0.52)] overflow-hidden">
        <div className="h-6 border-b border-white/10 bg-[#252526] flex items-center px-2 text-[8px] text-[#cccccc] font-sans gap-2">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
        </div>

        <div className="h-7 border-b border-white/10 bg-[#2d2d2d] px-2 flex items-end gap-1.5">
          {FILES.map((file, idx) => (
            <div
              key={file.name}
              className={`h-6 px-2.5 text-[9px] font-sans rounded-t-[4px] flex items-center border border-b-0 transition-colors ${
                idx === phase.fileIndex
                  ? "bg-[#1e1e1e] border-[#3b3b3b] text-[#ffffff]"
                  : "bg-[#2d2d2d] border-transparent text-[#9da3ad]"
              }`}
            >
              {file.name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[28px_112px_1fr] h-[calc(100%-52px)]">
          <aside className="border-r border-white/10 bg-[#333333] flex flex-col items-center pt-2 gap-2">
            <span className="size-1.5 rounded-full bg-[#59a6ff]" />
            <span className="size-1.5 rounded-full bg-[#7c7c7c]" />
            <span className="size-1.5 rounded-full bg-[#7c7c7c]" />
            <span className="size-1.5 rounded-full bg-[#7c7c7c]" />
          </aside>

          <aside className="border-r border-white/10 bg-[#252526] p-1.5">
            <div className="text-[8px] uppercase tracking-widest text-[#9da3ad] mb-1.5">Explorer</div>
            <div className="space-y-1 text-[8px] font-mono">
              <div className="text-[#9da3ad]">src</div>
              <div className="pl-2 text-[#9da3ad]">app</div>
              {FILES.map((file, idx) => (
                <div
                  key={file.name}
                  className={`pl-3 py-0.5 rounded transition-colors ${
                    idx === phase.fileIndex ? "bg-[#094771] text-[#ffffff]" : "text-[#c5c5c5]"
                  }`}
                >
                  {file.name}
                </div>
              ))}
            </div>
          </aside>

          <div className="relative bg-[#1e1e1e]">
            <div className="h-6 border-b border-white/10 px-2 flex items-center justify-between text-[8px] font-mono text-[#9da3ad]">
              <span>{activeFile.name}</span>
              <span>{activeFile.language}</span>
            </div>

            <div className="p-2 font-mono text-[8.5px] leading-4 text-[#d4d4d4]">
              {Array.from({ length: Math.max(visibleLines.length, 10) }).map((_, idx) => {
                const lineNumber = idx + 1;
                const lineText = visibleLines[idx] ?? "";
                return (
                  <div key={lineNumber} className="grid grid-cols-[16px_1fr] gap-2">
                    <span className="text-[#6e7681] text-right select-none">{lineNumber}</span>
                    <span className="whitespace-pre-wrap break-words">{renderLine(lineText)}</span>
                  </div>
                );
              })}
            </div>

            {!finished && cursorPoint && (
              <motion.div
                animate={{
                  left: `${cursorPoint.x}%`,
                  top: `${cursorPoint.y}%`,
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="absolute pointer-events-none z-20"
              >
                <div className="w-0 h-0 border-l-[7px] border-l-white border-y-[5px] border-y-transparent rotate-[-18deg] drop-shadow-[0_0_4px_rgba(255,255,255,0.45)]" />
              </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-5 border-t border-white/10 bg-[#007acc] px-2 flex items-center justify-between text-[8px] font-sans text-white">
              <span>main</span>
              <span>{elapsedMs >= TOTAL_MS ? "final frame" : "typing..."}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
