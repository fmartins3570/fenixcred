import { useEffect } from 'react'
import HeaderCLT from '../CreditoCLT/HeaderCLT'
import Footer from '../CreditoCLT/Footer'
import SchemaJSON from '../SchemaJSON'
import BackToTop from '../BackToTop'
import CookieBanner from '../CookieBanner'
import Hero from '../SimulacaoCLT/Hero'
import QuestionnaireV3 from './QuestionnaireV3'
import FAQ from '../SimulacaoCLT/FAQ'
import WhatsAppFloat from '../SimulacaoCLT/WhatsAppFloat'
import { trackEvent, generateEventId } from '../../utils/metaPixel'
import { sendServerEvent } from '../../utils/metaCAPI'
import '../SimulacaoCLT/index.css'

export default function SimulacaoCLTV3() {
  useEffect(() => {
    const eventId = generateEventId()
    trackEvent('ViewContent', {
      content_name: 'Simulacao Consignado CLT V3',
      content_category: 'simulacao-clt',
      quiz_version: 'v3',
    }, eventId)
    sendServerEvent('ViewContent', eventId)
  }, [])

  return (
    <div className="simulacao-clt-page">
      <SchemaJSON />
      <HeaderCLT />
      <main>
        <Hero />
        <QuestionnaireV3 />
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  )
}
