"use client";

import { useState, useMemo } from "react";

interface Technology {
  name: string;
  icon?: string;
  category?: string;
}

interface CarrosselTecnologiasProps {
  technologies?: Technology[];
}

export default function CarrosselTecnologias({ technologies = [] }: CarrosselTecnologiasProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");

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

  // Duplicar a lista para dar o efeito de scroll infinito sem emendas
  const duplicatedTechs = useMemo(() => {
    if (filteredTechs.length === 0) return [];
    // Duplicamos o suficiente para preencher a tela (mínimo de 3 repetições se a lista for curta)
    const repeatCount = Math.max(3, Math.ceil(15 / filteredTechs.length));
    let result: Technology[] = [];
    for (let i = 0; i < repeatCount; i++) {
      result = [...result, ...filteredTechs];
    }
    return result;
  }, [filteredTechs]);

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

  return (
    <section className="bg-primary py-20 overflow-hidden transition-colors" id="tecnologias">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 text-center mb-10">
        <h2 className="font-sans font-medium text-text-primary text-[36px] sm:text-[42px] leading-tight tracking-tight mb-4">
          Tecnologias & Skills
        </h2>
        <p className="font-sans text-text-secondary text-base max-w-[500px] mx-auto mb-8">
          Tecnologias que utilizo no meu dia a dia para criar e automatizar soluções digitais de alto impacto.
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
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Left/Right Glass Fades */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

        {/* Sliding Ribbon */}
        <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused] gap-5 px-5">
          {duplicatedTechs.map((tech, idx) => (
            <div
              key={`${tech.name}-${idx}`}
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
    </section>
  );
}
