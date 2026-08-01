<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '~/composables/useGsap'

const props = defineProps({
  projects: {
    type: Array as () => any[],
    required: true
  }
})

const { useGsapContext } = useGsap()

const sectionRef = ref<HTMLElement | null>(null)
const folderRefs = ref<HTMLElement[]>([])
const docRefs = ref<HTMLElement[]>([])
const imageRefs = ref<HTMLElement[]>([])
const ctaRefs = ref<HTMLElement[]>([])

const setFolderRef = (el: any, i: number) => { if(el) folderRefs.value[i] = el }
const setDocRef = (el: any, i: number) => { if(el) docRefs.value[i] = el }
const setImageRef = (el: any, i: number) => { if(el) imageRefs.value[i] = el }
const setCtaRef = (el: any, i: number) => { if(el) ctaRefs.value[i] = el }

useGsapContext(sectionRef, ({ gsap }) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: `+=${props.projects.length * 250}%`,
      pin: true,
      scrub: 1,
    }
  })

  props.projects.forEach((_, i) => {
    gsap.set(folderRefs.value[i], { y: i * 8 })
    
    gsap.set(docRefs.value[i], { y: 60, opacity: 0, filter: 'blur(8px)' })
    
    gsap.set(imageRefs.value[i], { filter: 'blur(20px)', scale: 1.05 })
    
    const f = folderRefs.value[i]
    if (f) {
      const words = f.querySelectorAll('.doc-word')
      gsap.set(words, { opacity: 0.3, filter: 'blur(2px)' })
      
      const tags = f.querySelectorAll('.tech-tag')
      gsap.set(tags, { y: 15, opacity: 0 })
    }
    
    gsap.set(ctaRefs.value[i], { y: 10, opacity: 0 })
  })

  props.projects.forEach((_, i) => {
    const f = folderRefs.value[i]
    const d = docRefs.value[i]
    const img = imageRefs.value[i]
    const words = f ? f.querySelectorAll('.doc-word') : []
    const tags = f ? f.querySelectorAll('.tech-tag') : []
    const cta = ctaRefs.value[i]

    const t = i * 10

    tl.to(f, { 
      y: -20, 
      boxShadow: 'var(--shadow-lifted)', 
      ease: 'back.out(1.7)', 
      duration: 1.5 
    }, t)
    
    tl.to(d, { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)', 
      ease: 'back.out(1.4)', 
      duration: 2 
    }, t + 0.5)
    
    tl.to(img, { 
      filter: 'blur(0px)', 
      scale: 1, 
      ease: 'power2.inOut', 
      duration: 2 
    }, t + 1)
    
    if (words.length) {
      tl.to(words, { 
        opacity: 1, 
        filter: 'blur(0px)', 
        stagger: 0.05, 
        ease: 'power1.out', 
        duration: 1.5 
      }, t + 1.5)
    }
    
    if (tags.length) {
      tl.to(tags, { 
        y: 0, 
        opacity: 1, 
        stagger: 0.08, 
        ease: 'back.out(1.5)', 
        duration: 1 
      }, t + 2)
    }
    
    tl.to(cta, { 
      y: 0, 
      opacity: 1, 
      ease: 'back.out(1.2)', 
      duration: 1 
    }, t + 2.5)

    tl.to({}, { duration: 3 }, t + 3.5)

    if (i < props.projects.length - 1) {
      tl.to(d, { 
        y: 40, 
        opacity: 0, 
        filter: 'blur(8px)', 
        ease: 'power2.in', 
        duration: 1.5 
      }, t + 6.5)
      
      tl.to(f, { 
        y: '-120vh', 
        opacity: 0, 
        ease: 'power2.in', 
        duration: 2 
      }, t + 7.5)
    }
  })
})
</script>

<template>
  <section ref="sectionRef" class="continuous-showcase section">
    <div class="workspace-desk container">
      
      <div 
        v-for="(project, i) in projects" 
        :key="project.id" 
        class="folder-wrapper"
        :ref="el => setFolderRef(el, i)"
        :style="{ zIndex: projects.length - i }"
      >
        
        <div 
          class="folder-tab"
          :style="{ backgroundColor: `var(--folder-${(i % 4) + 1})` }"
        >
          <span class="iconify i-ph:folder-open folder-icon"></span>
          <span class="tab-title">{{ project.title }}</span>
        </div>
        
        <div 
          class="folder-body"
          :style="{ backgroundColor: `var(--folder-${(i % 4) + 1})` }"
        >
          <div class="project-document surface-paper" :ref="el => setDocRef(el, i)">
            
            <div class="doc-media">
              
              <div class="browser-header">
                <div class="window-controls">
                  <span class="control-dot close"></span>
                  <span class="control-dot minimize"></span>
                  <span class="control-dot maximize"></span>
                </div>
                <div class="browser-url">local.dev/{{ project.title.toLowerCase().replace(' ', '-') }}</div>
                <div style="width: 42px;"></div>
              </div>
              
              <NuxtImg 
                :src="`/images/${project.image}`" 
                class="doc-image" 
                :ref="el => setImageRef(el, i)" 
                format="webp"
                loading="lazy"
                onerror="this.src='/images/project-1.png'"
              />
              
            </div>
            
            <div class="doc-content">
              <header>
                <div class="doc-meta text-caption text-secondary mb-2">{{ project.category }} — {{ project.year }}</div>
                <h3 class="text-h2">{{ project.title }}</h3>
              </header>
              <p class="doc-desc text-secondary">{{ project.description }}</p>
              
              <div class="doc-tags">
                <span v-for="tag in project.tags" :key="tag" class="tech-tag">{{ tag }}</span>
              </div>
              
              <div class="doc-cta mt-6" :ref="el => setCtaRef(el, i)">
                <NuxtLink :to="`/projects/${project.id}`" class="view-project-link">
                  View Case Study <span class="iconify i-ph:arrow-right view-arrow"></span>
                </NuxtLink>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
      
    </div>
  </section>
</template>

<style scoped>
.continuous-showcase {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.workspace-desk {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
}

.folder-wrapper {
  position: absolute;
  top: max(10vh, 80px);
  width: 90vw;
  max-width: 1100px;
  height: clamp(60vh, 75vh, 800px);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-folder);
  border-radius: var(--radius-lg);
  will-change: transform, box-shadow;
}

.folder-tab {
  align-self: flex-start;
  padding: 10px 24px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--folder-text-light);
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: inset 0 -2px 10px rgba(0,0,0,0.05);
}

.folder-icon {
  font-size: 1.25rem;
}

.folder-body {
  flex: 1;
  border-radius: 0 var(--radius-lg) var(--radius-lg) var(--radius-lg);
  padding: clamp(16px, 3vw, 32px);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 20px rgba(0,0,0,0.05);
}

.project-document {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-paper);
  display: flex;
  overflow: hidden;
  will-change: transform, opacity, filter;
  min-height: 0;
}

.doc-media {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
  cursor: pointer;
  background: var(--surface-paper);
}

.browser-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 5;
}

.window-controls {
  display: flex;
  gap: 6px;
  width: 42px;
}

.control-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.control-dot.close { background: #ff5f56; }
.control-dot.minimize { background: #ffbd2e; }
.control-dot.maximize { background: #27c93f; }

.browser-url {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.doc-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.2), transparent 50%);
  pointer-events: none;
  z-index: 1;
}

.doc-media::before {
  content: '';
  position: absolute;
  inset: 12px;
  top: 48px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
  z-index: 2;
  pointer-events: none;
  box-shadow: inset 0 0 20px rgba(255,255,255,0.05);
}

.doc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: filter, transform;
  transition: transform 0.6s var(--ease-out-expo);
  padding-top: 36px;
}

.folder-wrapper:hover .doc-image {
  transform: scale(1.05);
}

.doc-content {
  flex: 1;
  padding: clamp(32px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  background: var(--bg-hero);
  min-height: 0;
}

.doc-desc {
  font-family: var(--font-mono); /* Force Manrope */
  line-height: 1.6;
  font-size: 16px;
  margin-top: 32px;
}

.doc-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 48px;
}

.tech-tag {
  padding: 6px 14px;
  background: rgba(0,0,0,0.03);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono); /* Force Manrope */
  font-size: var(--text-micro);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  will-change: transform, opacity;
}

.doc-cta {
  margin-top: auto; 
  padding-top: clamp(16px, 3vw, 24px);
}

.view-project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  will-change: opacity, transform;
}

.view-arrow {
  transition: transform 0.3s var(--ease-out-expo);
}

.view-project-link:hover .view-arrow {
  transform: translateX(4px);
}

@media (max-width: 800px) {
  .folder-wrapper {
    top: max(10vh, 70px);
    width: 92vw;
    height: 82vh;
  }
  
  .project-document {
    flex-direction: column;
  }
  
  .doc-media {
    flex: 0 0 35%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
  
  .doc-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-bottom: 48px;
  }
  
  .doc-title {
    font-size: var(--text-h3);
  }
  
  .doc-desc {
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .doc-tags {
    margin-top: 24px;
  }
  
  .doc-cta {
    margin-top: 24px;
    padding-bottom: 16px;
  }
}
</style>
