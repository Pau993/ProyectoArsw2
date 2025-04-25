export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Disable SSR since this is a client-side game
  ssr: false,

  // Nitro configuration (without invalid port/host)
  nitro: {
    preset: 'node-server'
  },

  // App configuration
  app: {
    head: {
      title: 'Bus Game',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Build optimization
  vite: {
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            'game-core': [
              './utils/WebSocketService',
              './utils/Player',
              './utils/Entity'
            ]
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue']
    }
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      wsHost: process.env.WS_HOST || 'localhost:8080'
    }
  }
})