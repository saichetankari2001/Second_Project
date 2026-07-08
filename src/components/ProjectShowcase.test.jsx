import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectShowcase } from './ProjectShowcase'

describe('ProjectShowcase', () => {
  it('renders the case study heading and tech stack inside a #project section', () => {
    render(<ProjectShowcase />)
    expect(
      screen.getByRole('heading', { name: /tjs-v6/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Three.js')).toBeInTheDocument()
    expect(screen.getByText('Firebase (Firestore + Auth)')).toBeInTheDocument()
    expect(document.querySelector('section#project')).not.toBeNull()
  })

  it('shows a disabled "coming soon" state instead of a live demo link', () => {
    render(<ProjectShowcase />)
    expect(screen.getByText('Live Demo — Coming Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view live demo/i })).toBeNull()
  })
})
