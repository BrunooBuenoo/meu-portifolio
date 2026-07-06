"use client";

interface RodapeProps {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export default function Rodape({
  name = "Bruno Bueno",
  email = "bruno.bueno.dev@gmail.com",
  phone = "+55 (11) 99999-8888",
  location = "São Paulo, SP - Brasil",
  linkedin = "https://linkedin.com/in/brunobueno",
  github = "https://github.com/brunobueno"
}: RodapeProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-border/40 py-16 px-6 sm:px-10 transition-colors">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative size-8 rounded-lg overflow-hidden bg-border/20 flex items-center justify-center border border-border/20">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10C4 6.686 6.686 4 10 4s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6Z"
                    fill="var(--accent)"
                  />
                  <circle cx="10" cy="10" r="2.5" fill="var(--primary)" />
                </svg>
              </div>
              <span className="font-sans font-semibold text-text-primary text-lg tracking-tight uppercase">
                {name.split(" ")[0].toLowerCase()}
                <span className="text-accent font-black">.</span>
              </span>
            </div>
            <p className="font-sans font-normal text-text-secondary text-sm leading-relaxed">
              Soluções inteligentes, interfaces premium e automações robustas sob medida para o seu negócio.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-sans font-semibold text-text-primary text-sm tracking-wide uppercase">
                Navegação
              </span>
              <a href="#" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                Início
              </a>
              <a href="#sobre-mim" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                Sobre Mim
              </a>
              <a href="#servicos" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                Serviços
              </a>
              <a href="#projetos" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                Projetos
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-sans font-semibold text-text-primary text-sm tracking-wide uppercase">
                Redes
              </span>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                LinkedIn
              </a>
              <a href={github} target="_blank" rel="noopener noreferrer" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                GitHub
              </a>
              <a href="#contato" className="font-sans font-normal text-text-secondary text-sm hover:text-text-primary transition-colors">
                Contato Direto
              </a>
            </div>

            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <span className="font-sans font-semibold text-text-primary text-sm tracking-wide uppercase">
                Contato
              </span>
              <span className="font-sans font-normal text-text-secondary text-sm break-all">
                {email}
              </span>
              <span className="font-sans font-normal text-text-secondary text-sm">
                {phone}
              </span>
              <span className="font-sans font-normal text-text-secondary text-sm">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans font-normal text-text-muted text-xs text-center sm:text-left">
            © {currentYear} {name}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <span className="font-sans font-normal text-text-muted text-xs hover:text-text-primary transition-colors cursor-pointer">
              Termos de Uso
            </span>
            <span className="font-sans font-normal text-text-muted text-xs hover:text-text-primary transition-colors cursor-pointer">
              Políticas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
