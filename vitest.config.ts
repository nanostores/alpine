import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['directive/index.js', 'magic/index.js', 'with-stores/index.js'],
      thresholds: {
        lines: 100
      }
    },
    environment: 'happy-dom'
  }
})
