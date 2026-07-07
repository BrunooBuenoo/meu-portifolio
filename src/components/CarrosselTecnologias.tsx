"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Technology {
  name: string;
  icon?: string;
  category?: string;
}

interface CarrosselTecnologiasProps {
  technologies?: Technology[];
  isEditable?: boolean;
  getEditableText?: (key: string, fallback: string) => string;
  onUpdateText?: (key: string, value: string) => void;
}

export default function CarrosselTecnologias({
  technologies = [],
  isEditable = false,
  getEditableText,
  onUpdateText
}: CarrosselTecnologiasProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [viewportWidth, setViewportWidth] = useState(1920);
  const sectionRef = useRef<HTMLElement | null>(null);
  const topRowRef = useRef<HTMLDivElement | null>(null);
  const bottomRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth || 1920);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  // Extrair categorias exclusivas
  const categories = useMemo(() => {
    const list = new Set<string>();
    list.add("Todos");
    technologies.forEach((tech) => {
      if (tech.category) list.add(tech.category);
    });
    return Array.from(list);
  }, [technologies]);

  // Filtrar itens
  const filteredTechs = useMemo(() => {
    if (activeCategory === "Todos") return technologies;
    return technologies.filter((tech) => tech.category === activeCategory);
  }, [technologies, activeCategory]);

  const [topBaseTechs, bottomBaseTechs] = useMemo(() => {
    const top = filteredTechs.filter((_, idx) => idx % 2 === 0);
    const bottom = filteredTechs.filter((_, idx) => idx % 2 !== 0);

    if (top.length === 0) return [filteredTechs, filteredTechs] as const;
    if (bottom.length === 0) return [top, top] as const;

    return [top, bottom] as const;
  }, [filteredTechs]);

  const duplicateForRibbon = (list: Technology[]) => {
    if (list.length === 0) return [];

    // Guarantees long tracks so scroll-linked horizontal motion never reveals empty space.
    const estimatedChipWidth = 180;
    const baseSetEstimatedWidth = list.length * estimatedChipWidth;
    const targetTrackWidth = viewportWidth * 3.2;
    const repeatCount = Math.max(6, Math.ceil(targetTrackWidth / baseSetEstimatedWidth));

    let result: Technology[] = [];
    for (let i = 0; i < repeatCount; i++) {
      result = [...result, ...list];
    }
    return result;
  };

  const duplicatedTopTechs = useMemo(
    () => duplicateForRibbon(topBaseTechs),
    [topBaseTechs, viewportWidth]
  );
  const duplicatedBottomTechs = useMemo(
    () => duplicateForRibbon(bottomBaseTechs),
    [bottomBaseTechs, viewportWidth]
  );

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const topRowEl = topRowRef.current;
      const bottomRowEl = bottomRowRef.current;

      if (!sectionEl || !topRowEl || !bottomRowEl) return;

      const viewportTrackWidth = sectionEl.clientWidth;
      const topMaxShift = Math.max(0, topRowEl.scrollWidth - viewportTrackWidth);
      const bottomMaxShift = Math.max(0, bottomRowEl.scrollWidth - viewportTrackWidth);
      const movementFactor = 0.2;
      const topTravel = topMaxShift * movementFactor;
      const bottomTravel = bottomMaxShift * movementFactor;

      gsap.set(topRowEl, { x: 0 });
      gsap.set(bottomRowEl, { x: -bottomTravel });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(topRowEl, { x: -topTravel, ease: "none" }, 0)
        .to(bottomRowEl, { x: 0, ease: "none" }, 0);

      return () => {
        tl.kill();
      };
    },
    {
      scope: sectionRef,
      dependencies: [activeCategory, duplicatedTopTechs.length, duplicatedBottomTechs.length],
    }
  );

  // Helper para renderizar ícones
  const renderTechIcon = (tech: Technology) => {
    // Se for URL ou Base64
    if (tech.icon && (tech.icon.startsWith("http") || tech.icon.startsWith("data:"))) {
      return (
        <img
          src={tech.icon}
          alt={tech.name}
          className="size-8 object-contain select-none"
        />
      );
    }

    // Fallback SVG com estilos elegantes baseados no nome da tecnologia
    return (
      <div className="size-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase select-none">
        {tech.name.substring(0, 2)}
      </div>
    );
  };

  if (technologies.length === 0) return null;

  const readText = (key: string, fallback: string) => {
    return getEditableText ? getEditableText(key, fallback) : fallback;
  };

  const saveText = (key: string, value: string) => {
    if (!onUpdateText) return;
    onUpdateText(key, value);
  };

  return (
    <section ref={sectionRef} className="bg-primary py-20 overflow-hidden transition-colors" id="tecnologias">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 text-center mb-10">
        <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mb-4">
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => saveText("techSectionTitle", e.currentTarget.textContent || "")}
            className={isEditable ? "outline-dashed outline-1 outline-accent/40 px-2 py-1 rounded focus:outline-accent" : ""}
          >
            {readText("techSectionTitle", "Tecnologias & Skills")}
          </span>
        </h2>
        <p
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) => saveText("techSectionDescription", e.currentTarget.textContent || "")}
          className={`font-sans text-text-secondary text-base max-w-[500px] mx-auto mb-8 ${
            isEditable ? "outline-dashed outline-1 outline-accent/40 p-2 rounded focus:outline-accent" : ""
          }`}
        >
          {readText(
            "techSectionDescription",
            "Tecnologias que utilizo no meu dia a dia para criar e automatizar soluções digitais de alto impacto."
          )}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-sans text-sm font-semibold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-accent border-accent text-primary"
                  : "bg-transparent border-border/40 text-text-secondary hover:text-text-primary hover:border-border"
              }`}
            >
              {cat === "Todos" ? (
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => saveText("techFilterAllLabel", e.currentTarget.textContent || "")}
                  className={isEditable ? "outline-dashed outline-1 outline-primary/30 px-1 py-0.5 rounded focus:outline-primary" : ""}
                >
                  {readText("techFilterAllLabel", "Todos")}
                </span>
              ) : (
                cat
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll-Synced Rows */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Left/Right Glass Fades */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-5">
          <div ref={topRowRef} className="flex w-max gap-5 px-5 will-change-transform">
            {duplicatedTopTechs.map((tech, idx) => (
              <div
                key={`top-${tech.name}-${idx}`}
                className="flex items-center gap-3 bg-secondary/30 backdrop-blur-sm border border-border/20 px-6 py-3.5 rounded-full select-none"
              >
                {renderTechIcon(tech)}
                <span className="font-sans font-medium text-text-primary text-base whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>

          <div ref={bottomRowRef} className="flex w-max gap-5 px-5 will-change-transform">
            {duplicatedBottomTechs.map((tech, idx) => (
              <div
                key={`bottom-${tech.name}-${idx}`}
                className="flex items-center gap-3 bg-secondary/30 backdrop-blur-sm border border-border/20 px-6 py-3.5 rounded-full select-none"
              >
                {renderTechIcon(tech)}
                <span className="font-sans font-medium text-text-primary text-base whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
