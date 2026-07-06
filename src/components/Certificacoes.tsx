"use client";

import { Award, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

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
}

export default function Certificacoes({ education = [], certifications = [] }: CertificacoesProps) {
  return (
    <section className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="certificacoes">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-accent text-sm font-semibold uppercase tracking-widest">Credenciais</span>
          <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-4">
            Certificações & Educação
          </h2>
          <p className="font-sans text-text-secondary text-base max-w-[500px] mx-auto">
            Minhas qualificações acadêmicas e especializações técnicas reconhecidas pelo mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Academic Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-accent/15 rounded-xl text-accent">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-xl sm:text-2xl">
                Formação Acadêmica
              </h3>
            </div>
            
            <div className="flex flex-col gap-6">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id || idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-accent/15 rounded-xl text-accent">
                <Award size={24} />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-xl sm:text-2xl">
                Certificados Profissionais
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {certifications.map((cert, idx) => (
                <motion.div
                  key={cert.id || idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-6 sm:p-8 rounded-[24px] hover:border-border transition-colors duration-300"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="font-sans font-bold text-text-primary text-base sm:text-lg leading-snug">{cert.title}</h4>
                    <span className="font-sans text-text-muted text-sm shrink-0 font-medium">{cert.date}</span>
                  </div>
                  <p className="font-sans text-text-secondary text-sm mb-1">{cert.issuer}</p>
                  <span className="font-sans text-text-muted text-xs font-mono">ID Credencial: {cert.credentialId}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
