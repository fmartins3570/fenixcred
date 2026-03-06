import "./About.css";
import RelatedContent from "./RelatedContent";

/**
 * Componente About - Seção Sobre Nós
 *
 * Layout de texto centralizado
 */
function About() {
  return (
    <section id="sobre" className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-heading">
              Porque escolher a FenixCred para crédito CLT?
            </h2>
            <p className="about-description">
              Com mais de 5 anos de experiência no mercado financeiro, a FenixCred é referência no crédito CLT a nível Brasil. Nosso objetivo é facilitar o acesso ao crédito para trabalhadores com carteira assinada, oferecendo condições justas, total transparência e liberação rápida, sem burocracia desnecessária.
            </p>
            <p className="about-description">
              Somos sediados na capital Paulista e atuamos como correspondente bancário autorizado pelo banco central, conforme a resolução n 3.954, intermediando operações com os principais bancos do país, como Banco do Brasil, caixa, Bradesco, Itaú, Santander e Sicredi.
            </p>
            <p className="about-description">
              Trabalhamos com agilidade, transparência e compromisso, sempre buscando a melhor opção de Crédito CLT de acordo com o seu perfil. Nossa equipe especializada está pronta para te orientar em cada etapa do processo, garantindo segurança, clareza e a melhor solução financeira para você.
            </p>

            {/* Informações de Contato NAP */}
            <div className="about-contact-info">
              <p className="about-description">
                <strong>Fênix Cred Soluções Financeiras</strong>
                <br />
                <strong>Endereço:</strong> Av. do Oratório, 4098 - Jardim
                Guairaca, CEP 03220-200 - São Paulo - SP
                <br />
                <strong>Telefone:</strong>{" "}
                <a href="tel:+5511917082143">(11) 91708-2143</a>
                <br />
                <strong>Email:</strong>{" "}
                <a href="mailto:contato@fenixcredbr.com.br">
                  contato@fenixcredbr.com.br
                </a>
                <br />
                <strong>Horário de Atendimento:</strong> Segunda a Sexta, 8h às
                18h
              </p>
            </div>

            <a href="#servicos" className="about-link">
              Ver soluções de crédito CLT
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Links Internos - Conteúdo Relacionado */}
      <RelatedContent currentSection="sobre" maxLinks={5} />
    </section>
  );
}

export default About;
