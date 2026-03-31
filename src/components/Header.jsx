import { useState } from 'react'
import './Header.css'
import Logo from './Logo'
import { useActiveSection } from '../hooks/useActiveSection'
import { trackEvent } from '../utils/metaPixel'
import { tagMessage } from '../utils/utmParams'

/**
 * Componente Header - Cabeçalho fixo no topo
 * 
 * Estrutura:
 * - Logo Fênix Cred (branco) à esquerda
 * - Menu horizontal: Home, Sobre Nós, Serviços, Depoimentos, Parceiros, FAQ, Trabalhe Conosco
 * - Botão CTA "Fale Conosco" em verde neon com ícone WhatsApp (fixo à direita)
 * - Menu mobile com hambúrguer
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    trackEvent('Contact', { content_name: 'Header WhatsApp', content_category: 'whatsapp' })
    const msg = encodeURIComponent(tagMessage('(nav) Olá, gostaria de simular o crédito para o CLT.'))
    window.open(`https://api.whatsapp.com/send?phone=5511917082143&text=${msg}`, '_blank')
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Fênix Cred */}
        <a href="#inicio" className="logo-link">
          <Logo size="medium" />
        </a>

        {/* Menu de navegação desktop */}
        <nav className="nav-desktop" aria-label="Navegação principal">
          <a 
            href="#inicio" 
            aria-label="Ir para seção inicial"
            className={activeSection === 'inicio' ? 'active' : ''}
          >
            Home
          </a>
          <a 
            href="#sobre" 
            aria-label="Ir para seção sobre nós"
            className={activeSection === 'sobre' ? 'active' : ''}
          >
            Sobre Nós
          </a>
          <a 
            href="#servicos" 
            aria-label="Ir para seção de serviços"
            className={activeSection === 'servicos' ? 'active' : ''}
          >
            Serviços
          </a>
          <a 
            href="#depoimentos" 
            aria-label="Ir para seção de depoimentos"
            className={activeSection === 'depoimentos' ? 'active' : ''}
          >
            Depoimentos
          </a>
          <a 
            href="#parceiros" 
            aria-label="Ir para seção de parceiros"
            className={activeSection === 'parceiros' ? 'active' : ''}
          >
            Parceiros
          </a>
          <a 
            href="#faq" 
            aria-label="Ir para seção de perguntas frequentes"
            className={activeSection === 'faq' ? 'active' : ''}
          >
            FAQ
          </a>
          <a 
            href="#trabalhe-conosco" 
            aria-label="Ir para seção trabalhe conosco"
            className={activeSection === 'trabalhe-conosco' ? 'active' : ''}
          >
            Trabalhe Conosco
          </a>
        </nav>

        {/* Botão WhatsApp verde neon */}
        <button 
          className="btn-whatsapp-header" 
          onClick={openWhatsApp}
          aria-label="Fale conosco no WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Fale Conosco
        </button>

        {/* Botão hambúrguer para menu mobile */}
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu mobile */}
        <nav 
          id="nav-mobile"
          className={`nav-mobile ${menuOpen ? 'active' : ''}`}
          aria-label="Navegação mobile"
        >
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre Nós</a>
          <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a href="#depoimentos" onClick={() => setMenuOpen(false)}>Depoimentos</a>
          <a href="#parceiros" onClick={() => setMenuOpen(false)}>Parceiros</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#trabalhe-conosco" onClick={() => setMenuOpen(false)}>Trabalhe Conosco</a>
          <button 
            className="btn-whatsapp-mobile" 
            onClick={() => { openWhatsApp(); setMenuOpen(false); }}
            aria-label="Fale conosco no WhatsApp"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Fale Conosco
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
