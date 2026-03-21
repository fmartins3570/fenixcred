import { useEffect } from 'react'
import HeaderCLT from '../CreditoCLT/HeaderCLT'
import Footer from '../CreditoCLT/Footer'
import SchemaJSON from '../SchemaJSON'
import BackToTop from '../BackToTop'
import CookieBanner from '../CookieBanner'
import Hero from './Hero'
import Questionnaire from './Questionnaire'
import FAQ from './FAQ'
import WhatsAppFloat from './WhatsAppFloat'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import './index.css'

/**
 * Landing Page - Simulação Consignado CLT
 * Fluxo interativo de pré-qualificação com questionário
 * Rota: /simulacao-consignado-clt
 */
export default function SimulacaoCLT() {
  useEffect(() => {
    const eventId = generateEventId()
    trackEvent('ViewContent', {
      content_name: 'Simulação Consignado CLT',
      content_category: 'simulacao-clt',
    }, eventId)
    sendServerEvent('ViewContent', eventId)
  }, [])

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
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  )
}
