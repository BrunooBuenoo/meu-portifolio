"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapConfig";

interface StatItem {
  icon?: string;
  number: number;
  suffix?: string;
  label: string;
}

interface ContadorEstatisticasProps {
  stats?: StatItem[];
}

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        // Usa GSAP para animação a 60fps ao invés de setInterval discreto
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: value,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            setCount(Math.round(proxy.val));
          },
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}</span>;
}

export default function ContadorEstatisticas({ stats = [] }: ContadorEstatisticasProps) {
  if (stats.length === 0) return null;

  return (
    <section className="bg-primary py-16 border-y border-border/40 transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 md:gap-36">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <div className="flex items-center justify-center gap-2">
                {stat.icon && <span className="text-3xl">{stat.icon}</span>}
                <span className="font-sans font-bold text-text-primary text-[42px] sm:text-[48px] leading-none tracking-tight">
                  <AnimatedNumber value={stat.number} />
                  {stat.suffix}
                </span>
              </div>
              <span className="font-sans font-medium text-text-muted text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
