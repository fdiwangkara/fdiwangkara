<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useGsap } from '~/composables/useGsap'
import LiquidMenu from '~/components/nav/LiquidMenu.vue'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id

const allProjects = [
  { id: '1', title: 'Klambi', category: 'Mobile App', year: '2023-2024', role: 'Mobile Dev', stack: ['Flutter', 'Laravel', 'Figma'], image: 'klambi (1).png',
    content1: 'A collaborative mobile application built to streamline custom shirt design orders for the graphic production major.',
    content2: 'Developed in a team of three over the course of 2023-2024, Klambi bridges the gap between students and the production department. The app was designed in Figma, built with Flutter for a smooth cross-platform mobile experience, and powered by a robust Laravel backend.' },
  { id: '2', title: 'Acme', category: 'Fullstack Web', year: '2024-2025', role: 'Fullstack Dev', stack: ['Laravel', 'Google AppScript', 'MySQL', 'Spreadsheet', 'Figma'], image: 'acme (1).png',
    content1: 'A solo fullstack internship project focused on building a comprehensive sales reporting dashboard connected directly to the company\'s CRM.',
    content2: 'The system automates data synchronization using Google AppScript and Google Spreadsheets, storing historical data in MySQL. Built with Laravel, the dashboard provides interactive graphs and real-time insights, significantly improving the sales team\'s reporting efficiency.' },
  { id: '3', title: 'Tayub', category: 'Web Development', year: '2025', role: 'Web Dev', stack: ['Svelte', 'Figma'], image: 'tayub (1).png',
    content1: 'A localized cultural platform built to promote and manage traditional events in the surrounding community.',
    content2: 'Designed from the ground up in Figma and implemented with Svelte, Tayub provides a lightning-fast, highly interactive experience. The project was initiated to help a friend digitalize their local traditional events, ensuring cultural preservation with a modern digital touch.' },
  { id: '4', title: 'Studium', category: 'Web Application', year: '2026', role: 'Frontend Dev', stack: ['Next.js', 'Figma'], image: 'studium.png',
    content1: 'An award-winning gamified productivity platform for students, heavily inspired by the UI/UX flows of the Nintendo Switch and Steam Deck.',
    content2: 'Created by a team of three, Studium transforms mundane study tasks into engaging quests. We secured 2nd place in a national web development competition by utilizing Next.js for seamless performance and creating a highly playful, console-like design system in Figma.' },
  { id: '5', title: 'Kangoo', category: 'UI/UX Design', year: '2026', role: 'UI/UX Designer', stack: ['Figma'], image: 'kangoo.png',
    content1: 'A comprehensive UI/UX case study designed for the FindIt competition, addressing the rising issue of online loan (pinjol) addiction.',
    content2: 'Kangoo focuses on financial rehabilitation by helping users track their debts, manage daily finances, and set saving goals. The design system emphasizes empathy, clear data visualization, and positive reinforcement to guide users toward financial stability.' },
  { id: '6', title: 'Kakidaki', category: 'Frontend Web', year: '2026', role: 'Frontend Dev', stack: ['Nuxt', 'NestJS', 'Vue', 'Figma', 'Gemini AI'], image: 'kakidaki.png',
    content1: 'A hackathon-winning platform built during GarudaHack, aimed at helping beginner hikers prepare safely for their outdoor adventures.',
    content2: 'Powered by Gemini AI, Kakidaki generates personalized hiking preparation guides, gear checklists, and safety protocols based on the chosen trail. Built using a modern stack of Nuxt, Vue, and NestJS, it delivers real-time AI assistance in a highly accessible interface.' }
]

const projectData = allProjects.find(p => p.id === projectId) || allProjects[0]

const pageRef = ref<HTMLElement | null>(null)
const { useGsapContext } = useGsap()

useGsapContext(pageRef, ({ gsap }) => {
  const tl = gsap.timeline()
  
  tl.fromTo('.anim-up', 
    { y: 60, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'power3.out', duration: 1.2, delay: 0.2 }
  )
  
  tl.fromTo('.hero-parallax-img',
    { scale: 1.1, filter: 'blur(20px)' },
    { scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
    '<0.2'
  )
  
  tl.fromTo('.bento-card',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'back.out(1.2)' },
    '<0.4'
  )

  gsap.to('.hero-parallax-img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.detail-hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
})

const goBack = () => {
  router.push('/projects')
}
</script>

<template>
  <main ref="pageRef" class="project-detail-page">
    <LiquidMenu />
    
    <div class="container pt-32">
      <button @click="goBack" class="back-btn anim-up text-caption">
        <Icon name="ph:arrow-left" /> Back to Showcase
      </button>

      <header class="project-header mt-12 anim-up">
        <h1 class="text-massive">{{ projectData.title }}</h1>
      </header>

      <section class="detail-hero-section mt-12 anim-up">
        <div class="parallax-wrapper surface-paper">
          <NuxtImg 
            :src="`/images/${projectData.image}`" 
            class="hero-parallax-img" 
            format="webp"
            loading="lazy"
            onerror="this.src='/images/project-1.png'" 
          />
          <div class="glass-overlay"></div>
        </div>
      </section>

      <section class="bento-grid mt-12">
        <div class="bento-card">
          <span class="bento-label text-caption text-secondary">Year</span>
          <p class="bento-value text-h4">{{ projectData.year }}</p>
        </div>
        <div class="bento-card">
          <span class="bento-label text-caption text-secondary">Role</span>
          <p class="bento-value text-h4">{{ projectData.role }}</p>
        </div>
        <div class="bento-card col-span-2">
          <span class="bento-label text-caption text-secondary">Technologies</span>
          <div class="bento-tags mt-2">
            <span v-for="tag in projectData.stack" :key="tag" class="tech-tag">{{ tag }}</span>
          </div>
        </div>
      </section>

      <section class="editorial-content mt-24 pb-32 anim-up">
        <div class="content-col text-h3">
          <p>{{ projectData.content1 }}</p>
        </div>
        <div class="content-col text-body text-secondary mt-8">
          <p>{{ projectData.content2 }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  background-color: var(--bg-hero);
}

.pt-32 { padding-top: 8rem; }
.pb-32 { padding-bottom: 8rem; }
.mt-8 { margin-top: 2rem; }
.mt-12 { margin-top: 3rem; }
.mt-24 { margin-top: 6rem; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: var(--color-text-primary);
}

.project-header h1 {
  word-break: break-word;
  max-width: 900px;
}

.detail-hero-section {
  position: relative;
  width: 100%;
  height: 65vh;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.parallax-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

.hero-parallax-img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  position: absolute;
  top: -10%;
  will-change: transform;
}

.glass-overlay {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1);
  pointer-events: none;
  border-radius: var(--radius-lg);
  z-index: 2;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.bento-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
}

.col-span-2 {
  grid-column: span 2;
}

.bento-label {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 8px;
}

.bento-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 12px;
  background: rgba(0,0,0,0.05);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  border: 1px solid rgba(0,0,0,0.1);
}

.editorial-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1100px;
}

.content-col p {
  font-family: var(--font-mono);
  line-height: 1.5;
  font-size: 16px;
}

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
  }
  .editorial-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
