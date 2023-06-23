// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  nitro: {
    storage: {
      data: { driver: 'vercelKV' }
    }
  },
  css: [
    "@/assets/css/main.css"
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    ['@nuxtjs/google-fonts', {
      families: {
        'Nunito': true,
        download: true,
        inject: true
      }
    }]
  ]
})
