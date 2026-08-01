<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
})
</script>

<template>
  <lenis :options="{ smoothWheel: true, duration: 1.2, autoRaf: true }">
    <div id="app-root">
      <InitialLoader />
      <CustomCursor />
      <NuxtPage />
    </div>
  </lenis>
</template>

<style>
#app-root {
  min-height: 100vh;
}
</style>
