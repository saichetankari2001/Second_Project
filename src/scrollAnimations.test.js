import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate, mockFromTo, mockRegisterPlugin } = vi.hoisted(() => ({
  mockCreate: vi.fn(() => ({ kill: vi.fn() })),
  mockFromTo: vi.fn(() => ({ scrollTrigger: { kill: vi.fn() } })),
  mockRegisterPlugin: vi.fn(),
}))

vi.mock('gsap', () => ({
  default: {
    registerPlugin: mockRegisterPlugin,
    fromTo: mockFromTo,
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: mockCreate },
}))

import { initScrollAnimations } from './scrollAnimations'

describe('initScrollAnimations', () => {
  beforeEach(() => {
    mockCreate.mockClear()
    mockFromTo.mockClear()
  })

  it('registers a scroll-scrubbed trigger for the hero section', () => {
    initScrollAnimations({ scrollProgress: { current: 0 } })
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: '#hero', scrub: true })
    )
  })

  it('updates scrollProgress.current from the hero trigger onUpdate callback', () => {
    const scrollProgress = { current: 0 }
    initScrollAnimations({ scrollProgress })
    const { onUpdate } = mockCreate.mock.calls[0][0]
    onUpdate({ progress: 0.42 })
    expect(scrollProgress.current).toBe(0.42)
  })

  it('creates a reveal animation for each content section', () => {
    initScrollAnimations({ scrollProgress: { current: 0 } })
    const triggeredSelectors = mockFromTo.mock.calls.map((call) => call[0])
    expect(triggeredSelectors).toEqual(['#about', '#project', '#contact'])
  })

  it('returns a cleanup function that kills all triggers', () => {
    const cleanup = initScrollAnimations({ scrollProgress: { current: 0 } })
    const heroKill = mockCreate.mock.results[0].value.kill
    cleanup()
    expect(heroKill).toHaveBeenCalled()
  })
})
