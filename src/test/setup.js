import '@testing-library/jest-dom/vitest'

window.matchMedia = window.matchMedia || function matchMediaStub() {
  return {
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}
