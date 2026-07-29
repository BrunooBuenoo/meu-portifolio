"use client";

import React from "react";
import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Configuração padrão de margem do viewport para acionamento
 */
const VIEWPORT_CONFIG = {
  once: false,
  margin: "-100px 0px -100px 0px",
};

/**
 * Ícone SVG Animado de Smartphone / Celular
 */
export function IconeCelularAnimado({ className = "size-10 text-accent", size }: IconProps) {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.5, rotate: -10 }}
      whileInView={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ type: "spring", stiffness: 85, damping: 14 }}
      whileHover={{ scale: 1.15, rotate: 3 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={customStyle}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible block leading-none"
      >
        {/* Corpo do Celular */}
        <rect
          x="11"
          y="4"
          width="18"
          height="32"
          rx="5"
          stroke="currentColor"
          strokeWidth="2.2"
          className="fill-secondary/70"
        />

        {/* Notch / Alto-falante Superior */}
        <rect x="16" y="7" width="8" height="2" rx="1" fill="currentColor" opacity="0.8" />

        {/* Linhas animadas simulando dados/interface */}
        <motion.line
          x1="15"
          y1="14"
          x2="25"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1="15"
          y1="19"
          x2="21"
          y2="19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
        />

        {/* Botão Home / Indicador Inferior */}
        <rect x="16" y="31" width="8" height="1.5" rx="0.75" fill="currentColor" opacity="0.7" />

        {/* Ondas de Sinal / Chamada à Esquerda */}
        <motion.path
          d="M6 16C4.5 18 4.5 22 6 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ondas de Sinal / Chamada à Direita */}
        <motion.path
          d="M34 16C35.5 18 35.5 22 34 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Ponto de Notificação Pulsante */}
        <motion.circle
          cx="24"
          cy="10"
          r="1.5"
          fill="currentColor"
          animate={{ scale: [1, 1.7, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * Ícone SVG Animado de Foguete / Nave Espacial (Projetos Concluídos)
 * Utiliza a ilustração SVG oficial fornecida em 2026703.svg.
 * 
 * Posicionado ao lado esquerdo do número (ex: 🚀 20+ PROJETOS CONCLUÍDOS):
 * - Animação de entrada e pouso no viewport quando visível na tela.
 * - Animação de elevação (decolagem suave) ao passar o cursor por cima.
 */
export function IconeFogueteAnimado({ className = "size-10 text-accent", size }: IconProps) {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.5 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ type: "spring", stiffness: 85, damping: 14 }}
      whileHover={{ y: -8, scale: 1.15 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={customStyle}
    >
      <svg
        viewBox="0 0 640 1280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible block leading-none"
      >
        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M3119 12723 c-356 -296 -779 -782 -1096 -1258 -269 -404 -520 -896 -688 -1345 -217 -579 -350 -1169 -411 -1820 -21 -230 -30 -826 -15 -1075 66 -1129 358 -2291 871 -3465 39 -91 74 -173 77 -183 5 -16 63 -17 1004 -19 550 -2 1149 -3 1331 -3 l333 0 72 160 c93 206 295 712 371 930 504 1441 667 2806 487 4075 -183 1280 -713 2462 -1539 3425 -236 276 -632 655 -683 655 -13 0 -59 -31 -114 -77z m296 -285 c671 -680 1180 -1421 1387 -2021 24 -69 40 -128 38 -131 -3 -3 -514 -1 -1135 4 -622 5 -1350 10 -1619 10 l-488 0 7 27 c12 50 165 386 249 548 212 409 459 783 737 1116 179 214 598 619 641 619 7 0 89 -78 183 -172z m22 -3143 c457 -88 853 -455 987 -916 98 -341 28 -713 -198 -1044 -183 -268 -462 -453 -781 -516 -101 -20 -330 -18 -434 4 -274 59 -490 176 -692 377 -193 192 -301 390 -350 640 -18 95 -16 308 4 413 88 445 429 843 852 996 163 59 436 80 612 46z m-980 -4985 l533 0 0 -325 0 -325 -534 0 -533 0 -125 323 c-69 177 -123 326 -120 331 3 5 57 6 125 2 66 -3 360 -6 654 -6z m2283 -6 c0 -3 -59 -150 -132 -325 l-132 -319 -533 0 -533 0 0 325 0 325 665 0 c366 0 665 -3 665 -6z" />
          <path d="M3410 12208 c245 -517 353 -887 353 -1213 1 -216 -41 -359 -133 -458 l-41 -45 513 -4 c282 -2 515 -2 517 -1 9 6 -221 453 -315 613 -263 450 -544 828 -831 1120 l-133 135 70 -147z" />
          <path d="M3089 8556 c-205 -57 -372 -259 -386 -466 -11 -148 37 -273 146 -380 261 -257 654 -198 816 122 44 89 59 163 53 270 -5 75 -11 97 -46 170 -66 136 -187 239 -331 282 -64 19 -186 20 -252 2z" />
          <path d="M860 5894 c-110 -23 -218 -84 -318 -179 -140 -133 -237 -296 -312 -523 -198 -604 -179 -1524 56 -2727 42 -212 113 -537 119 -544 3 -2 5 56 5 130 0 420 49 1139 106 1544 103 739 253 1139 469 1257 48 26 151 31 203 9 18 -7 34 -12 36 -10 5 5 -284 1042 -292 1050 -4 4 -36 0 -72 -7z" />
          <path d="M5475 5877 c-6 -18 -282 -988 -290 -1019 l-7 -27 49 15 c374 117 618 -537 713 -1911 18 -258 30 -591 30 -824 0 -123 2 -222 4 -220 7 7 89 368 130 569 270 1340 269 2323 -4 2907 -134 286 -351 477 -588 517 -21 4 -34 1 -37 -7z" />
          <path d="M1960 3376 c0 -100 93 -639 150 -872 78 -318 159 -504 310 -714 335 -467 466 -714 600 -1127 50 -153 142 -509 156 -598 3 -26 10 -43 14 -38 4 4 15 48 24 98 10 50 37 167 61 260 132 516 279 831 583 1253 242 335 302 437 376 636 100 266 181 671 202 1004 l7 112 -499 0 c-274 0 -833 3 -1241 7 l-743 6 0 -27z" />
        </g>
      </svg>
    </motion.div>
  );
}

/**
 * Ícone SVG Animado de Xícara de Café
 */
export function IconeCafeAnimado({ className = "size-10 text-accent", size }: IconProps) {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.5 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ type: "spring", stiffness: 80, damping: 14 }}
      whileHover={{ scale: 1.15 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={customStyle}
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible block leading-none">
        {/* Corpo da Xícara */}
        <path
          d="M9 15H27V24C27 27.866 23.866 31 20 31H16C12.134 31 9 27.866 9 24V15Z"
          stroke="currentColor"
          strokeWidth="2.2"
          className="fill-secondary/70"
        />

        {/* Asa / Alça Lateral da Xícara */}
        <path
          d="M27 17H31C32.6569 17 34 18.3431 34 20V21C34 22.6569 32.6569 24 31 24H27"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Pires Inferior */}
        <path d="M6 34H30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

        {/* Linha de Vapor 1 */}
        <motion.path
          d="M12 11C12 11 13.5 9 12 7C10.5 5 12 3 12 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{ y: [-1, -5, -1], opacity: [0.2, 0.95, 0.2] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Linha de Vapor 2 (Central) */}
        <motion.path
          d="M18 11C18 11 19.5 9 18 7C16.5 5 18 2.5 18 2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ y: [-1, -6, -1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.3, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Linha de Vapor 3 */}
        <motion.path
          d="M24 11C24 11 25.5 9 24 7C22.5 5 24 3 24 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{ y: [-1, -5, -1], opacity: [0.2, 0.95, 0.2] }}
          transition={{ duration: 1.9, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

/**
 * Ícone SVG Animado de Troféu (Prêmios)
 */
export function IconeTrofeuAnimado({ className = "size-10 text-accent", size }: IconProps) {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.5 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ type: "spring", stiffness: 80, damping: 13 }}
      whileHover={{ scale: 1.15, rotate: 3 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={customStyle}
    >
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible block leading-none">
        {/* Taça do Troféu */}
        <path
          d="M11 6H29V16C29 20.9706 24.9706 25 20 25C15.0294 25 11 20.9706 11 16V6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          className="fill-secondary/70"
        />

        {/* Alça Esquerda */}
        <path
          d="M11 9H6C4.89543 9 4 9.89543 4 11V13.5C4 16.0 6.0 18 8.5 18H11"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Alça Direita */}
        <path
          d="M29 9H34C35.1046 9 36 9.89543 36 11V13.5C36 16.0 34.0 18 31.5 18H29"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Haste Central */}
        <path d="M20 25V30" stroke="currentColor" strokeWidth="2.2" />

        {/* Base do Troféu */}
        <rect x="12" y="30" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.35" />

        {/* Estrela Sparkle Superior Direita */}
        <motion.g
          animate={{ scale: [0.5, 1.3, 0.5], rotate: [0, 90, 180], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "27px", originY: "7px" }}
        >
          <path d="M27 3L27.9 5.5L30.5 6.4L27.9 7.3L27 9.8L26.1 7.3L23.5 6.4L26.1 5.5L27 3Z" fill="currentColor" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

/**
 * Função Auxiliar para Renderizar Ícone Animado baseado no texto (Emoji ou Nome)
 */
export function renderIconeAnimado(iconKey?: string, className = "size-10 text-accent") {
  if (!iconKey) return <IconeCelularAnimado className={className} />;

  const key = iconKey.trim().toLowerCase();

  // Celular / Telefone / Smartphone
  if (key.includes("📱") || key.includes("phone") || key.includes("celular") || key.includes("tel") || key.includes("mobile")) {
    return <IconeCelularAnimado className={className} />;
  }

  // Foguete / Projetos / Nave Espacial
  if (key.includes("🚀") || key.includes("foguete") || key.includes("rocket") || key.includes("nave") || key.includes("projeto")) {
    return <IconeFogueteAnimado className={className} />;
  }

  // Café / Xícara
  if (key.includes("☕") || key.includes("cafe") || key.includes("café") || key.includes("coffee") || key.includes("xicara")) {
    return <IconeCafeAnimado className={className} />;
  }

  // Troféu / Prêmios
  if (key.includes("🏆") || key.includes("trofeu") || key.includes("troféu") || key.includes("trophy") || key.includes("premio") || key.includes("prêmio") || key.includes("award")) {
    return <IconeTrofeuAnimado className={className} />;
  }

  return <IconeCelularAnimado className={className} />;
}
