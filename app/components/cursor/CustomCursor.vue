<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCustomCursor } from '~/composables/useCustomCursor'

const { cursor, initCursor } = useCustomCursor()

const cursorEl = ref<HTMLElement | null>(null)
const cursorDot = ref<HTMLElement | null>(null)
let gsap: any = null
let rafId: number | null = null
let lastX = 0
let lastY = 0

const cursorStyle = computed(() => ({
  transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
  opacity: cursor.isHidden ? 0 : 1,
  mixBlendMode: cursor.blend,
}))

const dotScale = computed(() => {
  return cursor.isHovering ? cursor.scale : 1
})

onMounted(async () => {
  await initCursor()

  if (import.meta.server) return

  const gsapModule = await import('gsap')
  gsap = gsapModule.gsap

  const updateStretch = () => {
    if (!cursorDot.value || !gsap) return

    const dx = cursor.x - lastX
    const dy = cursor.y - lastY
    const velocity = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const stretch = Math.min(velocity * 0.015, 0.6)

    gsap.to(cursorDot.value, {
      scaleX: 1 + stretch,
      scaleY: 1 - stretch * 0.5,
      rotation: angle,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    lastX = cursor.x
    lastY = cursor.y
    rafId = requestAnimationFrame(updateStretch)
  }

  rafId = requestAnimationFrame(updateStretch)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    v-if="!cursor.isHidden"
    ref="cursorEl"
    class="custom-cursor"
    :style="cursorStyle"
    aria-hidden="true"
  >
    <div
      ref="cursorDot"
      class="cursor-dot"
      :class="{ 'is-hovering': cursor.isHovering }"
      :style="{
        '--dot-scale': dotScale,
      }"
    >
      <span
        class="cursor-label"
        :class="{ 'is-visible': cursor.label }"
      >
        {{ cursor.label }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
  will-change: transform, opacity;
  transition: opacity 0.3s ease;
}

.cursor-dot {
  position: relative;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  background-color: var(--color-text-primary);
  transform: scale(var(--dot-scale, 1));
  transition:
    transform 0.4s var(--ease-elastic),
    background-color 0.3s ease,
    width 0.4s var(--ease-elastic),
    height 0.4s var(--ease-elastic);
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-dot.is-hovering {
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  background-color: var(--color-accent);
  border-radius: 50%;
}

.cursor-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-elastic);
  white-space: nowrap;
}

.cursor-label.is-visible {
  opacity: 1;
  transform: scale(1);
}

@media (hover: none) and (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
</style>
