/**
 * SplitText helper composable.
 * Wraps GSAP SplitText with automatic cleanup on unmount.
 */
import { onUnmounted } from 'vue'

interface SplitTextOptions {
  type?: string   // 'chars', 'words', 'lines', or combinations
  linesClass?: string
  wordsClass?: string
  charsClass?: string
}

export const useSplitText = () => {
  const splits: any[] = []

  const split = async (
    target: HTMLElement | string,
    options: SplitTextOptions = { type: 'chars,words,lines' }
  ) => {
    if (import.meta.server) return null

    const { SplitText } = await import('gsap/SplitText')
    const { gsap } = await import('gsap')
    gsap.registerPlugin(SplitText)

    const instance = SplitText.create(target, {
      type: options.type || 'chars,words,lines',
      linesClass: options.linesClass || 'split-line',
      wordsClass: options.wordsClass || 'split-word',
      charsClass: options.charsClass || 'split-char',
    })

    splits.push(instance)
    return instance
  }

  const revertAll = () => {
    splits.forEach((s) => s?.revert?.())
    splits.length = 0
  }

  onUnmounted(() => {
    revertAll()
  })

  return { split, revertAll }
}
