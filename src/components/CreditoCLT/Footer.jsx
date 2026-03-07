import { companyInfo } from '../../utils/credito-clt/constants'
import logoFM from '../../assets/logo_fm_consultoria.webp'
import '../Footer.css'

/**
 * Footer da Landing Page CLT
 * Versão simplificada do footer principal
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo" aria-label="Rodapé do site">
      <div className="footer-container">
        <div className="footer-content">
          {/* Coluna 1 - Logo e descrição */}
          <div className="footer-col footer-col-main">
            <div className="footer-logo">
              <span className="footer-logo-text">
                Fênix <span className="footer-logo-highlight">Cred</span>
              </span>
            </div>
            <p className="footer-description">
              {companyInfo.description}
            </p>
          </div>

          {/* Coluna 2 - Links rápidos */}
          <div className="footer-col">
            <h3 className="footer-title">Links Rápidos</h3>
            <nav aria-label="Links do rodapé">
              <ul className="footer-links">
                <li>
                  <a href="/#inicio" className="footer-link">Início</a>
                </li>
                <li>
                  <a href="/#servicos" className="footer-link">Serviços</a>
                </li>
                <li>
                  <a href="/#sobre" className="footer-link">Sobre Nós</a>
                </li>
                <li>
                  <a href="/#faq" className="footer-link">FAQ</a>
                </li>
                <li>
                  <a href="/#politica-privacidade" className="footer-link">Política de Privacidade</a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="footer-col">
            <h3 className="footer-title">Contato</h3>
            <ul className="footer-contact">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{companyInfo.address}</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href={`tel:${companyInfo.phone.replace(/\D/g, '')}`} className="footer-link">
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a href={`mailto:${companyInfo.email}`} className="footer-link">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CNPJ e Razão Social — obrigatório para anúncios de serviços financeiros */}
        <div className="footer-cnpj">
          <p>
            <strong>H.I INTERMEDIACAO FINANCEIRA LTDA - ME</strong>
          </p>
          <p>CNPJ: 52.069.594/0001-90</p>
          <p>Av. do Oratório, 4098 - Jardim Guairaca - CEP 03220-200 - São Paulo - SP</p>
        </div>

        {/* Separador */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            {/* Copyright */}
            <p className="footer-copyright">
              © {currentYear} {companyInfo.name}. Todos os direitos reservados.
            </p>

            {/* Selo de segurança */}
            <div className="footer-security">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span>Site seguro com criptografia SSL</span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="footer-disclaimer">
            A Fênix Cred atua como correspondente bancário, intermediando operações de crédito
            consignado entre instituições financeiras parceiras e clientes. Todas as operações
            são realizadas em conformidade com as normas do Banco Central do Brasil.
            Taxas a partir de 1,49% a.m. CET a partir de 29,90% a.a. Condições sujeitas a análise de crédito.
          </p>
        </div>

        {/* Crédito de desenvolvimento */}
        <div className="footer-credit">
          <span className="footer-credit-text">Desenvolvido por</span>
          <a
            href="https://martinsfelipe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link"
            aria-label="Site da FM Consultoria"
          >
            <img
              src={logoFM}
              alt="FM Consultoria"
              className="footer-credit-logo"
              width="32"
              height="32"
              loading="lazy"
            />
            <span>FM Consultoria</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
