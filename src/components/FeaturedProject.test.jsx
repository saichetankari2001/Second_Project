import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedProject } from './FeaturedProject'

describe('FeaturedProject', () => {
  it("renders the TJ's Kebab Centre case study with its tech tags", () => {
    render(<FeaturedProject />)
    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
    expect(screen.getByText('React Native')).toBeInTheDocument()
    expect(screen.getByText('Firebase')).toBeInTheDocument()
    expect(
      screen.getByText(/three-app ordering ecosystem/i)
    ).toBeInTheDocument()
  })

  it('links to the real TJ\'s Kebab Centre GitHub repo, like the other project cards', () => {
    render(<FeaturedProject />)
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/saichetankari2001/tjs-kebab-centre'
    )
  })
})
