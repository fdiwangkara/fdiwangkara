<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGsap } from '~/composables/useGsap'
import { useRoute, useRouter } from 'vue-router'
import ContinuousHero from '~/components/hero/ContinuousHero.vue'
import ContinuousShowcase from '~/components/showcase/ContinuousShowcase.vue'
import ContinuousGallery from '~/components/gallery/ContinuousGallery.vue'
import ContinuousContact from '~/components/contact/ContinuousContact.vue'
import LiquidMenu from '~/components/nav/LiquidMenu.vue'

useSeoMeta({
  title: 'fdiwangkara',
  description: 'Junior Developer & Part-time learner crafting minimalist digital experiences.',
  ogTitle: 'fdiwangkara',
  ogDescription: 'Junior Developer & Part-time learner crafting minimalist digital experiences.',
  twitterCard: 'summary_large_image',
})

const { useGsapContext } = useGsap()
const route = useRoute()
const router = useRouter()

const orchestratorRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)

const projects = ref([
  {
    id: 1,
    title: 'Klambi',
    description: 'Mobile apps project with 2 other friends. Helps grafika production major for custom design shirt orders.',
    year: '2023-2024',
    category: 'Mobile App',
    image: 'klambi (1).png',
    tags: ['Flutter', 'Laravel', 'Figma']
  },
  {
    id: 2,
    title: 'Acme',
    description: 'Internship project. A website to hold sales reports with various graphs, connected to their CRM.',
    year: '2024-2025',
    category: 'Fullstack Web',
    image: 'acme (1).png',
    tags: ['Laravel', 'Google AppScript', 'MySQL', 'Google Spreadsheet', 'Figma']
  },
  {
    id: 3,
    title: 'Tayub',
    description: 'Website for a friend who needs a website for traditional events in their local area.',
    year: '2025',
    category: 'Web Development',
    image: 'tayub (1).png',
    tags: ['Svelte', 'Figma']
  },
  {
    id: 4,
    title: 'Studium',
    description: 'Productivity website for students with a gamified concept following Nintendo or Steamdeck design flow. 2nd Place Winner.',
    year: '2026',
    category: 'Web Application',
    image: 'studium.png',
    tags: ['Next.js', 'Figma']
  },
  {
    id: 5,
    title: 'Kangoo',
    description: 'FindIt UI/UX Design Competition. Case study: helping people addicted to online loans manage finances, pay off debt, and save for the future.',
    year: '2026',
    category: 'UI/UX Design',
    image: 'kangoo.png',
    tags: ['Figma']
  },
  {
    id: 6,
    title: 'Kakidaki',
    description: 'GarudaHack Hackathon. Case study: website for beginner hikers who don\'t know what preparations to make.',
    year: '2026',
    category: 'Frontend Web',
    image: 'kakidaki.png',
    tags: ['Nuxt', 'NestJS', 'Vue', 'Figma', 'Gemini AI']
  }
])

useGsapContext(orchestratorRef, ({ gsap, ScrollTrigger }) => {
  ScrollTrigger.create({
    trigger: '.continuous-showcase',
    start: 'top 50%',
    end: 'top top',
    scrub: true,
    animation: gsap.to(bgRef.value, { backgroundColor: 'var(--bg-showcase)', ease: 'none' })
  })

  ScrollTrigger.create({
    trigger: '.archive-section',
    start: 'top 60%',
    end: 'bottom top',
    scrub: true,
    animation: gsap.to(bgRef.value, { backgroundColor: 'var(--bg-gallery)', ease: 'none' })
  })

  ScrollTrigger.create({
    trigger: '.continuous-contact',
    start: 'top 50%',
    end: 'top top',
    scrub: true,
    animation: gsap.to(bgRef.value, { backgroundColor: 'var(--bg-contact)', ease: 'none' })
  })

  if (route.hash) {
    const targetHash = route.hash
    router.replace({ hash: '' })
    
    setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      const el = document.querySelector(targetHash)
      if (el) {
        const st = ScrollTrigger.getAll().find(t => t.trigger === el)
        const targetY = st ? st.start : el.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    }, 600)
  }

  const resizeObserver = new ResizeObserver(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  })
  
  if (orchestratorRef.value) {
    resizeObserver.observe(orchestratorRef.value)
  }

  [100, 500, 1500].forEach(delay => {
    setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, delay)
  })
})
</script>

<template>
  <div ref="bgRef" class="global-background"></div>
  
  <main ref="orchestratorRef" class="master-orchestrator">
    <LiquidMenu />
    
    <ContinuousHero />
    <ContinuousShowcase :projects="projects.slice(0, 4)" id="projects" />
    
    <section class="archive-section">
      <NuxtLink to="/projects" class="archive-link">
        View Full Archive <span class="iconify i-ph:arrow-right"></span>
      </NuxtLink>
    </section>

    <ContinuousGallery id="visuals" />
    <ContinuousContact id="contact" />
  </main>
</template>

<style scoped>
.global-background {
  position: fixed;
  inset: 0;
  z-index: -10;
  background-color: var(--bg-hero);
  pointer-events: none;
}

.master-orchestrator {
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.archive-section {
  height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.archive-link {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  transition: all 0.3s ease;
}

.archive-link:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
  background: var(--surface-paper);
}
</style>
