import './PrivacyPolicy.css'

/**
 * Componente PrivacyPolicy - Página de Política de Privacidade
 * 
 * Exibe a política de privacidade completa da Fênix Cred
 */
function PrivacyPolicy() {
  const handleBack = () => {
    window.location.hash = ''
    window.scrollTo(0, 0)
  }

  return (
    <section id="politica-privacidade" className="privacy-policy">
      <div className="privacy-container">
        <button className="privacy-back-btn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Voltar para o site
        </button>
        <div className="privacy-header">
          <h1>Política de Privacidade</h1>
          <p className="privacy-subtitle">Fênix Cred Soluções Financeiras LTDA</p>
        </div>

        <div className="privacy-content">
          {/* Dados da Empresa */}
          <div className="privacy-section">
            <h2>Dados da empresa</h2>
            <p><strong>FÊNIX CRED SOLUÇÕES FINANCEIRAS LTDA</strong></p>
            <p>CNPJ: 52.069.594/0001-90</p>
          </div>

          {/* Introdução */}
          <div className="privacy-section">
            <p>
              Seus dados pessoais ("dados") são bens valiosos que devem ser preservados, e a FÊNIX CRED 
              fará tudo o que estiver ao seu alcance para protegê-los e manter a sua confiança. Por isso, 
              você precisa saber exatamente como suas informações serão utilizadas, de forma clara, objetiva 
              e alinhada à legislação vigente.
            </p>
            <p>
              Nós, da FÊNIX (FÊNIX CRED SOLUÇÕES FINANCEIRAS LTDA), atuamos como correspondente bancário, 
              representando e oferecendo produtos de instituições financeiras, especialmente operações de 
              crédito, por meio de nossa rede de parceiros e representantes. Para isso, tratamos uma série 
              de dados pessoais e assumimos o compromisso de garantir a sua privacidade e proteger suas informações.
            </p>
          </div>

          {/* Encarregado de Dados */}
          <div className="privacy-section">
            <h2>Encarregado de dados</h2>
            <p>Esta política foi aprovada pelo nosso encarregado de dados:</p>
            <ul className="privacy-list">
              <li><strong>Nome:</strong> Henrique Longo</li>
              <li><strong>E-mail:</strong> encarregado@fenixcred.com.br</li>
            </ul>
          </div>

          {/* Definições */}
          <div className="privacy-section">
            <h2>Definições principais</h2>
            <p>
              <strong>FÊNIX CRED:</strong> Empresa prestadora de serviços de correspondente bancário, nos 
              moldes e limites da Resolução 3.954 do Banco Central do Brasil.
            </p>
            <p>
              A FÊNIX CRED não é instituição financeira ou banco comercial, não realiza intermediação financeira, 
              não disponibiliza capital próprio para empréstimos, não aplica recursos de terceiros, não custodia 
              valores, não realiza pagamentos, não analisa ou concede crédito e tampouco recebe juros (spread bancário).
            </p>
            <p>
              A FÊNIX CRED possui contratos de prestação de serviços de correspondente bancário com diversas 
              instituições financeiras conveniadas.
            </p>
            <p>
              <strong>Site:</strong> Plataforma da FÊNIX CRED acessada pelos usuários para consulta e contratação de serviços.
            </p>
            <p>
              <strong>Usuário:</strong> Pessoa física que acessa ou interage com o site ou com os serviços da FÊNIX CRED.
            </p>
          </div>

          {/* Informações Coletadas */}
          <div className="privacy-section">
            <h2>1. Informações pessoais que coletamos</h2>
            <p>
              Todas as informações abaixo poderão ser coletadas, processadas, armazenadas, tratadas e disponibilizadas 
              para consulta pela FÊNIX CRED, sempre que pertinentes, necessárias ao uso legítimo ou mediante requisição 
              do titular, para cumprimento de obrigações legais.
            </p>
            <h3>1.1 Se você é cliente ou está em processo de contratação dos serviços, poderemos coletar:</h3>
            <ul className="privacy-list">
              <li>CPF</li>
              <li>RG</li>
              <li>Data de nascimento</li>
              <li>E-mail</li>
              <li>Número de telefone celular</li>
              <li>Comprovante de endereço</li>
              <li>Criação de senha de acesso</li>
              <li>Registro de biometria facial</li>
              <li>Cópia de RG ou CNH</li>
              <li>Dados da conta bancária</li>
            </ul>
          </div>

          {/* Finalidades */}
          <div className="privacy-section">
            <h2>2. Finalidades do uso dos dados</h2>
            <p>
              Coletamos dados pessoais para prestar serviços de forma adequada, segura, transparente e em conformidade 
              com a Lei Geral de Proteção de Dados Pessoais (LGPD) e demais normas aplicáveis.
            </p>
            <p><strong>Usamos os dados para:</strong></p>
            <ul className="privacy-list">
              <li>Identificar e autenticar corretamente os usuários.</li>
              <li>Administrar e prestar os serviços contratados, bem como cumprir obrigações decorrentes da contratação.</li>
              <li>Atender solicitações, dúvidas e reclamações.</li>
              <li>Manter cadastros atualizados para contato por telefone, e-mail, SMS ou outros meios de comunicação.</li>
              <li>Aperfeiçoar o uso e a experiência no site.</li>
              <li>Elaborar estatísticas, estudos e pesquisas sobre o uso do site, de forma anonimizada.</li>
              <li>Informar sobre novidades, produtos, serviços, funcionalidades, conteúdos e eventos relevantes.</li>
              <li>Resguardar direitos e cumprir obrigações relacionadas ao uso do site.</li>
              <li>Colaborar e/ou cumprir ordens judiciais ou requisições de autoridades administrativas.</li>
            </ul>
            <p><strong>Também podemos:</strong></p>
            <ul className="privacy-list">
              <li>Compartilhar dados com parceiros da FÊNIX CRED para manutenção do site, produtos e serviços.</li>
              <li>Compartilhar dados com parceiros para enriquecimento de base e prevenção a fraudes e riscos, respeitando a finalidade específica.</li>
              <li>Compartilhar dados com instituições financeiras responsáveis pelos produtos/serviços contratados por você.</li>
              <li>Compartilhar informações com bancos e parceiros para viabilizar a prestação de serviços, incluindo análise de propostas e formalização de contratos.</li>
              <li>Compartilhar informações com terceiros que prestam serviços de validação e autenticação de dados, visando a segurança das operações.</li>
              <li>Utilizar dados para envio de comunicados, informativos, convites e ofertas da FÊNIX CRED e/ou de seus parceiros.</li>
              <li>Elaborar e fornecer relatórios estatísticos e métricas aos parceiros e representantes, com dados agregados e, quando aplicável, anonimização.</li>
            </ul>
            <p>
              Os dados pessoais serão tratados pelo tempo necessário ao cumprimento das finalidades descritas nesta 
              Política, ou conforme exigido por lei. Qualquer uso para fins distintos dos aqui previstos dependerá de 
              novo consentimento do titular, quando aplicável.
            </p>
          </div>

          {/* Direitos do Titular */}
          <div className="privacy-section">
            <h2>3. Direitos do titular de dados</h2>
            <p>
              Nos termos da LGPD, você possui, entre outros, os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="privacy-list">
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Confirmação de uso e acesso:</strong> Verificar se a FÊNIX CRED trata dados pessoais seus e, em caso positivo, solicitar cópia desses dados.</li>
              <li><strong>Anonimização:</strong> Requerer a anonimização de dados, tornando-os não relacionados a você.</li>
              <li><strong>Bloqueio:</strong> Solicitar a suspensão temporária do tratamento de dados, salvo hipóteses legais que impeçam o bloqueio.</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão definitiva dos dados pessoais, salvo hipóteses legais de conservação ou processos em andamento/potenciais.</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados pessoais para você ou para terceiros, em formato estruturado e interoperável, respeitando propriedade intelectual e confidencialidade.</li>
              <li><strong>Informação sobre compartilhamento:</strong> Solicitar informação sobre entidades com as quais a FÊNIX CRED compartilha seus dados.</li>
              <li><strong>Revogação de consentimento:</strong> Revogar consentimento concedido, afetando apenas tratamentos futuros, sem prejuízo dos tratamentos realizados até a data da revogação.</li>
            </ul>
          </div>

          {/* Como Utilizamos */}
          <div className="privacy-section">
            <h2>4. Como utilizamos as informações pessoais</h2>
            <p>
              Utilizamos dados pessoais para prestar serviços, nos comunicar com você, personalizar sua experiência, 
              cumprir obrigações legais e garantir segurança das operações. No relacionamento com parceiros e representantes, 
              poderemos compartilhar dados pessoais na medida necessária ao cumprimento das finalidades desta Política e de 
              obrigações legais.
            </p>
            <p><strong>Poderá haver compartilhamento de dados em:</strong></p>
            <ul className="privacy-list">
              <li>Processos judiciais em andamento ou potenciais.</li>
              <li>Situações em que seja necessário exercer, defender ou estabelecer direitos da FÊNIX CRED ou de terceiros.</li>
              <li>Cumprimento de ordens emanadas de autoridades competentes.</li>
            </ul>
            <p>
              A FÊNIX CRED poderá registrar logs de acesso, incluindo endereço IP, ações efetuadas no site, telas acessadas, 
              datas e horários, dados do dispositivo (como versão de sistema operacional e geolocalização), session ID, histórico 
              de transações e comportamentos de navegação. Outras tecnologias de rastreio poderão ser utilizadas, sempre em 
              conformidade com esta Política e com as escolhas do usuário.
            </p>
          </div>

          {/* Cookies e Tecnologias de Rastreamento */}
          <div className="privacy-section">
            <h2>5. Cookies e tecnologias de rastreamento</h2>
            <p>
              O site da FÊNIX CRED utiliza cookies e tecnologias similares para melhorar a experiência do
              usuário, analisar o tráfego e personalizar conteúdo e anúncios. Ao utilizar nosso site, você
              concorda com o uso dessas tecnologias conforme descrito abaixo.
            </p>
            <h3>5.1 Cookies essenciais</h3>
            <p>
              Necessários para o funcionamento básico do site, como preferências de sessão e navegação.
              Não podem ser desativados.
            </p>
            <h3>5.2 Cookies de análise (Google Analytics)</h3>
            <p>
              Utilizamos o Google Analytics (Google LLC) para coletar dados agregados sobre o uso do site,
              como páginas visitadas, tempo de permanência e origem do tráfego. Esses dados são anonimizados
              e utilizados exclusivamente para melhoria do site e dos serviços.
            </p>
            <h3>5.3 Cookies de publicidade (Meta Pixel)</h3>
            <p>
              Utilizamos o Meta Pixel (Meta Platforms, Inc.) para mensurar a eficácia de campanhas
              publicitárias, criar públicos personalizados e otimizar anúncios. Os dados coletados incluem
              páginas visitadas, ações realizadas no site (como envio de formulários) e identificadores de
              navegador. Esses dados são compartilhados com a Meta para fins de publicidade direcionada.
            </p>
            <h3>5.4 Conversions API (CAPI)</h3>
            <p>
              Além do Meta Pixel, utilizamos a Conversions API da Meta para enviar eventos do servidor,
              garantindo maior precisão na mensuração de resultados. Os dados de usuário enviados via CAPI
              são criptografados (hash SHA-256) antes do envio.
            </p>
            <h3>5.5 Compartilhamento com terceiros</h3>
            <p>
              Os dados coletados por meio de cookies e pixels podem ser compartilhados com:
            </p>
            <ul className="privacy-list">
              <li><strong>Meta Platforms, Inc.</strong> — para otimização de campanhas publicitárias e mensuração de conversões.</li>
              <li><strong>Google LLC</strong> — para análise de tráfego e desempenho do site.</li>
              <li><strong>Google LLC (Maps/Places)</strong> — para exibição de mapas e informações de localização.</li>
            </ul>
            <p>
              Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do seu
              navegador. A desativação de cookies não essenciais pode afetar funcionalidades do site.
            </p>
          </div>

          {/* Segurança */}
          <div className="privacy-section">
            <h2>6. Segurança da informação</h2>
            <p>
              A FÊNIX CRED e seus usuários se comprometem com a veracidade das informações prestadas, responsabilizando-se em 
              caso de ilegalidade decorrente de dados falsos ou não autorizados. A FÊNIX CRED emprega esforços técnicos e 
              administrativos para proteger seus dados contra perda, roubo, uso indevido, acesso não autorizado, divulgação, 
              alteração ou destruição.
            </p>
            <p><strong>Principais pontos de segurança:</strong></p>
            <ul className="privacy-list">
              <li>Colaboradores e terceiros são proibidos de reproduzir ou compartilhar dados sem autorização da FÊNIX CRED.</li>
              <li>Informações ou dados pessoais inseridos ou convertidos para meio digital poderão ser criptografados, quando necessário.</li>
              <li>Apenas colaboradores e terceiros estritamente necessários ao tratamento de determinado dado possuem credenciais de acesso.</li>
              <li>Quem possui credencial de acesso é responsável pelo uso correto, podendo responder pessoalmente pelo uso indevido.</li>
              <li>Os dados pessoais serão mantidos apenas pelo tempo necessário às finalidades, salvo anonimização ou hipóteses legais específicas (obrigação legal, redução de riscos de fraude, exercício de defesa em processos).</li>
            </ul>
          </div>

          {/* Atualizações */}
          <div className="privacy-section">
            <h2>7. Atualizações da política</h2>
            <p>
              A FÊNIX CRED busca continuamente aprimorar seus sistemas, serviços e mecanismos de proteção de dados, podendo 
              atualizar ou alterar esta Política de Privacidade de forma unilateral. Eventuais mudanças serão publicadas nesta 
              página, com atualização da data da última alteração, e passarão a valer após o prazo indicado na comunicação.
            </p>
            <p>
              Ao continuar utilizando o site ou serviços após a vigência das alterações, você concorda em estar vinculado à nova 
              versão da Política.
            </p>
          </div>

          {/* Resolução de Conflitos */}
          <div className="privacy-section">
            <h2>8. Resolução de conflitos</h2>
            <p>
              Para dirimir eventuais conflitos relacionados a esta Política ou ao tratamento de dados pessoais, fica eleito o 
              foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja. As 
              solicitações judiciais de registros e informações serão processadas nos termos da Lei 13.709/2018 e demais normas aplicáveis.
            </p>
          </div>

          {/* Vigência */}
          <div className="privacy-section">
            <h2>9. Vigência</h2>
            <p>
              Esta Política de Privacidade entra em vigor na data de sua publicação no site da FÊNIX CRED e permanecerá válida 
              até que seja substituída por nova versão.
            </p>
          </div>

          {/* LGPD */}
          <div className="privacy-section">
            <h2>10. LGPD e bases legais</h2>
            <p>
              A LGPD regula o tratamento de dados pessoais, inclusive por meios digitais, com o objetivo de proteger direitos 
              fundamentais de liberdade, privacidade e o livre desenvolvimento da personalidade da pessoa natural. O tratamento 
              de dados pessoais realizado pela FÊNIX CRED atende necessidades e finalidades específicas ligadas à execução dos 
              serviços, respeitando princípios como finalidade, adequação, necessidade, livre acesso, segurança e transparência.
            </p>
            <p><strong>As principais bases legais utilizadas são:</strong></p>
            <ul className="privacy-list">
              <li>Execução de contrato.</li>
              <li>Consentimento do titular.</li>
              <li>Legítimo interesse, quando aplicável.</li>
              <li>Proteção ao crédito.</li>
            </ul>
            <p>
              O titular terá sempre livre acesso às suas informações e poderá solicitar edição ou, nos casos permitidos, 
              exclusão dos dados pessoais.
            </p>
          </div>

          {/* Disposições Gerais */}
          <div className="privacy-section">
            <h2>11. Disposições gerais</h2>
            <p>
              Os usuários declaram que concordam e se comprometem a cumprir as disposições desta Política de Privacidade da 
              FÊNIX CRED. Não há vínculo empregatício, associativo ou societário entre a FÊNIX CRED e os usuários, seus empregados, 
              prepostos ou prestadores de serviços, sendo de responsabilidade dos usuários o mau uso ou utilização indevida de 
              informações dentro do site.
            </p>
          </div>

          {/* Contato */}
          <div className="privacy-section">
            <h2>12. Contato com a FÊNIX CRED</h2>
            <p>
              Caso precise de suporte ou tenha dúvidas, pedidos ou sugestões em relação a esta Política ou a questões de privacidade, 
              a FÊNIX CRED está à disposição. Basta contatar a central de atendimento ou o encarregado de proteção de dados, pelo e-mail:
            </p>
            <p className="privacy-contact">
              <a href="mailto:encarregado@fenixcred.com.br">encarregado@fenixcred.com.br</a>
            </p>
          </div>

          {/* Histórico */}
          <div className="privacy-section">
            <h2>Histórico de versões</h2>
            <table className="privacy-table">
              <thead>
                <tr>
                  <th>Versão</th>
                  <th>Data</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.0</td>
                  <td>Março de 2026</td>
                  <td>Versão inicial da Política de Privacidade da FÊNIX CRED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPolicy

