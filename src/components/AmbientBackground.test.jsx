import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AmbientBackground } from './AmbientBackground'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

vi.mock('../hooks/usePrefersReducedMotion')

describe('AmbientBackground', () => {
  it('renders animated blobs and particles when motion is allowed', () => {
    usePrefersReducedMotion.mockReturnValue(false)
    const { container } = render(<AmbientBackground />)
    expect(container.querySelectorAll('.ambient-blob').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.ambient-particle').length).toBeGreaterThan(0)
  })

  it('renders a static background with no particles when reduced motion is preferred', () => {
    usePrefersReducedMotion.mockReturnValue(true)
    const { container } = render(<AmbientBackground />)
    expect(container.querySelectorAll('.ambient-particle').length).toBe(0)
    expect(container.querySelector('.ambient-static')).not.toBeNull()
  })
})
