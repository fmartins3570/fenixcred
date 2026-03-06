/**
 * Spotlight Card Effect - Local coordinate tracking per element
 * Based on 21st.dev border hover effect pattern.
 * Tracks mouse position relative to each [data-spotlight] element.
 *
 * [data-spotlight]       — cards (uses ::before + ::after, adds overflow:hidden)
 * [data-spotlight-frame] — hero model frame (uses ::after only, NO overflow/z-index changes)
 */
let initialized = false

function setupElement(el) {
  if (el._spotlightInit) return
  el._spotlightInit = true

  // For frames with pointer-events:none, listen on parent instead
  const target = getComputedStyle(el).pointerEvents === 'none' ? el.parentElement : el

  target.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--sp-x', `${x}px`)
    el.style.setProperty('--sp-y', `${y}px`)
    el.style.setProperty('--sp-opacity', '1')
  })

  target.addEventListener('mouseleave', () => {
    el.style.setProperty('--sp-opacity', '0')
  })
}

export function initSpotlight() {
  if (initialized) return
  initialized = true

  const selector = '[data-spotlight], [data-spotlight-frame]'

  const init = () => {
    document.querySelectorAll(selector).forEach(setupElement)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Watch for dynamically added elements (React renders)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue
        if (node.matches && node.matches(selector)) setupElement(node)
        if (node.querySelectorAll) {
          node.querySelectorAll(selector).forEach(setupElement)
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}
