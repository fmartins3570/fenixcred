import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Fires once when the element scrolls into view. Everything animated on this
 * page hangs off this — charts reveal on entry, never on a timer.
 */
export function useInView(rootMargin = '-12% 0px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}

/**
 * Counts from 0 to `target` once `active` flips true. Under
 * prefers-reduced-motion it jumps straight to the final value — the number is
 * the point, the animation is not.
 */
export function useCountUp(target, active, duration = 1100) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let frame
    let start = null

    const step = (timestamp) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutCubic — fast arrival, soft landing
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])

  return value
}
