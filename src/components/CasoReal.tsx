"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { Check } from "lucide-react";

interface CasoRealProps {
  data?: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    company: string;
    highlights: string[];
    buttonText: string;
  };
}

export default function CasoReal({ data }: CasoRealProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !data) return;

      const leftCol = sectionRef.current.querySelector<HTMLElement>("[data-case-left]");
      const rightCol = sectionRef.current.querySelector<HTMLElement>("[data-case-right]");

      if (!leftCol || !rightCol) return;

      gsap.set(leftCol, { opacity: 0, x: -50 });
      gsap.set(rightCol, { opacity: 0, x: 50 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(leftCol, {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: "power3.out",
          });
          gsap.to(rightCol, {
            opacity: 1,
            x: 0,
            duration: 0.65,
            delay: 0.15,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [data?.title] }
  );

  if (!data) return null;

  const highlights = data.highlights || [];

  return (
    <section ref={sectionRef} className="bg-primary py-24 px-6 sm:px-10 border-t border-border/40 transition-colors" id="caso-real">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Coluna Esquerda: Imagem com overlay glass */}
          <div
            data-case-left
            className="flex-1 w-full relative group"
          >
            <div className="absolute inset-0 bg-accent/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative rounded-[32px] border border-border/20 overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-secondary">
              <img
                src={data.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"}
                alt={data.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-primary/40 border border-border/20 p-5 rounded-[20px]">
                <p className="font-sans text-accent text-xs font-semibold uppercase tracking-wider mb-1">Case de Sucesso</p>
                <h4 className="font-sans font-bold text-text-primary text-base">{data.company}</h4>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Conteúdo */}
          <div
            data-case-right
            className="flex-1 flex flex-col justify-center gap-6 items-start"
          >
            <span className="font-sans text-accent text-sm font-semibold uppercase tracking-widest">{data.subtitle}</span>
            <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight">
              {data.title}
            </h2>
            <p className="font-sans text-text-secondary text-base sm:text-lg leading-relaxed">
              {data.description}
            </p>

            <ul className="flex flex-col gap-3.5 my-2">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="bg-accent/15 p-1 rounded-full text-accent mt-0.5 shrink-0">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span className="font-sans text-text-secondary text-base leading-snug">{h}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contato"
              className="bg-text-primary text-primary font-sans font-semibold text-base px-8 py-3 rounded-full hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer mt-2"
            >
              {data.buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
