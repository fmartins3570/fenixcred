import "./Footer.css";
import Logo from "./Logo";
import { trackEvent, trackCustomEvent, generateEventId } from '../utils/metaPixel';
import { sendServerEvent } from '../utils/metaCAPI';
import { tagMessage } from '../utils/utmParams';
import logoFM from '../assets/logo_fm_consultoria.webp';

/**
 * Componente Footer - Rodapé do site
 *
 * Inclui links, informações de contato e redes sociais
 */
function Footer() {
  const openWhatsApp = () => {
    const eventId = generateEventId()
    trackEvent('Contact', { content_name: 'Footer WhatsApp Float', content_category: 'whatsapp' }, eventId)
    sendServerEvent('Contact', eventId, { page: 'Footer Float' })
    const msg = encodeURIComponent(tagMessage('(footer) Olá, gostaria de simular o crédito para o CLT.'))
    window.open(
      `https://api.whatsapp.com/send?phone=5511917082143&text=${msg}`,
      "_blank"
    );
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Coluna 1: Sobre */}
          <div className="footer-column">
            <a href="#inicio" className="footer-logo-link">
              <Logo size="small" />
            </a>
            <p>
              Soluções financeiras confiáveis para transformar seus sonhos em
              realidade. Atuando no mercado desde 2008 com excelência e
              transparência.
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/fenixcred.oficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Fênix Cred"
                className="social-icon"
                onClick={() => trackCustomEvent('SocialClick', { platform: 'facebook' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/fenixcred.oficial/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Fênix Cred"
                className="social-icon"
                onClick={() => trackCustomEvent('SocialClick', { platform: 'instagram' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.5-2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@fenixcred01"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok da Fênix Cred"
                className="social-icon"
                onClick={() => trackCustomEvent('SocialClick', { platform: 'tiktok' })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14.5 3c.3 1.8 1.4 3.3 3 4.2 1 .5 2 .8 3.2.8v3a9.4 9.4 0 0 1-4.2-1v6.2a6.2 6.2 0 1 1-6.2-6.2c.3 0 .6 0 .9.1v3.1a3.2 3.2 0 1 0 2.3 3V3h3Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links rápidos */}
          <div className="footer-column">
            <h4>Links Rápidos</h4>
            <ul>
              <li>
                <a href="#inicio">Home</a>
              </li>
              <li>
                <a href="#sobre">Sobre Nós</a>
              </li>
              <li>
                <a href="#servicos">Serviços</a>
              </li>
              <li>
                <a href="#depoimentos">Depoimentos</a>
              </li>
              <li>
                <a href="#parceiros">Parceiros</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a
                  href="#politica-privacidade"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = "politica-privacidade";
                  }}
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Serviços */}
          <div className="footer-column">
            <h4>Nossos Serviços</h4>
            <ul>
              <li>
                <a href="#servicos">Empréstimo Consignado</a>
              </li>
              <li>
                <a href="#servicos">Empréstimo Pessoal</a>
              </li>
              <li>
                <a href="#servicos">Financiamento Veicular</a>
              </li>
              <li>
                <a href="#servicos">Crédito Imobiliário</a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato / NAP (Name, Address, Phone) */}
          <div className="footer-column">
            <h4>Contato</h4>
            <div className="company-info-nap">
              <h3 className="company-name">Fênix Cred Soluções Financeiras</h3>
              <address className="company-address">
                <p>
                  <strong>Endereço:</strong>
                  <br />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Av.+do+Oratório,+4098+-+Jardim+Guairaca,+São+Paulo+-+SP,+03220-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver localização no Google Maps"
                  >
                    Av. do Oratório, 4098 - Jardim Guairaca
                    <br />
                    CEP 03220-200 - São Paulo - SP
                  </a>
                </p>
                <p>
                  <strong>Telefone:</strong>
                  <br />
                  <a
                    href="tel:+5511917082143"
                    aria-label="Ligar para (11) 91708-2143"
                    onClick={() => {
                      const eventId = generateEventId()
                      trackEvent('Contact', { content_name: 'Footer Telefone', content_category: 'phone' }, eventId)
                      sendServerEvent('Contact', eventId, { page: 'Footer Telefone' })
                    }}
                  >
                    (11) 91708-2143
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>
                  <br />
                  <a
                    href="mailto:contato@fenixcredbr.com.br"
                    aria-label="Enviar email para contato@fenixcredbr.com.br"
                    onClick={() => {
                      const eventId = generateEventId()
                      trackEvent('Contact', { content_name: 'Footer Email', content_category: 'email' }, eventId)
                      sendServerEvent('Contact', eventId, { page: 'Footer Email' })
                    }}
                  >
                    contato@fenixcredbr.com.br
                  </a>
                </p>
                <p>
                  <strong>Horário de Atendimento:</strong>
                  <br />
                  Segunda a Sexta, 8h às 18h
                </p>
              </address>
            </div>
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

        {/* Copyright e Avisos Legais */}
        <div className="footer-bottom">
          <p className="copyright">
            2025 © Todos os direitos reservados. Fenix Cred
          </p>
          <div className="legal-text">
            <p>
              A Fenix Cred não é uma instituição financeira e não realiza
              operações de crédito diretamente. A Fenix Cred é uma plataforma
              digital que atua como correspondente bancário para facilitar o
              processo de contratação de produtos financeiros. Como
              correspondente bancário, seguimos as diretrizes do Banco Central
              do Brasil, nos termos da Resolução nº. 3.954, de 24 de fevereiro
              de 2011. Toda avaliação de crédito será realizada conforme a
              política de crédito da Instituição Financeira escolhida pelo
              usuário. Antes da contratação de qualquer serviço através de
              nossos parceiros, você receberá todas as condições e informações
              relativas ao produto a ser contrato, de forma completa e
              transparente.
            </p>
          </div>
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

      {/* Botão flutuante WhatsApp */}
      <button
        className="whatsapp-float"
        onClick={openWhatsApp}
        aria-label="Fale conosco no WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </button>
    </footer>
  );
}

export default Footer;
