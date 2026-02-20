import { defineConfig } from 'vitest/config'
import { webdriverio } from '@vitest/browser-webdriverio'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['**/*.test.ts'],
          environment: 'node'
        }
      },
      {
        test: {
          name: 'browser',
          include: ['**/*.test.tsx'],
          browser: {
            enabled: true,
            provider: webdriverio(),
            instances: [{ browser: 'chrome' }]
          }
        }
      }
    ]
  }
})
