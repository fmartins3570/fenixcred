import { useEffect, useRef } from 'react'
import { trackEvent } from '../utils/metaPixel'

export function useViewContent(contentName) {
  const ref = useRef(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || fired.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true
          trackEvent('ViewContent', { content_name: contentName })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [contentName])

  return ref
}
