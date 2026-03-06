import './Parceiros.css'

/**
 * Componente Parceiros - Seção de parceiros/instituições
 * 
 * Exibe logos de parceiros e instituições financeiras
 */
function Parceiros() {
  const parceiros = [
    { id: 1, nome: 'Banco do Brasil', logo: '🏦' },
    { id: 2, nome: 'Caixa Econômica', logo: '🏛️' },
    { id: 3, nome: 'Bradesco', logo: '💼' },
    { id: 4, nome: 'Itaú', logo: '🏢' },
    { id: 5, nome: 'Santander', logo: '🏪' },
    { id: 6, nome: 'Sicredi', logo: '🤝' }
  ]

  return (
    <section id="parceiros" className="parceiros">
      <div className="parceiros-container">
        <div className="parceiros-header">
          <h2 className="section-title">Nossos Parceiros</h2>
          <p className="section-subtitle">
            Trabalhamos com as principais instituições financeiras do país
          </p>
        </div>

        <div className="parceiros-grid">
          {parceiros.map((parceiro) => (
            <div key={parceiro.id} className="parceiro-card" data-spotlight>
              <div className="parceiro-logo">{parceiro.logo}</div>
              <p className="parceiro-nome">{parceiro.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Parceiros

