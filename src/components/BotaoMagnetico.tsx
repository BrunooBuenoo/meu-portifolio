"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { gsap } from "@/lib/gsapConfig";

interface BotaoMagneticoProps {
  children: ReactNode;
  className?: string;
  /** Força da atração (0–1). Padrão: 0.35 */
  strength?: number;
}

/**
 * Wrapper que faz o elemento filho "atrair" suavemente em direção
 * ao cursor quando o mouse está dentro da área do componente.
 * Ao sair, volta à posição original com efeito elástico.
 */
export default function BotaoMagnetico({
  children,
  className = "",
  strength = 0.35,
}: BotaoMagneticoProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: offsetX * strength,
        y: offsetY * strength,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
