<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '~/composables/useGsap'
import DecryptedText from '~/components/bits/DecryptedText.vue'
import CurvedLoop from '~/components/bits/CurvedLoop.vue'

const heroRef = ref<HTMLElement | null>(null)
const subtitleWordsRef = ref<HTMLElement[]>([])
const titleContainerRef = ref<HTMLElement | null>(null)

const subtitleWords = "Junior Developer & Part time learner".split(' ')

const { useGsapContext } = useGsap()

const setSubtitleWordRef = (el: any, i: number) => {
  if (el) subtitleWordsRef.value[i] = el
}

useGsapContext(heroRef, ({ gsap }) => {
  gsap.set(subtitleWordsRef.value, { opacity: 0, y: 20 })

  gsap.to(subtitleWordsRef.value, {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    ease: 'power2.out',
    duration: 1,
    delay: 2
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroRef.value,
      start: 'top top',
      end: '+=200%', 
      pin: true,
      scrub: 1,
    }
  })

  tl.to(titleContainerRef.value, {
    scale: 0.6,
    y: '-15vh',
    opacity: 0,
    ease: 'power2.inOut',
    duration: 1
  })
})
</script>

<template>
  <section ref="heroRef" class="continuous-hero section">
    
    <div ref="titleContainerRef" class="hero-content container">
      
      <h1 class="text-massive hero-statement">
        <DecryptedText 
          text="fdiwangkara" 
          :speed="80"
          :maxIterations="15"
          animateOn="hover"
          className="revealed"
          encryptedClassName="encrypted"
        />
      </h1>
      
      <p class="text-h4 mt-4 text-secondary subtitle-statement">
        <span
          v-for="(word, i) in subtitleWords"
          :key="'sub'+i"
          :ref="el => setSubtitleWordRef(el, i)"
          class="hero-word"
        >
          {{ word }}&nbsp;
        </span>
      </p>

      <div class="curved-wrapper">
        <ClientOnly>
          <CurvedLoop 
            marqueeText="VUE ✦ NUXT ✦ THREE.JS ✦ GSAP ✦ TYPESCRIPT ✦ FIGMA ✦ "
            :speed="2"
            :curveAmount="200"
            className="text-secondary"
          />
        </ClientOnly>
      </div>

      <div class="logo-static mt-12">
        <div class="static-track">
          <img src="/images/binuslogo.png" alt="Binus University" class="company-logo logo-binus" />
          <span class="static-item text-caption text-secondary">&bull;</span>
          <img src="/images/acmelogo.png" alt="Acme" class="company-logo" />
          <span class="static-item text-caption text-secondary">&bull;</span>
          <img src="/images/gdgoc.svg" alt="GDGOC" class="company-logo" />
        </div>
      </div>
      
    </div>
  </section>
</template>

<style scoped>
.continuous-hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform, opacity;
  width: 100%;
}

.curved-wrapper {
  width: 100vw;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.hero-statement {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  white-space: pre-wrap;
  color: var(--color-text-primary);
  line-height: 0.95;
  word-break: break-word;
  max-width: 95vw;
  user-select: none;
  cursor: pointer;
}

.subtitle-statement {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
  margin-top: 1.5rem;
}

.hero-word {
  display: inline-block;
  will-change: opacity, transform;
}

.logo-static {
  width: 100%;
  max-width: 800px;
  margin-top: 4rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.static-track {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.static-item {
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  font-weight: 500;
  opacity: 0.7;
}

.company-logo {
  height: 64px;
  width: auto;
  object-fit: contain;
  opacity: 0.7;
  filter: grayscale(100%) brightness(1.5);
  transition: all 0.3s ease;
}

.company-logo:hover {
  opacity: 1;
  filter: grayscale(0%) brightness(1);
}

.logo-binus {
  height: 96px;
  margin: 0 0.5rem;
}

@media (max-width: 600px) {
  .logo-static {
    margin-top: 2rem;
    padding: 1rem 0;
  }
  
  .static-track {
    gap: 1rem;
  }
  
  .company-logo {
    height: 28px;
  }
  
  .logo-binus {
    height: 44px;
    margin: 0;
  }
}
</style>
