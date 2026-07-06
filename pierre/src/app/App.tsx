import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import imgContainer from "@/imports/Frame2/c0d33392085ec0924a8f65fac791293aa03016ec.png";
import imgOverlay from "@/imports/Frame2/ce4fe52e57fc2af2d6fbde71be54747085bdc57c.png";
import imgOverlay1 from "@/imports/Frame2/9b9d7deab5d5ff4b8a6d3df6fb2bb1bc018df592.png";
import imgOverlay2 from "@/imports/Frame2/152bc8d4c051283ce726e3654c1781b1d30d093b.png";
import imgOverlay3 from "@/imports/Frame2/82548410086ea2bffa3b7716c2de90d2f73415b2.png";
import imgOverlay4 from "@/imports/Frame2/b63f74de094b8d64bd02932413e4079f220a40a9.png";
import imgContainer1 from "@/imports/Frame2/1c7ef7e4256bbcdbd816df9edc4e94bc7a1d7862.png";
import imgContainer2 from "@/imports/Frame2/c6f44c7b532ae0d64ded7f9d194c97d29dc807ed.png";
import imgContainer3 from "@/imports/Frame2/70c3d39ea0cc7e1c49c3a112f4a535cbc3bd9f4d.png";
import imgContainer4 from "@/imports/Frame2/3eec2b987e80df511978bb522e86015c8bb304b4.png";
import newsLogo01 from "@/imports/Frame2/7f9746f360cb1439fb37cb99f8e94d1c82a2c4e4.png";
import newsLogo02 from "@/imports/Frame2/d10c669e096719d53e26ef897427876217b928fc.png";
import newsLogo03 from "@/imports/Frame2/8b5098ce982e45288121be2c2eac137329284bc7.png";
import newsLogo04 from "@/imports/Frame2/c66c767273d0fc79fe17eb078f39bd10113b9c33.png";
import newsLogo05 from "@/imports/Frame2/ab3a4d2c60f69f6e647ba766dcb916e9bebf7bfb.png";
import newsLogo06 from "@/imports/Frame2/1ae5a5b9cc17395e0fa9fc3e6af4d0ceb595eb51.png";
import newsLogo07 from "@/imports/Frame2/fe8a19f512c9dec6bf51ea4082d70083e0f0b4ff.png";
import appStoreBtn from "@/imports/Frame2/d7f895bb096f0f013864ae61599706a696575b3a.png";
import googlePlayBtn from "@/imports/Frame2/e7891860fbe62954cec2e41d27c00e72087fd702.png";

// ─────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────

function PrimaryButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`bg-white text-[#09090b] font-['Geist',sans-serif] font-medium text-base px-6 py-[13px] rounded-full cursor-pointer hover:bg-white/90 transition-colors shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`border border-white/20 text-white font-['Geist',sans-serif] font-medium text-base px-6 py-[13px] rounded-full cursor-pointer hover:bg-white/5 transition-colors shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

function LimeButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      className={`bg-[#94ff47] text-[#09090b] font-['Geist',sans-serif] font-medium text-base px-6 py-[13px] rounded-full cursor-pointer hover:bg-[#a8ff6b] transition-colors shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl shrink-0 size-16">
      <div className="absolute inset-0 border border-[#94ff47] rounded-2xl pointer-events-none" />
      <div className="flex items-center justify-center size-full p-[13px] text-white">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272a] backdrop-blur-md bg-[#09090b]/80">
      <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative size-8 rounded-lg overflow-hidden bg-[#27272a] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z" fill="#94ff47" />
              <circle cx="10" cy="10" r="2" fill="#09090b" />
            </svg>
          </div>
          <span className="font-['Geist',sans-serif] font-medium text-white text-lg tracking-tight">
            pierre
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Recursos", "Preços", "Segurança"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-['Geist',sans-serif] font-normal text-sm text-white/70 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <OutlineButton className="text-sm py-2 px-5">Entrar</OutlineButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#27272a] bg-[#09090b] px-6 py-4 flex flex-col gap-4">
          {["Recursos", "Preços", "Segurança"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-['Geist',sans-serif] font-normal text-base text-white/70 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <PrimaryButton className="w-full text-center justify-center">
            Entrar
          </PrimaryButton>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function UserBubble({
  src,
  name,
  color,
  borderColor,
}: {
  src: string;
  name: string;
  color: string;
  borderColor: string;
}) {
  return (
    <div className="flex items-start gap-1">
      <div
        className="relative rounded-full shrink-0 size-14"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <img
          src={src}
          alt={name}
          className="rounded-full size-full object-cover"
        />
      </div>
      <div
        className="backdrop-blur-sm px-3 py-1.5 rounded-bl-[18px] rounded-br-[18px] rounded-tl-[10px] rounded-tr-[18px] font-['Geist',sans-serif] text-white text-base mt-10"
        style={{
          background: `${color}73`,
          border: `1px solid ${borderColor}`,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function TransactionCard({
  icon,
  title,
  category,
  date,
  amount,
  opacity = 1,
}: {
  icon: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  opacity?: number;
}) {
  return (
    <div
      className="backdrop-blur-sm bg-[rgba(9,9,11,0.5)] flex items-center gap-3 p-5 rounded-3xl w-[360px]"
      style={{
        border: "1px solid #27272a",
        opacity,
      }}
    >
      <div className="relative rounded-full shrink-0 size-[42px] border border-[#27272a] overflow-hidden">
        <img src={icon} alt={title} className="size-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-['Geist',sans-serif] font-medium text-white text-lg leading-tight">
          {title}
        </div>
        <div className="font-['Geist',sans-serif] text-white/70 text-base leading-tight mt-0.5">
          {category} • {date}
        </div>
      </div>
      <div className="font-['Geist',sans-serif] text-white text-base shrink-0">
        {amount}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#09090b] flex flex-col items-center justify-start pt-32 pb-0 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(148,255,71,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mx-auto">
        <h1 className="font-['Geist',sans-serif] font-medium text-white text-5xl md:text-[48px] leading-[1] tracking-[-0.03em] mb-5">
          Uma IA que cuida da
          <br />
          sua grana enquanto
          <br />
          você cuida da sua vida
        </h1>
        <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg leading-relaxed mb-8 max-w-[520px]">
          Eu leio seus extratos, encontro padrões e te conto o que está
          acontecendo com seu dinheiro, antes de você precisar perguntar.
        </p>
        <PrimaryButton>Começar agora</PrimaryButton>
      </div>

      {/* Phone mockup area */}
      <div className="relative z-10 mt-16 w-full flex justify-center px-4">
        <div className="relative w-full max-w-[400px]">
          {/* Phone image */}
          <img
            src={imgContainer}
            alt="Pierre app"
            className="w-full h-auto rounded-3xl"
          />

          {/* Floating user bubbles */}
          <div className="absolute top-[12%] left-[-28%] hidden lg:flex">
            <UserBubble
              src={imgOverlay}
              name="Marie"
              color="rgba(220,247,4"
              borderColor="#dcf704"
            />
          </div>
          <div className="absolute top-[30%] right-[-58%] hidden lg:flex">
            <UserBubble
              src={imgOverlay1}
              name="Eistein"
              color="rgba(148,37,174"
              borderColor="#9425ae"
            />
          </div>
          <div className="absolute bottom-[12%] left-[-22%] hidden lg:flex">
            <UserBubble
              src={imgOverlay2}
              name="Galileu"
              color="rgba(148,37,174"
              borderColor="#9425ae"
            />
          </div>
        </div>
      </div>

      {/* Transaction cards floating to the left */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto mt-[-160px] hidden lg:flex flex-col gap-0 items-start px-10">
        <div className="flex flex-col gap-4">
          <div className="opacity-40 mb-1 flex items-center gap-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 011 1v1H3V5zm0 3h14v7a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm4 2a1 1 0 100 2h6a1 1 0 100-2H7z"
                fill="white"
              />
            </svg>
            <span className="font-['Geist',sans-serif] text-white text-lg">
              Últimas transações
            </span>
          </div>
          <TransactionCard
            icon={imgOverlay3}
            title="Delivery de comida"
            category="Alimentação"
            date="28 de Jun"
            amount="R$ 42,00"
          />
          <TransactionCard
            icon={imgOverlay4}
            title="Hospedagem"
            category="Viagens"
            date="24 de Jun"
            amount="R$ 120,00"
            opacity={0.7}
          />
        </div>
      </div>

      {/* Insights card floating to the right */}
      <div className="hidden lg:block absolute right-[8%] bottom-[10%] z-20">
        <div className="backdrop-blur-sm bg-[rgba(9,9,11,0.5)] p-5 rounded-3xl border border-[#27272a] w-[340px]">
          <img
            src={imgContainer1}
            alt="Insights financeiros"
            className="w-full rounded-xl"
          />
          <div className="flex items-center gap-4 mt-3 opacity-40">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 14l5-5 4 4 7-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-['Geist',sans-serif] text-white text-lg">
              Insights financeiros
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Stats Section
// ─────────────────────────────────────────────

function StatsSection() {
  const stats = [
    { value: "100+", label: "bancos conectados" },
    { value: "Seguro", label: "criptografia bancária" },
    { value: "Open Finance", label: "regulado pelo Bacen" },
  ];

  return (
    <section className="border-y border-[#27272a] bg-[#09090b]">
      <div className="max-w-[1440px] mx-auto px-10 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-28">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-['Geist',sans-serif] font-bold text-white text-[32px] leading-tight">
                {stat.value}
              </span>
              <span className="font-['Geist',sans-serif] font-normal text-white/70 text-sm uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Features Section (4-card grid)
// ─────────────────────────────────────────────

const features = [
  {
    title: "Conversa natural com IA",
    description:
      '"Quanto gastei com delivery esse mês?" "Tô gastando demais?" Pergunte do seu jeito, eu entendo e respondo na hora.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path
          d="M19 3C10.163 3 3 10.163 3 19c0 3.126.9 6.04 2.456 8.5L3 35l7.5-2.456A15.948 15.948 0 0019 35c8.837 0 16-7.163 16-16S27.837 3 19 3z"
          fill="white"
          fillOpacity="0.9"
        />
        <circle cx="13" cy="19" r="2" fill="#09090b" />
        <circle cx="19" cy="19" r="2" fill="#09090b" />
        <circle cx="25" cy="19" r="2" fill="#09090b" />
      </svg>
    ),
  },
  {
    title: "Todos os bancos num lugar só",
    description:
      "Mais de 100 bancos diferentes. Conecte todos via Open Finance e veja tudo organizado.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <rect x="3" y="14" width="32" height="21" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 21h32M11 14V10a8 8 0 0116 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 21v7M19 21v7M24 21v7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="19" cy="27" r="2" fill="white" />
      </svg>
    ),
  },
  {
    title: "Sabe o que vem pela frente",
    description:
      "Parcelas, assinaturas, cobranças duplicadas. Te mostro tudo que vai sair da sua conta e aviso se algo sair do padrão.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="13" stroke="white" strokeWidth="2" />
        <path d="M19 11v8l5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8l4 4M30 8l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Crie objetivos financeiros",
    description:
      "Quer juntar pra uma viagem? Quitar uma dívida? Crie objetivos e eu acompanho seu progresso automaticamente.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path d="M19 5v4M19 29v4M5 19h4M29 19h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="19" cy="19" r="10" stroke="white" strokeWidth="2" />
        <circle cx="19" cy="19" r="5" stroke="white" strokeWidth="2" />
        <circle cx="19" cy="19" r="2" fill="white" />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="bg-[#09090b] py-24 px-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Geist',sans-serif] font-medium text-white text-[48px] leading-[1] tracking-[-0.03em] mb-5">
            O que o Pierre faz por você
          </h2>
          <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg">
            Conecte seus bancos e deixe o Pierre trabalhar por você
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/10 p-8 flex flex-col gap-8"
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <div>
                <h3 className="font-['Geist',sans-serif] font-medium text-white text-2xl leading-tight mb-3">
                  {feature.title}
                </h3>
                <p className="font-['Geist',sans-serif] font-normal text-white/70 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <PrimaryButton>Começar grátis</PrimaryButton>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Split Feature Section (image + content)
// ─────────────────────────────────────────────

function SplitFeature({
  imageLeft,
  img,
  imgAlt,
  heading,
  description,
}: {
  imageLeft: boolean;
  img: string;
  imgAlt: string;
  heading: React.ReactNode;
  description: string;
}) {
  const image = (
    <div className="flex-1 rounded-2xl overflow-hidden min-h-[360px] lg:min-h-[500px]">
      <img src={img} alt={imgAlt} className="w-full h-full object-cover" />
    </div>
  );

  const content = (
    <div className="flex-1 flex flex-col justify-center gap-5 py-8 lg:py-0">
      <h2 className="font-['Geist',sans-serif] font-medium text-white text-[42px] md:text-[48px] leading-[1] tracking-[-0.03em]">
        {heading}
      </h2>
      <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg leading-relaxed max-w-[440px]">
        {description}
      </p>
      <div>
        <PrimaryButton>Começar grátis</PrimaryButton>
      </div>
    </div>
  );

  return (
    <section className="bg-[#09090b] py-20 px-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div
          className={`flex flex-col ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
        >
          {image}
          {content}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Security Section
// ─────────────────────────────────────────────

const securityFeatures = [
  {
    title: "Só leitura, zero transações",
    description:
      "O Pierre não pode fazer transferências, pagamentos ou qualquer movimentação. Ele só lê pra te ajudar.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path d="M19 3L6 9v10c0 8 5.5 14.5 13 17 7.5-2.5 13-9 13-17V9L19 3z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 18l5 5 9-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Criptografia bancária",
    description:
      "Todos os dados são criptografados com padrão bancário. Suas credenciais nunca ficam armazenadas no Pierre.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <rect x="8" y="16" width="22" height="16" rx="2" stroke="white" strokeWidth="1.5" />
        <path d="M13 16v-4a6 6 0 0112 0v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="19" cy="24" r="2.5" fill="white" />
        <path d="M19 26.5V30" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Regulado pelo Banco Central",
    description:
      "Pierre opera sob o framework do Open Finance, regulado e supervisionado pelo Banco Central do Brasil.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path d="M5 14l14-8 14 8v2H5v-2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 16v14M15 16v14M23 16v14M30 16v14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 30h28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Open Finance certificado",
    description:
      "Conexão segura e padronizada com todos os bancos via Open Finance. Sem senhas armazenadas, sem risco.",
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="13" stroke="white" strokeWidth="1.5" />
        <path d="M13 19a6 6 0 0012 0M7 19h4M27 19h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 6v4M19 28v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SecuritySection() {
  return (
    <section className="bg-[#09090b] py-24 px-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Geist',sans-serif] font-medium text-white text-[48px] leading-[1] tracking-[-0.03em] mb-5">
            O Pierre nunca mexe
            <br />
            no seu dinheiro
          </h2>
          <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg max-w-[400px] mx-auto">
            Ele só lê. Tipo extrato, só que inteligente. Segurança
            de nível bancário, regulado pelo Banco Central.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/10 flex items-start gap-6 px-8 py-10"
            >
              <div className="relative rounded-2xl shrink-0 size-16 border border-[#94ff47] flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-['Geist',sans-serif] font-medium text-white text-2xl leading-tight mb-3">
                  {feature.title}
                </h3>
                <p className="font-['Geist',sans-serif] font-normal text-white/70 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Pricing Section
// ─────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

const plans = [
  {
    name: "Básico",
    description: "Pra você começar a organizar suas finanças agora",
    price: { monthly: "Grátis", annual: "Grátis" },
    cta: "Começar grátis",
    ctaStyle: "outline" as const,
    features: [
      "Conecte 1 banco",
      "1 agente inteligente",
      "Últimas transações",
      "Resumo mensal",
      "Suporte por e-mail",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    description: "Pra quem quer controle total das finanças",
    price: { monthly: "R$ 29", annual: "R$ 24" },
    cta: "Assinar Pro",
    ctaStyle: "lime" as const,
    features: [
      "Até 5 bancos conectados",
      "3 agentes inteligentes",
      "Insights financeiros",
      "Objetivos financeiros",
      "Alertas inteligentes",
      "Suporte prioritário",
    ],
    highlight: true,
    badge: "Mais popular",
  },
  {
    name: "Premium",
    description: "Pra quem quer o máximo em gestão financeira",
    price: { monthly: "R$ 199", annual: "R$ 165" },
    cta: "Assinar Premium",
    ctaStyle: "outline" as const,
    features: [
      "Até 10 agentes inteligentes",
      "Bancos ilimitados",
      "Relatórios avançados",
      "API de integração",
      "Gerente financeiro IA",
      "Suporte dedicado 24/7",
    ],
    highlight: false,
  },
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5">
      <path
        d="M3.5 9L7 12.5L14.5 5"
        stroke="#E4E4E7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section className="bg-[#09090b] py-24 px-4" id="precos">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col items-center gap-10 mb-12">
          <div className="text-center">
            <h2 className="font-['Geist',sans-serif] font-medium text-white text-[48px] leading-[1] tracking-[-0.03em] mb-4">
              Escolha seu plano
            </h2>
            <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg">
              Comece grátis. Evolua quando quiser. Economize 17% no plano anual.
            </p>
          </div>

          {/* Toggle */}
          <div className="bg-[#27272a] flex items-center gap-0.5 p-1 rounded-full">
            <button
              onClick={() => setBilling("monthly")}
              className={`font-['Geist',sans-serif] font-medium text-base px-6 py-2.5 rounded-full transition-all ${
                billing === "monthly"
                  ? "bg-[#94ff47] text-[#09090b]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`font-['Geist',sans-serif] font-medium text-base px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                billing === "annual"
                  ? "bg-[#94ff47] text-[#09090b]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Anual
              <span
                className={`text-sm font-normal ${billing === "annual" ? "text-[#09090b]" : "text-[#94ff47]"}`}
              >
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border flex flex-col justify-between p-8 ${
                plan.highlight
                  ? "border-[#94ff47]/40 bg-[#94ff47]/[0.03]"
                  : "border-white/10"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#94ff47] text-[#09090b] font-['Geist',sans-serif] font-medium text-xs px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-['Geist',sans-serif] font-medium text-white text-xl mb-2">
                  {plan.name}
                </h3>
                <p className="font-['Geist',sans-serif] font-normal text-white/60 text-base mb-6 leading-snug">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="font-['Geist',sans-serif] font-bold text-white text-[32px] leading-tight">
                    {plan.price[billing]}
                  </div>
                  {plan.price[billing] !== "Grátis" && (
                    <div className="font-['Geist',sans-serif] text-white/40 text-sm mt-1">
                      por mês, cobrado {billing === "annual" ? "anualmente" : "mensalmente"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="font-['Geist',sans-serif] font-normal text-white/70 text-base leading-snug">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {plan.ctaStyle === "lime" ? (
                <LimeButton className="w-full text-center justify-center">
                  {plan.cta}
                </LimeButton>
              ) : (
                <OutlineButton className="w-full text-center justify-center">
                  {plan.cta}
                </OutlineButton>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FAQ Section
// ─────────────────────────────────────────────

const faqs = [
  {
    question: "O Pierre pode fazer transferências ou pagamentos?",
    answer:
      "Não. O Pierre tem acesso somente de leitura às suas contas via Open Finance. Ele não pode executar nenhuma transação, transferência ou pagamento. Sua grana está 100% protegida.",
  },
  {
    question: "Quais bancos são suportados?",
    answer:
      "O Pierre suporta mais de 100 instituições financeiras participantes do Open Finance no Brasil, incluindo os principais bancos e fintechs como Itaú, Bradesco, Nubank, Inter, C6 Bank, BTG, XP e muitos outros.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim. Você pode cancelar sua assinatura quando quiser, sem multas ou taxas. No plano anual, você continua tendo acesso até o fim do período pago.",
  },
  {
    question: "Funciona com todos os bancos?",
    answer:
      "O Pierre funciona com todos os bancos participantes do Open Finance regulamentado pelo Banco Central. A lista cresce continuamente conforme novas instituições aderem ao programa.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Utilizamos criptografia de ponta a ponta com padrão bancário. Nunca armazenamos sua senha de banco – a conexão é feita via Open Finance, o mesmo padrão usado por todos os bancos regulamentados pelo Bacen.",
  },
  {
    question: "Como o Pierre aprende sobre meus gastos?",
    answer:
      "O Pierre analisa automaticamente suas transações usando IA, identifica categorias, padrões e anomalias. Quanto mais você usa, mais preciso ele fica – sem você precisar classificar nada manualmente.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#09090b] py-24 px-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-['Geist',sans-serif] font-medium text-white text-[48px] leading-[1] tracking-[-0.03em] mb-4">
            Dúvidas? A gente responde
          </h2>
          <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg">
            As perguntas mais comuns sobre o Pierre
          </p>
        </div>

        <div className="max-w-[900px] mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-[36px] border border-white/10 px-6 py-0 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between py-8 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-['Geist',sans-serif] font-medium text-white text-lg leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`transition-transform duration-200 shrink-0 ${open === i ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={18} className="text-white" />
                </div>
              </button>
              {open === i && (
                <div className="pb-8 -mt-4">
                  <p className="font-['Geist',sans-serif] font-normal text-white/70 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Press Section
// ─────────────────────────────────────────────

const pressItems = [
  {
    logo: newsLogo01,
    quote: (
      <>
        <span className="text-[#95ff48]">"</span>
        <span className="text-white">Pierre usa IA</span>
        <br />
        <span className="text-white">para simplificar</span>
        <br />
        <span className="text-white">gestão financeira</span>
        <span className="text-[#95ff48]">"</span>
      </>
    ),
  },
  {
    logo: newsLogo02,
    quote: (
      <>
        <span className="text-[#95ff48]">"</span>
        <span className="text-white">Pierre transforma gestão financeira em uma conversa – sem planilhas, nem gráficos confusos</span>
        <span className="text-[#95ff48]">"</span>
      </>
    ),
  },
  {
    logo: newsLogo03,
    quote: (
      <>
        <span className="text-[#95ff48]">"</span>
        <span className="text-white">A nova geração de assistentes financeiros chegou ao Brasil</span>
        <span className="text-[#95ff48]">"</span>
      </>
    ),
  },
];

function PressSection() {
  return (
    <section className="bg-[#09090b] py-24 px-4 border-y border-[#27272a]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="font-['Geist',sans-serif] font-normal text-white/40 text-sm uppercase tracking-widest mb-6">
            Na imprensa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50">
            {[newsLogo01, newsLogo02, newsLogo03, newsLogo04, newsLogo05, newsLogo06, newsLogo07].map(
              (logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt={`News logo ${i + 1}`}
                  className="h-6 object-contain max-w-[120px]"
                />
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pressItems.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/10 p-10 flex flex-col justify-between gap-8"
            >
              <div>
                <img
                  src={item.logo}
                  alt="Publication"
                  className="h-6 object-contain max-w-[120px] mb-8"
                />
                <p className="font-['Geist',sans-serif] font-bold text-[28px] leading-tight">
                  {item.quote}
                </p>
              </div>
              <OutlineButton className="text-sm py-2.5 px-5">
                Ver matéria completa
              </OutlineButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Final CTA Section
// ─────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-[#09090b] py-32 px-4">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="font-['Geist',sans-serif] font-medium text-white text-[48px] leading-[1] tracking-[-0.03em] mb-5">
          Pronto pra organizar
          <br />
          suas finanças?
        </h2>
        <p className="font-['Geist',sans-serif] font-normal text-white/70 text-lg mb-10">
          Comece agora. É rápido, seguro e o plano básico é grátis.
        </p>
        <PrimaryButton className="mb-5">Começar grátis</PrimaryButton>
        <p className="font-['Geist',sans-serif] font-normal text-white/40 text-sm">
          Segurança bancária · Open Finance · Cadastro em 30 segundos
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#09090b] border-t border-[#27272a] py-16 px-4">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="relative size-8 rounded-lg overflow-hidden bg-[#27272a] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z"
                    fill="#94ff47"
                  />
                  <circle cx="10" cy="10" r="2" fill="#09090b" />
                </svg>
              </div>
              <span className="font-['Geist',sans-serif] font-medium text-white text-lg tracking-tight">
                pierre
              </span>
            </div>
            <p className="font-['Geist',sans-serif] font-normal text-white/50 text-sm leading-relaxed">
              Uma IA que cuida da sua grana enquanto você cuida da sua vida.
            </p>
            <div className="flex gap-3 mt-2">
              <img
                src={appStoreBtn}
                alt="App Store"
                className="h-9 object-contain"
              />
              <img
                src={googlePlayBtn}
                alt="Google Play"
                className="h-9 object-contain"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Produto",
                links: ["Recursos", "Preços", "Segurança", "Open Finance"],
              },
              {
                title: "Empresa",
                links: ["Sobre nós", "Blog", "Imprensa", "Carreiras"],
              },
              {
                title: "Suporte",
                links: ["Central de ajuda", "Contato", "Status", "API"],
              },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="font-['Geist',sans-serif] font-medium text-white text-sm">
                  {col.title}
                </span>
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-['Geist',sans-serif] font-normal text-white/50 text-sm hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#27272a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['Geist',sans-serif] font-normal text-white/30 text-sm">
            © 2025 Pierre Tecnologia Financeira Ltda. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {["Termos de uso", "Privacidade", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-['Geist',sans-serif] font-normal text-white/30 text-sm hover:text-white/60 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-[#09090b] min-h-screen font-['Geist',sans-serif]">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <SplitFeature
          imageLeft={true}
          img={imgContainer2}
          imgAlt="Controle de gastos"
          heading={
            <>
              Surpresas na fatura?
              <br />
              Não comigo.
            </>
          }
          description="Eu categorizo cada gasto, identifico cobranças estranhas e organizo tudo pra você nunca ser pego de surpresa no fim do mês."
        />
        <SplitFeature
          imageLeft={false}
          img={imgContainer3}
          imgAlt="Fluxo financeiro"
          heading={
            <>
              Veja pra onde seu
              <br />
              dinheiro tá indo
            </>
          }
          description="Analiso seus gastos automaticamente, encontro padrões e mostro onde dá pra economizar. Sem você precisar abrir planilha nenhuma."
        />
        <SplitFeature
          imageLeft={true}
          img={imgContainer4}
          imgAlt="Investimentos"
          heading={
            <>
              Seus investimentos,
              <br />
              do jeito que deviam ser
            </>
          }
          description="Visão clara de tudo que você tem investido, em todos os bancos. Pra entender seu patrimônio hoje e tomar decisões melhores amanhã."
        />
        <SecuritySection />
        <PricingSection />
        <FAQSection />
        <PressSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
