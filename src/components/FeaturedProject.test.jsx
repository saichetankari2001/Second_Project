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
})
