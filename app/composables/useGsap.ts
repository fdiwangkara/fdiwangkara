/**
 * SSR-safe GSAP composable with ScrollTrigger + SplitText registration.
 * Provides auto-cleanup via gsap.context() tied to component lifecycle.
 */
import { onMounted, onUnmounted, type Ref } from 'vue'

export const useGsap = () => {
  let gsapModule: typeof import('gsap') | null = null
  let ScrollTriggerModule: any = null
  let FlipModule: any = null
  let SplitTextModule: any = null

  const loadGsap = async () => {
    if (import.meta.server) return null

    if (!gsapModule) {
      gsapModule = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { Flip } = await import('gsap/Flip')
      const { SplitText } = await import('gsap/SplitText')
      
      gsapModule.gsap.registerPlugin(ScrollTrigger, Flip, SplitText)
      ScrollTriggerModule = ScrollTrigger
      FlipModule = Flip
      SplitTextModule = SplitText
    }

    return {
      gsap: gsapModule.gsap,
      ScrollTrigger: ScrollTriggerModule,
      Flip: FlipModule,
      SplitText: SplitTextModule,
    }
  }

  /**
   * Creates a scoped GSAP context that auto-reverts on unmount.
   * Use this in every component to prevent memory leaks.
   */
  const useGsapContext = (
    scope: Ref<HTMLElement | null>,
    setup: (ctx: {
      gsap: typeof import('gsap')['gsap']
      ScrollTrigger: any
      Flip: any
      SplitText: any
    }) => void
  ) => {
    let ctx: any = null

    onMounted(async () => {
      const modules = await loadGsap()
      if (!modules || !scope.value) return

      ctx = modules.gsap.context(() => {
        setup(modules)
      }, scope.value)
    })

    onUnmounted(() => {
      ctx?.revert()
    })
  }

  return {
    loadGsap,
    useGsapContext,
  }
}
