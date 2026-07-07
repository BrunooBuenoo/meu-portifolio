"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { Award, GraduationCap } from "lucide-react";

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

interface CertificacoesProps {
  education?: EducationItem[];
  certifications?: CertificationItem[];
  isEditable?: boolean;
  getEditableText?: (key: string, fallback: string) => string;
  onUpdateText?: (key: string, value: string) => void;
}

export default function Certificacoes({
  education = [],
  certifications = [],
  isEditable = false,
  getEditableText,
  onUpdateText
}: CertificacoesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const eduCards = gsap.utils.toArray<HTMLElement>("[data-edu-card]", sectionRef.current);
      const certCards = gsap.utils.toArray<HTMLElement>("[data-cert-card]", sectionRef.current);

      // Educação: desliza da esquerda
      if (eduCards.length > 0) {
        gsap.set(eduCards, { opacity: 0, x: -30 });
        eduCards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(card, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: idx * 0.08,
                ease: "power3.out",
              });
            },
          });
        });
      }

      // Certificações: desliza da direita
      if (certCards.length > 0) {
        gsap.set(certCards, { opacity: 0, x: 30 });
        certCards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(card, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: idx * 0.08,
                ease: "power3.out",
              });
            },
          });
        });
      }
    },
    { scope: sectionRef, dependencies: [education.length, certifications.length] }
  );

  const readText = (key: string, fallback: string) => {
    return getEditableText ? getEditableText(key, fallback) : fallback;
  };

  const saveText = (key: string, value: string) => {
    if (!onUpdateText) return;
    onUpdateText(key, value);
  };

  return (
    <section ref={sectionRef} className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="certificacoes">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => saveText("certsLabel", e.currentTarget.textContent || "")}
            className={`font-sans text-accent text-sm font-semibold uppercase tracking-widest ${
              isEditable ? "outline-dashed outline-1 outline-accent/40 px-1 py-0.5 rounded focus:outline-accent" : ""
            }`}
          >
            {readText("certsLabel", "Credenciais")}
          </span>
          <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-4">
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => saveText("certsTitle", e.currentTarget.textContent || "")}
              className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
            >
              {readText("certsTitle", "Certificações & Educação")}
            </span>
          </h2>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => saveText("certsDescription", e.currentTarget.textContent || "")}
            className={`font-sans text-text-secondary text-base max-w-[500px] mx-auto ${
              isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded focus:outline-accent" : ""
            }`}
          >
            {readText(
              "certsDescription",
              "Minhas qualificações acadêmicas e especializações técnicas reconhecidas pelo mercado."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Coluna Acadêmica */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-accent/15 rounded-xl text-accent">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-xl sm:text-2xl">
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => saveText("educationColumnTitle", e.currentTarget.textContent || "")}
                  className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                >
                  {readText("educationColumnTitle", "Formação Acadêmica")}
                </span>
              </h3>
            </div>
            
            <div className="flex flex-col gap-6">
              {education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  data-edu-card
                  className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-6 sm:p-8 rounded-[24px]"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h4 className="font-sans font-bold text-text-primary text-lg">{edu.title}</h4>
                      <p className="font-sans text-accent text-sm font-semibold">{edu.institution}</p>
                    </div>
                    <span className="font-sans text-text-muted text-sm shrink-0 font-medium">{edu.date}</span>
                  </div>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna de Certificações */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-accent/15 rounded-xl text-accent">
                <Award size={24} />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-xl sm:text-2xl">
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => saveText("certificationsColumnTitle", e.currentTarget.textContent || "")}
                  className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
                >
                  {readText("certificationsColumnTitle", "Certificados Profissionais")}
                </span>
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  data-cert-card
                  className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-6 sm:p-8 rounded-[24px] hover:border-border transition-colors duration-300"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="font-sans font-bold text-text-primary text-base sm:text-lg leading-snug">{cert.title}</h4>
                    <span className="font-sans text-text-muted text-sm shrink-0 font-medium">{cert.date}</span>
                  </div>
                  <p className="font-sans text-text-secondary text-sm mb-1">{cert.issuer}</p>
                  <span className="font-sans text-text-muted text-xs font-mono">
                    {readText("credentialIdLabel", "ID Credencial")}: {cert.credentialId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
