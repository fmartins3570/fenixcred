import { useEffect } from 'react'
import { ANGLES } from '../../utils/consignado-lp/angles'
import Hero from './Hero'
import SocialProof from '../CreditoCLT/SocialProof'
import Benefits from '../CreditoCLT/Benefits'
import HowItWorks from '../CreditoCLT/HowItWorks'
import ReviewsSection from '../ReviewsSection'
import FAQ from '../CreditoCLT/FAQ'
import FinalCTA from './FinalCTA'
import Footer from '../CreditoCLT/Footer'
import SchemaJSON from '../SchemaJSON'
import HeaderCLT from '../CreditoCLT/HeaderCLT'
import BackToTop from '../BackToTop'
import CookieBanner from '../CookieBanner'
import { useWhatsAppWithTag } from '../../hooks/useWhatsAppWithTag'
import './index.css'

/**
 * Landing Page base for angle-specific consignado CLT campaigns.
 * @param {'negativado'|'velocidade'|'geral'} angle - Which angle to render
 */
export default function ConsignadoLP({ angle }) {
  const angleData = ANGLES[angle]
  const { openWhatsApp } = useWhatsAppWithTag(angleData.tag)

  // Set SEO meta tags
  useEffect(() => {
    document.title = angleData.seo.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', angleData.seo.description)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', angleData.seo.title)
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', angleData.seo.description)
  }, [angleData])

  return (
    <div className="consignado-lp-page">
      <SchemaJSON />
      <HeaderCLT />
      <main>
        <Hero angleData={angleData} tag={angleData.tag} />
        <SocialProof />
        <Benefits />
        <HowItWorks />
        <ReviewsSection variant="clt" />
        <FAQ />
        <FinalCTA tag={angleData.tag} ctaText={angleData.hero.ctaText} />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloatingButton tag={angleData.tag} openWhatsApp={openWhatsApp} />
      <CookieBanner />
    </div>
  )
}

function WhatsAppFloatingButton({ tag, openWhatsApp }) {
  const handleClick = () => {
    openWhatsApp(
      'Olá! Gostaria de simular um crédito consignado CLT.',
      `WhatsApp Float ${tag}`
    )
  }

  return (
    <button onClick={handleClick} aria-label="Falar no WhatsApp" className="whatsapp-float-button">
      <svg className="whatsapp-float-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </button>
  )
}
