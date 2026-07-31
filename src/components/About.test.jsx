import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the About heading and bio copy inside an #about section', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(/TJ's Kebab Centre/)).toBeInTheDocument()
    expect(
      screen.getByText(/Swinburne University of Technology/)
    ).toBeInTheDocument()
    expect(document.querySelector('section#about')).not.toBeNull()
  })

  it('renders grouped skill tags sourced from the resume', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(screen.getByText('React Native (Expo)')).toBeInTheDocument()
    expect(screen.getByText('Google Gemini AI')).toBeInTheDocument()
  })
})
