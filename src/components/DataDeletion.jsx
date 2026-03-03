import './PrivacyPolicy.css'

/**
 * Componente DataDeletion - Página de Instruções para Exclusão de Dados
 *
 * Página standalone para Meta Developers - Data Deletion Instructions URL
 * Acessível apenas via URL direta: /exclusao-de-dados
 */
function DataDeletion() {
  return (
    <section id="exclusao-de-dados" className="privacy-policy">
      <div className="privacy-container">
        <div className="privacy-header">
          <h1>Exclusão de Dados do Usuário</h1>
          <p className="privacy-subtitle">Fênix Cred Soluções Financeiras LTDA</p>
        </div>

        <div className="privacy-content">
          <div className="privacy-section">
            <h2>Solicitação de exclusão de dados</h2>
            <p>
              A Fênix Cred respeita a sua privacidade e o seu direito de controlar seus dados pessoais,
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e as políticas
              da plataforma Meta (Facebook/Instagram).
            </p>
            <p>
              Se você utilizou o login do Facebook ou Instagram para acessar nossos serviços, podemos ter
              recebido informações do seu perfil, como nome, e-mail e foto de perfil. Você pode solicitar
              a exclusão completa desses dados a qualquer momento.
            </p>
          </div>

          <div className="privacy-section">
            <h2>Como solicitar a exclusão dos seus dados</h2>
            <p>Você pode solicitar a exclusão dos seus dados de duas formas:</p>

            <h3>Opção 1 — Por e-mail</h3>
            <p>
              Envie um e-mail para o nosso encarregado de proteção de dados com o assunto
              <strong> "Solicitação de Exclusão de Dados"</strong>:
            </p>
            <div className="privacy-contact">
              <a href="mailto:contato@fenixcredbr.com.br">contato@fenixcredbr.com.br</a>
            </div>
            <p>No e-mail, informe:</p>
            <ul className="privacy-list">
              <li>Seu nome completo</li>
              <li>E-mail associado à conta do Facebook/Instagram</li>
              <li>Descrição da solicitação (exclusão total ou parcial dos dados)</li>
            </ul>

            <h3>Opção 2 — Remover pelas configurações do Facebook</h3>
            <p>
              Você também pode remover as permissões concedidas ao nosso aplicativo diretamente
              nas configurações da sua conta do Facebook:
            </p>
            <ul className="privacy-list">
              <li>Acesse sua conta do Facebook</li>
              <li>Vá em <strong>Configurações e Privacidade</strong> → <strong>Configurações</strong></li>
              <li>Clique em <strong>Aplicativos e sites</strong></li>
              <li>Localize <strong>Fênix Cred</strong> e clique em <strong>Remover</strong></li>
              <li>Marque a opção para excluir todas as informações compartilhadas</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>O que será excluído</h2>
            <p>Ao solicitar a exclusão, removeremos permanentemente:</p>
            <ul className="privacy-list">
              <li>Dados do perfil obtidos via login do Facebook/Instagram (nome, e-mail, foto)</li>
              <li>Tokens de autenticação e sessão</li>
              <li>Qualquer dado pessoal vinculado à sua conta na plataforma Meta</li>
            </ul>
            <p>
              <strong>Importante:</strong> Dados necessários para cumprimento de obrigações legais, regulatórias
              ou para exercício de direitos em processos judiciais poderão ser retidos pelo prazo exigido por lei,
              conforme previsto na LGPD (Art. 16).
            </p>
          </div>

          <div className="privacy-section">
            <h2>Prazo para exclusão</h2>
            <p>
              Após o recebimento da solicitação, seus dados serão excluídos em até
              <strong> 15 dias úteis</strong>. Você receberá uma confirmação por e-mail quando
              o processo for concluído.
            </p>
          </div>

          <div className="privacy-section">
            <h2>Contato</h2>
            <p>
              Em caso de dúvidas sobre a exclusão de dados ou sobre nossa política de privacidade,
              entre em contato:
            </p>
            <div className="privacy-contact">
              <a href="mailto:contato@fenixcredbr.com.br">contato@fenixcredbr.com.br</a>
            </div>
            <p>
              <strong>FÊNIX CRED SOLUÇÕES FINANCEIRAS LTDA</strong><br />
              CNPJ: 52.069.594/0001-90
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DataDeletion
