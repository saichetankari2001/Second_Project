import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroFallback } from './HeroFallback'

describe('HeroFallback', () => {
  it('renders the name and tagline without any canvas element', () => {
    render(<HeroFallback />)
    expect(screen.getByText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('exposes an accessible label describing the static hero', () => {
    render(<HeroFallback />)
    expect(
      screen.getByRole('img', { name: /static version/i })
    ).toBeInTheDocument()
  })
})
