<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, getCurrentInstance } from 'vue'

const props = defineProps({
  marqueeText: { type: String, default: '' },
  speed: { type: Number, default: 2 },
  className: { type: String, default: '' },
  curveAmount: { type: Number, default: 400 },
  direction: { type: String, default: 'left' },
  interactive: { type: Boolean, default: true }
})

const uid = typeof useId === 'function' ? useId() : Math.random().toString(36).substring(2, 9)
const pathId = computed(() => `curve-${uid}`)
const pathD = computed(() => `M-100,40 Q500,${40 + props.curveAmount} 1540,40`)

const text = computed(() => {
  const hasTrailing = /\s|\u00A0$/.test(props.marqueeText)
  return (hasTrailing ? props.marqueeText.replace(/\s+$/, '') : props.marqueeText) + '\u00A0'
})

const measureRef = ref<SVGTextElement | null>(null)
const textPathRef = ref<SVGTextPathElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const spacing = ref(0)
const offset = ref(0)

const drag = ref(false)
const lastX = ref(0)
const dir = ref(props.direction)
const vel = ref(0)

const totalText = computed(() => {
  const textLength = spacing.value || 1000
  return textLength
    ? Array(Math.ceil(1800 / textLength) + 2).fill(text.value).join('')
    : text.value
})

let frameId = 0

const updateSpacing = () => {
  if (measureRef.value) {
    const len = measureRef.value.getComputedTextLength()
    if (len > 0) spacing.value = len
    else spacing.value = 1000
  }
}

watch([text, () => props.className], () => {
  updateSpacing()
})

watch(spacing, (newSpacing) => {
  if (!newSpacing) return
  if (textPathRef.value) {
    const initial = -newSpacing
    textPathRef.value.setAttribute('startOffset', initial + 'px')
    offset.value = initial
  }
})

const step = () => {
  if (!drag.value && textPathRef.value && spacing.value > 0) {
    const delta = dir.value === 'right' ? props.speed : -props.speed
    const currentOffset = parseFloat(textPathRef.value.getAttribute('startOffset') || '0')
    let newOffset = currentOffset + delta

    const wrapPoint = spacing.value
    if (newOffset <= -wrapPoint) newOffset += wrapPoint
    if (newOffset > 0) newOffset -= wrapPoint

    textPathRef.value.setAttribute('startOffset', newOffset + 'px')
    offset.value = newOffset
  }
  frameId = requestAnimationFrame(step)
}

onMounted(() => {
  updateSpacing()
  
  if (document.fonts) {
    document.fonts.ready.then(() => {
      updateSpacing()
    })
  }

  setTimeout(updateSpacing, 100)
  setTimeout(updateSpacing, 500)
  setTimeout(updateSpacing, 1500)
  
  frameId = requestAnimationFrame(step)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
})

const onPointerDown = (e: PointerEvent) => {
  if (!props.interactive) return
  drag.value = true
  lastX.value = e.clientX
  vel.value = 0
  if (e.target instanceof Element) e.target.setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!props.interactive || !drag.value || !textPathRef.value || spacing.value === 0) return
  const dx = e.clientX - lastX.value
  lastX.value = e.clientX
  vel.value = dx

  const currentOffset = parseFloat(textPathRef.value.getAttribute('startOffset') || '0')
  let newOffset = currentOffset + dx

  const wrapPoint = spacing.value
  if (newOffset <= -wrapPoint) newOffset += wrapPoint
  if (newOffset > 0) newOffset -= wrapPoint

  textPathRef.value.setAttribute('startOffset', newOffset + 'px')
  offset.value = newOffset
}

const endDrag = () => {
  if (!props.interactive) return
  drag.value = false
  dir.value = vel.value > 0 ? 'right' : 'left'
}

const cursorStyle = computed(() => {
  return props.interactive ? (drag.value ? 'grabbing' : 'grab') : 'auto'
})
</script>

<template>
  <div
    class="curved-loop-jacket"
    :style="{ cursor: cursorStyle }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointerleave="endDrag"
  >
    <svg class="curved-loop-svg" viewBox="0 0 1440 120">
      <text ref="measureRef" xml:space="preserve" style="visibility: hidden; opacity: 0; pointer-events: none;">
        {{ text }}
      </text>
      <defs>
        <path ref="pathRef" :id="pathId" :d="pathD" fill="none" stroke="transparent" />
        <linearGradient id="techStackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4facfe" />
          <stop offset="25%" stop-color="#00f2fe" />
          <stop offset="50%" stop-color="#43e97b" />
          <stop offset="75%" stop-color="#38f9d7" />
          <stop offset="100%" stop-color="#4facfe" />
        </linearGradient>
      </defs>
      <text xml:space="preserve" :class="className" fill="url(#techStackGrad)">
        <textPath ref="textPathRef" :href="`#${pathId}`" :startOffset="offset + 'px'" xml:space="preserve">
          {{ totalText }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<style scoped>
.curved-loop-jacket {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.curved-loop-svg {
  user-select: none;
  width: 100%;
  aspect-ratio: 100 / 12;
  overflow: visible;
  display: block;
  font-size: clamp(2rem, 5vw, 4rem);
  font-family: var(--font-display), sans-serif;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1;
}
</style>
