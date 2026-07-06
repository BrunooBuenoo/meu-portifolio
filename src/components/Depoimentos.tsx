"use client";

import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

interface DepoimentosProps {
  testimonials?: Testimonial[];
}

export default function Depoimentos({ testimonials = [] }: DepoimentosProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 }
    }
  } as const;

  return (
    <section className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="depoimentos">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <span className="font-sans text-accent text-sm font-semibold uppercase tracking-widest">Recomendações</span>
          <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mt-2 mb-4">
            Depoimentos
          </h2>
          <p className="font-sans text-text-secondary text-base max-w-[500px] mx-auto">
            O que parceiros e clientes dizem sobre o desenvolvimento e os resultados das minhas soluções.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-8 rounded-[32px] flex flex-col justify-between hover:border-border transition-colors duration-300"
            >
              {/* Quote mark icon */}
              <div className="mb-6 text-accent">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-40">
                  <path
                    d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8Zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Quote Text */}
              <p className="font-sans text-text-secondary text-base leading-relaxed italic mb-8 flex-1">
                "{t.quote}"
              </p>

              {/* Client Info */}
              <div className="border-t border-border/20 pt-5 flex items-center gap-3">
                <div className="size-10 rounded-full bg-border/20 flex items-center justify-center font-sans font-bold text-sm text-text-primary">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-text-primary text-sm">{t.name}</h4>
                  <p className="font-sans text-text-muted text-xs">
                    {t.role} · <span className="text-accent/80">{t.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
