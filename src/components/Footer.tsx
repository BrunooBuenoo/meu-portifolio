import React from 'react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary border-t border-border-custom/50 py-16 transition-colors duration-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Logo e Descrição */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-tight text-txt-primary">Bruno Bueno</h3>
            <p className="text-xs text-txt-secondary leading-relaxed">
              Desenvolvedor Full Stack de Software. Dedicado a construir experiências digitais limpas, fluidas e focadas no usuário.
            </p>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">Navegação</h4>
            <div className="flex flex-col space-y-2.5">
              <Link href="/" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Início
              </Link>
              <Link href="/#projetos" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Projetos
              </Link>
              <Link href="/#tecnologias" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Tecnologias
              </Link>
              <Link href="/#sobre" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Sobre
              </Link>
              <Link href="/#contato" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Contato
              </Link>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-txt-primary">Social</h4>
            <div className="flex flex-col space-y-2.5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                LinkedIn
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-txt-secondary hover:text-txt-primary transition-colors w-fit">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Linha Final */}
        <div className="pt-8 border-t border-border-custom/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-txt-muted">
            &copy; {currentYear} Bruno Bueno. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-txt-muted hover:text-txt-primary transition-colors">
              Privacidade
            </a>
            <a href="#" className="text-xs text-txt-muted hover:text-txt-primary transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
