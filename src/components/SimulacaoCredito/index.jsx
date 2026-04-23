import { useEffect } from 'react'
import HeaderCLT from '../CreditoCLT/HeaderCLT'
import Footer from '../CreditoCLT/Footer'
import SchemaJSON from '../SchemaJSON'
import BackToTop from '../BackToTop'
import CookieBanner from '../CookieBanner'
import Hero from '../SimulacaoCLT/Hero'
import Questionnaire from './Questionnaire'
import FAQ from '../SimulacaoCLT/FAQ'
import WhatsAppFloat from '../SimulacaoCLT/WhatsAppFloat'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import '../SimulacaoCLT/index.css'

export default function SimulacaoCredito() {
  useEffect(() => {
    const eventId = generateEventId()
    trackEvent('ViewContent', {
      content_name: 'Simulação Crédito com Garantia',
      content_category: 'simulacao-credito',
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
