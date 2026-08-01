<script setup lang="ts">
import { ref } from 'vue'
import LiquidMenu from '~/components/nav/LiquidMenu.vue'

useSeoMeta({
  title: 'Archive | F. Diwangkara',
  description: 'Full archive of digital projects, case studies, and experiments.',
  ogTitle: 'Archive | F. Diwangkara',
  ogDescription: 'Full archive of digital projects, case studies, and experiments.',
})

const allProjects = ref([
  { id: 1, title: 'Klambi', tags: ['Flutter', 'Laravel', 'Figma'], image: 'klambi (1).png', color: 'var(--folder-1)', year: '2023-2024' },
  { id: 2, title: 'Acme', tags: ['Laravel', 'Google AppScript', 'MySQL', 'Spreadsheet', 'Figma'], image: 'acme (1).png', color: 'var(--folder-2)', year: '2024-2025' },
  { id: 3, title: 'Tayub', tags: ['Svelte', 'Figma'], image: 'tayub (1).png', color: 'var(--folder-3)', year: '2025' },
  { id: 4, title: 'Studium', tags: ['Next.js', 'Figma'], image: 'studium.png', color: 'var(--folder-4)', year: '2026' },
  { id: 5, title: 'Kangoo', tags: ['Figma'], image: 'kangoo.png', color: 'var(--folder-1)', year: '2026' },
  { id: 6, title: 'Kakidaki', tags: ['Nuxt', 'NestJS', 'Vue', 'Figma', 'Gemini AI'], image: 'kakidaki.png', color: 'var(--folder-2)', year: '2026' }
])
</script>

<template>
  <main class="archive-page">
    <LiquidMenu />
    
    <div class="archive-container container">
      <header class="archive-header">
        <NuxtLink to="/#projects" class="back-link">
          <Icon name="ph:arrow-left" /> Home
        </NuxtLink>
        <h1 class="text-massive mt-8">ARCHIVE</h1>
        <p class="text-h4 text-secondary mt-4">A complete collection of featured and experimental work.</p>
      </header>

      <div class="archive-list">
        <div class="list-header text-caption text-secondary">
          <div class="col-title">Project</div>
          <div class="col-role">Core Technologies</div>
          <div class="col-year">Year</div>
        </div>

        <NuxtLink 
          v-for="(project, i) in allProjects" 
          :key="project.id" 
          :to="`/projects/${project.id}`"
          class="list-row"
        >
          <div class="col-title text-h4">{{ project.title }}</div>
          <div class="col-role">
            <span v-for="tag in project.tags" :key="tag" class="tech-tag">{{ tag }}</span>
          </div>
          <div class="col-year font-mono text-secondary">{{ project.year || '2024' }}</div>
          <div class="col-arrow">
            <Icon name="ph:arrow-up-right" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.archive-page {
  min-height: 100vh;
  background-color: var(--bg-hero);
  padding: 15vh 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--color-text-primary);
}

.archive-header {
  margin-bottom: var(--space-3xl);
}

.archive-list {
  display: flex;
  flex-direction: column;
  margin-top: var(--space-2xl);
  border-top: 1px solid var(--color-border);
}

.list-header {
  display: grid;
  grid-template-columns: 2.5fr 2fr 1fr 40px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.list-row {
  display: grid;
  grid-template-columns: 2.5fr 2fr 1fr 40px;
  align-items: center;
  padding: 32px 24px;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease;
}

.list-row:hover {
  background-color: var(--surface-paper);
}

.col-role {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.col-arrow {
  text-align: right;
  font-size: 24px;
  color: var(--color-text-secondary);
  transition: transform 0.3s ease, color 0.3s ease;
}

.list-row:hover .col-arrow {
  transform: translate(4px, -4px);
  color: var(--color-text-primary);
}

.font-mono {
  font-family: var(--font-mono);
}

.tech-tag {
  padding: 4px 10px;
  background: rgba(0,0,0,0.03);
  border-radius: var(--radius-pill);
  font-size: var(--text-micro);
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .list-header {
    display: none;
  }
  .list-row {
    grid-template-columns: 1fr 40px;
    grid-template-rows: auto auto auto;
    gap: 8px;
  }
  .col-title { grid-column: 1 / 2; grid-row: 1; }
  .col-role { grid-column: 1 / 2; grid-row: 2; margin-top: 8px; }
  .col-year { grid-column: 1 / 2; grid-row: 3; }
  .col-arrow { grid-column: 2 / 3; grid-row: 1 / 4; align-self: center; }
}
</style>
