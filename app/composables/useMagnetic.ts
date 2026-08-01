/**
 * Magnetic hover effect composable.
 * Makes an element subtly follow the cursor when hovered within a threshold.
 * Uses GSAP for smooth spring-back on mouse leave.
 */
import { onMounted, onUnmounted, type Ref } from 'vue'

interface MagneticOptions {
  strength?: number      // 0–1, how much the element follows (default 0.3)
  threshold?: number     // px, activation distance from center (default 100)
  duration?: number      // spring-back duration (default 0.4)
  ease?: string          // GSAP ease for spring-back (default 'elastic.out(1, 0.3)')
}

export const useMagnetic = (
  element: Ref<HTMLElement | null>,
  options: MagneticOptions = {}
) => {
  const {
    strength = 0.3,
    threshold = 100,
    duration = 0.4,
    ease = 'elastic.out(1, 0.3)',
  } = options

  let gsap: any = null
  let cleanup: (() => void) | null = null

  onMounted(async () => {
    if (import.meta.server || !element.value) return

    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const gsapModule = await import('gsap')
    gsap = gsapModule.gsap

    const el = element.value

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const dist = Math.sqrt(distX * distX + distY * distY)

      if (dist < threshold) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration,
        ease,
      })
    }

    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave)

    cleanup = () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  })

  onUnmounted(() => {
    cleanup?.()
  })
}
