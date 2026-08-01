<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  speed: { type: Number, default: 50 },
  maxIterations: { type: Number, default: 10 },
  sequential: { type: Boolean, default: false },
  revealDirection: { type: String, default: 'start' },
  useOriginalCharsOnly: { type: Boolean, default: false },
  characters: { type: String, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+' },
  className: { type: String, default: '' },
  parentClassName: { type: String, default: '' },
  encryptedClassName: { type: String, default: '' },
  animateOn: { type: String, default: 'hover' },
  clickMode: { type: String, default: 'once' }
})

const displayText = ref(props.text)
const isAnimating = ref(false)
const revealedIndices = ref<Set<number>>(new Set())
const hasAnimated = ref(false)
const isDecrypted = ref(props.animateOn !== 'click')
const direction = ref('forward')

const containerRef = ref<HTMLElement | null>(null)
const orderRef = ref<number[]>([])
const pointerRef = ref(0)
let intervalRef: ReturnType<typeof setInterval> | null = null

const availableChars = computed(() => {
  if (props.useOriginalCharsOnly) {
    return Array.from(new Set(props.text.split(''))).filter(char => char !== ' ')
  }
  return props.characters.split('')
})

const shuffleText = (originalText: string, currentRevealed: Set<number>) => {
  return originalText
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (currentRevealed.has(i)) return originalText[i]
      const chars = availableChars.value
      return chars[Math.floor(Math.random() * chars.length)]
    })
    .join('')
}

const computeOrder = (len: number) => {
  const order: number[] = []
  if (len <= 0) return order
  if (props.revealDirection === 'start') {
    for (let i = 0; i < len; i++) order.push(i)
    return order
  }
  if (props.revealDirection === 'end') {
    for (let i = len - 1; i >= 0; i--) order.push(i)
    return order
  }
  const middle = Math.floor(len / 2)
  let offset = 0
  while (order.length < len) {
    if (offset % 2 === 0) {
      const idx = middle + offset / 2
      if (idx >= 0 && idx < len) order.push(idx)
    } else {
      const idx = middle - Math.ceil(offset / 2)
      if (idx >= 0 && idx < len) order.push(idx)
    }
    offset++
  }
  return order.slice(0, len)
}

const fillAllIndices = () => {
  const s = new Set<number>()
  for (let i = 0; i < props.text.length; i++) s.add(i)
  return s
}

const removeRandomIndices = (set: Set<number>, count: number) => {
  const arr = Array.from(set)
  for (let i = 0; i < count && arr.length > 0; i++) {
    const idx = Math.floor(Math.random() * arr.length)
    arr.splice(idx, 1)
  }
  return new Set(arr)
}

const encryptInstantly = () => {
  const emptySet = new Set<number>()
  revealedIndices.value = emptySet
  displayText.value = shuffleText(props.text, emptySet)
  isDecrypted.value = false
}

const triggerDecrypt = () => {
  if (props.sequential) {
    orderRef.value = computeOrder(props.text.length)
    pointerRef.value = 0
    revealedIndices.value = new Set()
  } else {
    revealedIndices.value = new Set()
  }
  direction.value = 'forward'
  isAnimating.value = true
}

const triggerReverse = () => {
  if (props.sequential) {
    orderRef.value = computeOrder(props.text.length).slice().reverse()
    pointerRef.value = 0
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  } else {
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  }
  direction.value = 'reverse'
  isAnimating.value = true
}

const startAnimation = () => {
  let currentIteration = 0

  const getNextIndex = (revealedSet: Set<number>) => {
    const textLength = props.text.length
    switch (props.revealDirection) {
      case 'start': return revealedSet.size
      case 'end': return textLength - 1 - revealedSet.size
      case 'center': {
        const middle = Math.floor(textLength / 2)
        const offset = Math.floor(revealedSet.size / 2)
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1
        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) return nextIndex
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i
        }
        return 0
      }
      default: return revealedSet.size
    }
  }

  if (intervalRef) clearInterval(intervalRef)

  intervalRef = setInterval(() => {
    let prevRevealed = revealedIndices.value

    if (props.sequential) {
      if (direction.value === 'forward') {
        if (prevRevealed.size < props.text.length) {
          const nextIndex = getNextIndex(prevRevealed)
          const newRevealed = new Set(prevRevealed)
          newRevealed.add(nextIndex)
          revealedIndices.value = newRevealed
          displayText.value = shuffleText(props.text, newRevealed)
        } else {
          if (intervalRef) clearInterval(intervalRef)
          isAnimating.value = false
          isDecrypted.value = true
        }
      } else if (direction.value === 'reverse') {
        if (pointerRef.value < orderRef.value.length) {
          const idxToRemove = orderRef.value[pointerRef.value++]
          const newRevealed = new Set(prevRevealed)
          newRevealed.delete(idxToRemove)
          revealedIndices.value = newRevealed
          displayText.value = shuffleText(props.text, newRevealed)
          if (newRevealed.size === 0) {
            if (intervalRef) clearInterval(intervalRef)
            isAnimating.value = false
            isDecrypted.value = false
          }
        } else {
          if (intervalRef) clearInterval(intervalRef)
          isAnimating.value = false
          isDecrypted.value = false
        }
      }
    } else {
      if (direction.value === 'forward') {
        displayText.value = shuffleText(props.text, prevRevealed)
        currentIteration++
        if (currentIteration >= props.maxIterations) {
          if (intervalRef) clearInterval(intervalRef)
          isAnimating.value = false
          displayText.value = props.text
          isDecrypted.value = true
        }
      } else if (direction.value === 'reverse') {
        let currentSet = prevRevealed
        if (currentSet.size === 0) currentSet = fillAllIndices()
        
        const removeCount = Math.max(1, Math.ceil(props.text.length / Math.max(1, props.maxIterations)))
        const nextSet = removeRandomIndices(currentSet, removeCount)
        revealedIndices.value = nextSet
        displayText.value = shuffleText(props.text, nextSet)
        currentIteration++
        
        if (nextSet.size === 0 || currentIteration >= props.maxIterations) {
          if (intervalRef) clearInterval(intervalRef)
          isAnimating.value = false
          isDecrypted.value = false
          displayText.value = shuffleText(props.text, new Set())
          revealedIndices.value = new Set()
        }
      }
    }
  }, props.speed)
}

watch(isAnimating, (newVal) => {
  if (newVal) {
    startAnimation()
  }
})

const handleClick = () => {
  if (props.animateOn !== 'click') return

  if (props.clickMode === 'once') {
    if (isDecrypted.value) return
    direction.value = 'forward'
    triggerDecrypt()
  } else if (props.clickMode === 'toggle') {
    if (isDecrypted.value) {
      triggerReverse()
    } else {
      direction.value = 'forward'
      triggerDecrypt()
    }
  }
}

const triggerHoverDecrypt = () => {
  if (isAnimating.value) return
  revealedIndices.value = new Set()
  isDecrypted.value = false
  displayText.value = props.text
  direction.value = 'forward'
  isAnimating.value = true
}

const resetToPlainText = () => {
  if (intervalRef) clearInterval(intervalRef)
  isAnimating.value = false
  revealedIndices.value = new Set()
  displayText.value = props.text
  isDecrypted.value = true
  direction.value = 'forward'
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.animateOn === 'view' || props.animateOn === 'inViewHover') {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.value) {
          triggerDecrypt()
          hasAnimated.value = true
        }
      })
    }, { root: null, rootMargin: '0px', threshold: 0.1 })
    
    if (containerRef.value) {
      observer.observe(containerRef.value)
    }
  }

  if (props.animateOn === 'click') {
    encryptInstantly()
  } else {
    displayText.value = props.text
    isDecrypted.value = true
  }
  revealedIndices.value = new Set()
  direction.value = 'forward'
})

onUnmounted(() => {
  if (intervalRef) clearInterval(intervalRef)
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value)
  }
})

const eventHandlers = computed(() => {
  if (props.animateOn === 'hover' || props.animateOn === 'inViewHover') {
    return {
      mouseenter: triggerHoverDecrypt,
      mouseleave: resetToPlainText
    }
  }
  if (props.animateOn === 'click') {
    return {
      click: handleClick
    }
  }
  return {}
})
</script>

<template>
  <span 
    :class="props.parentClassName" 
    ref="containerRef" 
    class="decrypted-text-wrapper" 
    v-on="eventHandlers"
  >
    <span class="sr-only">{{ displayText }}</span>
    <span aria-hidden="true">
      <span 
        v-for="(char, index) in displayText.split('')" 
        :key="index"
        :class="(revealedIndices.has(index) || (!isAnimating && isDecrypted)) ? props.className : props.encryptedClassName"
      >
        {{ char }}
      </span>
    </span>
  </span>
</template>

<style scoped>
.decrypted-text-wrapper {
  display: inline-block;
  white-space: pre-wrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
