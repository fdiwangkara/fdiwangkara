<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '~/composables/useGsap'

const { useGsapContext } = useGsap()

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const images = [
  'foto1.JPG', 'foto2.JPG', 'foto3.JPG', 'foto4.JPG', 
  'foto5.JPG', 'foto6.JPG', 'foto7.JPG', 'foto8.JPG'
]

const refreshScrollTrigger = () => {
  if (typeof window !== 'undefined') {
    // This tells GSAP to recalculate dimensions (invalidateOnRefresh)
    window.dispatchEvent(new Event('resize'))
  }
}

useGsapContext(sectionRef, ({ gsap }) => {
  if (!trackRef.value) return

  const getScrollAmount = () => {
    return -(trackRef.value!.scrollWidth - window.innerWidth)
  }

  gsap.to(trackRef.value, {
    x: getScrollAmount,
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.value,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    }
  })
})
</script>

<template>
  <section ref="sectionRef" class="continuous-gallery section">
    <div class="gallery-track" ref="trackRef">
      
      <div class="gallery-slide intro-slide">
        <h2 class="text-h1">Visuals<br><span class="text-secondary">&amp; Photography</span></h2>
        <p class="text-body mt-8 max-w-sm">
          A collection of digital and physical works, showcasing the intersection of light, shadow, and structural form. Keep scrolling to explore the archive.
        </p>
      </div>

      <div 
        v-for="(img, i) in images" 
        :key="i"
        class="gallery-slide image-slide"
      >
        <div class="image-wrapper surface-paper">
          <NuxtImg 
            :src="`/images/${img}`" 
            :alt="`Visual ${i + 1}`" 
            format="webp"
            loading="lazy"
            @load="refreshScrollTrigger"
          />
        </div>
      </div>
      
    </div>
  </section>
</template>

<style scoped>
.continuous-gallery {
  height: 100vh;
  overflow: hidden;
}

.gallery-track {
  display: flex;
  height: 100%;
  width: max-content;
  padding: 0 10vw;
  align-items: center;
  gap: var(--space-3xl);
  will-change: transform;
}

.gallery-slide {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.intro-slide {
  width: 40vw;
  min-width: 400px;
  flex-shrink: 0;
}

.max-w-sm {
  max-width: 400px;
}

.image-slide {
  height: 70vh;
  flex-shrink: 0;
}

.image-wrapper {
  height: 100%;
  display: inline-block;
  border-radius: var(--radius-lg);
  padding: clamp(12px, 2vw, 24px);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.image-wrapper img {
  height: 100%;
  width: auto;
  object-fit: contain;
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .intro-slide {
    width: 80vw;
    min-width: 300px;
  }
  .image-slide {
    height: 50vh;
  }
}
</style>
