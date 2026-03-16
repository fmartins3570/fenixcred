import HeaderCLT from '../CreditoCLT/HeaderCLT'
import Footer from '../CreditoCLT/Footer'
import SchemaJSON from '../SchemaJSON'
import BackToTop from '../BackToTop'
import Hero from './Hero'
import Questionnaire from './Questionnaire'
import FAQ from './FAQ'
import './index.css'

/**
 * Landing Page - Simulação Consignado CLT
 * Fluxo interativo de pré-qualificação com questionário
 * Rota: /simulacao-consignado-clt
 */
export default function SimulacaoCLT() {
  return (
    <div className="simulacao-clt-page">
      <SchemaJSON />
      <HeaderCLT />
      <main>
        <Hero />
        <Questionnaire />
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
