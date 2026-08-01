<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const scrollTo = (hash: string) => {
  isOpen.value = false
  
  setTimeout(() => {
    if (hash === '#__nuxt') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (window.location.pathname !== '/') {
      router.push({ path: '/', hash })
      return
    }

    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, 400)
}
</script>

<template>
  <div class="trionn-menu-container">
    <button 
      class="trionn-trigger" 
      @click="isOpen = !isOpen" 
      :class="{ 'is-open': isOpen }"
      aria-label="Toggle Menu"
    >
      <div class="burger-lines">
        <span class="line line-1"></span>
        <span class="line line-2"></span>
      </div>
    </button>

    <div class="trionn-overlay" :class="{ 'is-active': isOpen }">
      <nav class="overlay-nav">
        <ul class="overlay-list">
          <li class="overlay-item">
            <a @click.prevent="scrollTo('#__nuxt')" class="overlay-link">
              <span class="nav-text">Home</span>
            </a>
          </li>
          <li class="overlay-item">
            <a @click.prevent="scrollTo('#projects')" class="overlay-link">
              <span class="nav-text">Work</span>
            </a>
          </li>
          <li class="overlay-item">
            <a @click.prevent="scrollTo('#visuals')" class="overlay-link">
              <span class="nav-text">Visuals</span>
            </a>
          </li>
          <li class="overlay-item">
            <a @click.prevent="scrollTo('#contact')" class="overlay-link">
              <span class="nav-text">Contact</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="overlay-footer">
        <p class="footer-title">Business Enquiry</p>
        <a href="mailto:fdiwangkara2412@gmail.com" class="footer-link">fdiwangkara2412@gmail.com</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trionn-trigger {
  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 10000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg-hero);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s var(--ease-out-expo);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.trionn-trigger:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.burger-lines {
  width: 24px;
  height: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-text-primary);
  transition: transform 0.4s var(--ease-out-expo), opacity 0.4s var(--ease-out-expo);
  transform-origin: center;
}

.trionn-trigger.is-open .line-1 {
  transform: translateY(5px) rotate(45deg);
}

.trionn-trigger.is-open .line-2 {
  transform: translateY(-5px) rotate(-45deg);
}

.trionn-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-text-primary);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 6rem);
  -webkit-clip-path: circle(0% at calc(100% - 60px) 60px);
  clip-path: circle(0% at calc(100% - 60px) 60px);
  transition: clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1), -webkit-clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1);
  will-change: clip-path, -webkit-clip-path;
  pointer-events: none;
}

.trionn-overlay.is-active {
  -webkit-clip-path: circle(150% at calc(100% - 60px) 60px);
  clip-path: circle(150% at calc(100% - 60px) 60px);
  pointer-events: auto;
}

.overlay-nav {
  margin-top: auto;
  margin-bottom: auto;
}

.overlay-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overlay-item {
  overflow: hidden;
}

.overlay-link {
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  color: var(--bg-hero);
  text-decoration: none;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.6s var(--ease-out-expo), opacity 0.6s ease;
  position: relative;
}

.overlay-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 4px;
  background: var(--bg-hero);
  transition: width 0.4s var(--ease-out-expo);
}

.overlay-link:hover::after {
  width: 100%;
}

.trionn-overlay.is-active .overlay-link {
  transform: translateY(0);
  opacity: 1;
}

.trionn-overlay.is-active .overlay-item:nth-child(1) .overlay-link { transition-delay: 0.3s; }
.trionn-overlay.is-active .overlay-item:nth-child(2) .overlay-link { transition-delay: 0.35s; }
.trionn-overlay.is-active .overlay-item:nth-child(3) .overlay-link { transition-delay: 0.4s; }
.trionn-overlay.is-active .overlay-item:nth-child(4) .overlay-link { transition-delay: 0.45s; }

.overlay-footer {
  margin-top: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s var(--ease-out-expo);
  transition-delay: 0.5s;
}

.trionn-overlay.is-active .overlay-footer {
  opacity: 1;
  transform: translateY(0);
}

.footer-title {
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.footer-link {
  font-family: var(--font-mono);
  color: var(--bg-hero);
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 0.7;
}

@media (max-width: 600px) {
  .trionn-trigger {
    top: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
  .overlay-link {
    font-size: 3rem;
  }
}
</style>
