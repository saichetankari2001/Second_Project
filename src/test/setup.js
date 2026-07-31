import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

window.matchMedia = window.matchMedia || function matchMediaStub() {
  return {
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}

window.requestAnimationFrame =
  window.requestAnimationFrame || ((callback) => setTimeout(callback, 16))
window.cancelAnimationFrame =
  window.cancelAnimationFrame || ((id) => clearTimeout(id))
