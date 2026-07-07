"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

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
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !testimonials || testimonials.length === 0) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-testimonial-card]", sectionRef.current);
      if (cards.length === 0) return;

      gsap.set(cards, { opacity: 0, scale: 0.95, y: 20 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [testimonials.length] }
  );

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="depoimentos">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testimonial-card
              className="bg-secondary/30 backdrop-blur-sm border border-border/20 p-8 rounded-[32px] flex flex-col justify-between hover:border-border transition-colors duration-300"
            >
              {/* Ícone de aspas */}
              <div className="mb-6 text-accent">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-40">
                  <path
                    d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8Zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Texto do Depoimento */}
              <p className="font-sans text-text-secondary text-base leading-relaxed italic mb-8 flex-1">
                &quot;{t.quote}&quot;
              </p>

              {/* Info do Cliente */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
