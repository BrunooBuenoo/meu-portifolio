"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { gsap } from "@/lib/gsapConfig";

interface CardTilt3DProps {
  children: ReactNode;
  className?: string;
  /** Ângulo máximo de tilt em graus. Padrão: 8 */
  maxTilt?: number;
  /** Escala no hover. Padrão: 1.02 */
  hoverScale?: number;
}

/**
 * Wrapper que aplica efeito de perspectiva 3D nos filhos conforme
 * a posição do cursor. O card inclina suavemente seguindo o mouse
 * e volta ao estado neutro ao sair.
 */
export default function CardTilt3D({
  children,
  className = "",
  maxTilt = 8,
  hoverScale = 1.02,
}: CardTilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // -0.5 a 0.5 normalizado
      const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: normalizedX * maxTilt,
        rotateX: -normalizedY * maxTilt,
        scale: hoverScale,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });
    },
    [maxTilt, hoverScale]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
