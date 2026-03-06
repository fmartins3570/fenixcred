import { stats } from '../../utils/credito-clt/constants'
import './SocialProof.css'

const iconMap = {
  CheckCircle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  DollarSign: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
}

/**
 * Social Proof - Stats strip
 * Floating bar between Hero and Benefits showing key metrics
 */
export default function SocialProof() {
  return (
    <section className="social-proof-clt" aria-label="Resultados da Fenix Cred">
      <div className="social-proof-container">
        <div className="social-proof-grid">
          {stats.map((stat, index) => (
            <div key={index} className="social-proof-item">
              <span className="social-proof-icon">
                {iconMap[stat.icon]}
              </span>
              <div className="social-proof-data">
                <span className="social-proof-value">{stat.value}</span>
                <span className="social-proof-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
