import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate, mockFromTo, mockSet, mockRegisterPlugin } = vi.hoisted(() => ({
  mockCreate: vi.fn(() => ({ kill: vi.fn() })),
  mockFromTo: vi.fn(() => ({ scrollTrigger: { kill: vi.fn() } })),
  mockSet: vi.fn(),
  mockRegisterPlugin: vi.fn(),
}))

vi.mock('gsap', () => ({
  default: {
    registerPlugin: mockRegisterPlugin,
    fromTo: mockFromTo,
    set: mockSet,
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
    mockSet.mockClear()
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

  it('immediately sets sections visible instead of animating when reduced motion is preferred', () => {
    initScrollAnimations({ scrollProgress: { current: 0 }, prefersReducedMotion: true })
    expect(mockSet).toHaveBeenCalledWith('#about', { autoAlpha: 1, y: 0 })
    expect(mockSet).toHaveBeenCalledWith('#project', { autoAlpha: 1, y: 0 })
    expect(mockSet).toHaveBeenCalledWith('#contact', { autoAlpha: 1, y: 0 })
    expect(mockFromTo).not.toHaveBeenCalled()
  })
})
