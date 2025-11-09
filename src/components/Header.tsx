import React from "react";
import logo from "../assets/logo-dooki2.png"; // ou ../assets/logo-dooki.svg
// Obs: se seu arquivo for .svg e quiser usar como URL, mantenha essa importação.
// Caso você use Vite, isso funciona direto; se TypeScript reclamar de import .svg, veja nota abaixo.

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo clicável para a home */}
        <a href="/" aria-label="Ir para a página inicial" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo dooki"
            className="h-10 w-auto select-none"
            draggable={false}
          />
          {/* Mantemos texto só para SEO / acessibilidade, escondido visualmente */}
          <span className="sr-only">Dooki</span>
        </a>

        {/* Exemplo de área à direita do header (menu / botões) */}
        <nav aria-label="Navegação principal" className="hidden sm:flex gap-4 items-center">
          <a href="/about" className="text-sm font-medium hover:underline">Sobre</a>
          <a href="/contact" className="text-sm font-medium hover:underline">Contato</a>
        </nav>

        {/* Botão de menu para mobile (apenas visual, você pode integrar um toggle) */}
        <div className="sm:hidden">
          <button aria-label="Abrir menu" className="p-2 rounded-md focus:outline-none">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
