<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '~/composables/useGsap'

const { useGsapContext } = useGsap()

const sectionRef = ref<HTMLElement | null>(null)
const wordsRef = ref<HTMLElement[]>([])
const buttonRef = ref<HTMLElement | null>(null)

const titleWords = "LET'S CREATE".split(' ')

const setWordRef = (el: any, i: number) => {
  if (el) wordsRef.value[i] = el
}

useGsapContext(sectionRef, ({ gsap }) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 50%',
      end: 'bottom bottom',
      scrub: 1,
    }
  })

  gsap.set(wordsRef.value, { opacity: 0.3, filter: 'blur(4px)' })
  
  tl.to(wordsRef.value, {
    opacity: 1,
    filter: 'blur(0px)',
    stagger: 0.1,
    ease: 'power1.out',
    duration: 1
  }, 0)

  tl.from(buttonRef.value, {
    scale: 0.95,
    opacity: 0,
    ease: 'back.out(1.5)',
    duration: 1
  }, 0.5)
})
</script>

<template>
  <section ref="sectionRef" class="continuous-contact section">
    <div class="contact-content container">
      
      <h2 class="text-massive contact-title">
        <span
          v-for="(word, i) in titleWords"
          :key="i"
          :ref="el => setWordRef(el, i)"
          class="contact-word"
        >
          {{ word }}&nbsp;
        </span>
      </h2>
      
      <div ref="buttonRef" class="contact-action mt-8">
        <NuxtLink to="mailto:fdiwangkara2412@gmail.com" class="primary-btn spring-btn" style="text-decoration: none; display: inline-block;">
          Start a Conversation
        </NuxtLink>
      </div>

      <div class="social-links mt-12">
        <NuxtLink to="https://instagram.com/fdiwangkara" target="_blank">Insta</NuxtLink>
        <NuxtLink to="https://www.linkedin.com/in/filemon-diwangkara-bani-saptaji-21641b297" target="_blank">LinkedIn</NuxtLink>
        <NuxtLink to="https://github.com/fdiwangkara" target="_blank">Github</NuxtLink>
      </div>
      
    </div>
  </section>
</template>

<style scoped>

.continuous-contact {
  min-height: 100vh;
  padding: 20vh 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.contact-title {
  color: var(--color-text-primary);
  line-height: 0.9;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-word {
  display: inline-block;
  will-change: filter, opacity;
}

.contact-action {
  margin-top: var(--space-xl);
}

.spring-btn {
  padding: clamp(16px, 3vw, 24px) clamp(32px, 6vw, 64px);
  background: var(--color-text-primary);
  color: var(--surface-paper);
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: clamp(1.1rem, 2vw, var(--text-h4));
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
  will-change: transform;
}

.spring-btn:hover {
  transform: scale(1.05);
  background: var(--color-accent);
}

.spring-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

.social-links {
  display: flex;
  gap: var(--space-2xl);
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--text-body);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: var(--space-xl);
}

.social-links a {
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--color-text-primary);
}
</style>
