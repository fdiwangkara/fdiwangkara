// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo-fd.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },
  css: [
    '~/assets/css/variables.css',
    '~/assets/css/typography.css',
    '~/assets/css/base.css'
  ],
  modules: [
    'nuxt-lenis',
    '@nuxt/icon',
    '@nuxt/image'
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ]
})
