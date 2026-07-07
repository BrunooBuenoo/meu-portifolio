"use client";

import { FileText } from "lucide-react";

const Linkedin = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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

const Github = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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

interface LinksProfissionaisProps {
  linkedinUrl?: string;
  githubUrl?: string;
  cvUrl?: string;
}

export default function LinksProfissionais({
  linkedinUrl = "https://linkedin.com/in/brunobueno",
  githubUrl = "https://github.com/brunobueno",
  cvUrl = "#"
}: LinksProfissionaisProps) {
  const links = [
    {
      label: "LinkedIn",
      href: linkedinUrl,
      icon: <Linkedin size={20} className="stroke-[1.5]" />,
      colorClass: "hover:bg-blue-600 hover:text-white"
    },
    {
      label: "GitHub",
      href: githubUrl,
      icon: <Github size={20} className="stroke-[1.5]" />,
      colorClass: "hover:bg-zinc-800 dark:hover:bg-zinc-100 dark:hover:text-primary hover:text-white"
    },
    {
      label: "Download Currículo",
      href: cvUrl,
      icon: <FileText size={20} className="stroke-[1.5]" />,
      colorClass: "hover:bg-accent hover:text-primary"
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8 max-w-xl mx-auto">
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.href}
          target={link.href !== "#" ? "_blank" : undefined}
          rel={link.href !== "#" ? "noopener noreferrer" : undefined}
          className={`flex items-center gap-3 bg-secondary/30 backdrop-blur-sm border border-border/20 px-6 py-3.5 rounded-full font-sans text-sm font-semibold text-text-primary transition-all duration-250 cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 ${link.colorClass}`}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
