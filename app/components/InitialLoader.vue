<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const loaderRef = ref<HTMLElement | null>(null)
const colsRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.body.style.overflow = 'hidden'
  
  if (!colsRef.value || !textRef.value || !loaderRef.value) return

  const columns = colsRef.value.querySelectorAll('.loader-col')
  const chars = textRef.value.querySelectorAll('span')

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = ''
    }
  })

  tl.fromTo(chars, 
    { opacity: 0, y: 40, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.05, ease: 'back.out(1.5)' }
  )

  tl.to(chars, { 
    opacity: 0, 
    scale: 1.5, 
    filter: 'blur(10px)', 
    duration: 0.4, 
    stagger: 0.02, 
    ease: 'power3.in' 
  }, "+=0.3")

  tl.to(columns, { 
    scaleY: 0, 
    transformOrigin: 'top', 
    duration: 0.8, 
    stagger: 0.08, 
    ease: 'power4.inOut' 
  }, "-=0.2")

  tl.set(loaderRef.value, { display: 'none' })
})
</script>

<template>
  <div ref="loaderRef" class="initial-loader">
    
    <div class="loader-bg" ref="colsRef">
      <div class="loader-col" style="background-color: var(--folder-1)"></div>
      <div class="loader-col" style="background-color: var(--folder-2)"></div>
      <div class="loader-col" style="background-color: var(--folder-3)"></div>
      <div class="loader-col" style="background-color: var(--folder-4)"></div>
      <div class="loader-col" style="background-color: var(--color-text-primary)"></div>
    </div>

    <h1 ref="textRef" class="text-h1 loader-text">
      <span>f</span><span>d</span><span>i</span><span>w</span><span>a</span><span>n</span><span>g</span><span>k</span><span>a</span><span>r</span><span>a</span>
    </h1>
  </div>
</template>

<style scoped>
.initial-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-bg {
  position: absolute;
  inset: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
}

.loader-col {
  flex: 1;
  height: 100%;
  will-change: transform;
}

.loader-text {
  position: relative;
  z-index: 2;
  color: var(--surface-paper);
  display: flex;
  gap: 4px;
  overflow: hidden;
}

.loader-text span {
  display: inline-block;
  will-change: transform, opacity, filter;
}
</style>
