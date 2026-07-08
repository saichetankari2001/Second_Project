import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

vi.mock('../hooks/usePrefersReducedMotion')
vi.mock('./Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="hero-3d-scene" />,
}))

describe('Hero', () => {
  it('renders the fallback when reduced motion is preferred', () => {
    usePrefersReducedMotion.mockReturnValue(true)
    render(<Hero scrollProgress={{ current: 0 }} />)
    expect(
      screen.getByRole('img', { name: /static version/i })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('hero-3d-scene')).toBeNull()
  })

  it('renders the 3D scene when reduced motion is not preferred', async () => {
    usePrefersReducedMotion.mockReturnValue(false)
    render(<Hero scrollProgress={{ current: 0 }} />)
    expect(await screen.findByTestId('hero-3d-scene')).toBeInTheDocument()
  })
})
