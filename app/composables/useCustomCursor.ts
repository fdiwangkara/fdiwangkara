/**
 * Custom cursor state management composable.
 * Provides reactive cursor position, label, and visual state.
 * Uses GSAP quickTo for buttery-smooth inertia following.
 */
import { reactive, readonly, onMounted, onUnmounted } from 'vue'

export interface CursorState {
  x: number
  y: number
  label: string
  isHovering: boolean
  isHidden: boolean
  scale: number
  blend: 'normal' | 'difference'
}

const state = reactive<CursorState>({
  x: -100,
  y: -100,
  label: '',
  isHovering: false,
  isHidden: false,
  scale: 1,
  blend: 'normal',
})

let initialized = false
let quickToX: any = null
let quickToY: any = null

export const useCustomCursor = () => {
  const setCursorLabel = (label: string) => {
    state.label = label
    state.isHovering = label !== ''
    state.scale = label ? 4 : 1
  }

  const setCursorScale = (scale: number) => {
    state.scale = scale
  }

  const setCursorBlend = (blend: 'normal' | 'difference') => {
    state.blend = blend
  }

  const hideCursor = () => {
    state.isHidden = true
  }

  const showCursor = () => {
    state.isHidden = false
  }

  const initCursor = async () => {
    if (initialized || import.meta.server) return

    // Check for touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      state.isHidden = true
      return
    }

    const { gsap } = await import('gsap')

    quickToX = gsap.quickTo(state, 'x', { duration: 0.35, ease: 'power3' })
    quickToY = gsap.quickTo(state, 'y', { duration: 0.35, ease: 'power3' })

    const onMouseMove = (e: MouseEvent) => {
      quickToX(e.clientX)
      quickToY(e.clientY)
    }

    const onMouseLeave = () => {
      state.isHidden = true
    }

    const onMouseEnter = () => {
      state.isHidden = false
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    initialized = true
  }

  return {
    cursor: readonly(state),
    setCursorLabel,
    setCursorScale,
    setCursorBlend,
    hideCursor,
    showCursor,
    initCursor,
  }
}
