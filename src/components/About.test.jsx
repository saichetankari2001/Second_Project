import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the About heading and bio copy inside an #about section', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(/TJ's Kebab Centre/)).toBeInTheDocument()
    expect(document.querySelector('section#about')).not.toBeNull()
  })
})
