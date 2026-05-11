import './Stats.css'

/**
 * Componente Stats - Seção de métricas/estatísticas
 * 
 * Exibe 4 cards com métricas importantes:
 * - +200mil clientes atendidos ao mês
 * - +200 colaboradores
 * - Nota 4.9 de avaliação Google
 * - Desde 2008 atuando no mercado
 * 
 * Layout: Grid 4 colunas (desktop) → 2 colunas (tablet) → 1 coluna (mobile)
 */
function Stats() {
  // Componente de ícone SVG para Clientes
  const ClientsIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 11C19.5523 11 20 10.5523 20 10C20 9.44772 19.5523 9 19 9" stroke="#FDB147" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9" stroke="#FDB147" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 21C17 18.7909 15.2091 17 13 17" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 21C7 18.7909 8.79086 17 11 17" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Componente de ícone SVG para Colaboradores
  const TeamIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Componente de ícone SVG para Avaliação Google
  const RatingIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FDB147" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Componente de ícone SVG para Anos no Mercado
  const CalendarIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14H8.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14H12.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 14H16.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18H8.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18H12.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 18H16.01" stroke="#FDB147" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const stats = [
    {
      id: 1,
      number: '+90 mil',
      label: 'Clientes atendidos ao mês',
      icon: <ClientsIcon />,
      description: 'trabalhadores CLT atendidos mensalmente'
    },
    {
      id: 2,
      number: '+20',
      label: 'Colaboradores',
      icon: <TeamIcon />,
      description: 'equipe dedicada ao seu sucesso'
    },
    {
      id: 3,
      number: '4.8',
      label: 'Nota de avaliação no Google',
      icon: <RatingIcon />,
      description: 'avaliação dos nossos clientes'
    },
    {
      id: 4,
      number: '2018',
      label: 'Atuando no mercado',
      icon: <CalendarIcon />,
      description: 'desde 2018 transformando vidas'
    }
  ]

  return (
    <section className="stats">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card" data-spotlight>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Avatares de clientes */}
        <div className="stats-avatars">
          <div className="avatars-label">de 90 mil clientes Fênix atendidos por mês</div>
          <div className="avatars-container">
            {['👨', '👩', '👨‍💼', '👩‍💼'].map((emoji, index) => (
              <div key={index} className="avatar">
                <div className="avatar-placeholder">
                  <span className="avatar-emoji">{emoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats

