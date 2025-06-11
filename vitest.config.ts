import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
    setupFiles: ['./src/dashboard/setupTests.ts'],
  },
})
