import '@testing-library/jest-dom'

window.matchMedia = window.matchMedia || function matchMediaStub() {
  return {
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}
