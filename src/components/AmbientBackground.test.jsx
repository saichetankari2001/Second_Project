import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AmbientBackground } from './AmbientBackground'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

vi.mock('../hooks/usePrefersReducedMotion')
vi.mock('../vendor/react-bits/Aurora', () => ({
  default: () => <div data-testid="aurora-mock" />,
}))

describe('AmbientBackground', () => {
  it('renders the Aurora background and rising particles when motion is allowed', () => {
    usePrefersReducedMotion.mockReturnValue(false)
    const { container, getByTestId } = render(<AmbientBackground />)
    expect(getByTestId('aurora-mock')).toBeInTheDocument()
    expect(container.querySelectorAll('.ambient-particle').length).toBeGreaterThan(0)
  })

  it('renders a static background with no particles when reduced motion is preferred', () => {
    usePrefersReducedMotion.mockReturnValue(true)
    const { container, queryByTestId } = render(<AmbientBackground />)
    expect(queryByTestId('aurora-mock')).toBeNull()
    expect(container.querySelectorAll('.ambient-particle').length).toBe(0)
    expect(container.querySelector('.ambient-static')).not.toBeNull()
  })
})
