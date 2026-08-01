import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GithubProjectCard } from './GithubProjectCard'

const CURATED_PROJECT = {
  name: 'booking-api',
  description: '',
  url: 'https://github.com/saichetankari2001/booking-api',
  language: 'TypeScript',
  pushedAt: new Date().toISOString(),
}

const UNCURATED_PROJECT = {
  name: 'some-new-repo',
  description: 'Raw GitHub description for a repo with no curated details yet.',
  url: 'https://github.com/saichetankari2001/some-new-repo',
  language: 'JavaScript',
  pushedAt: new Date().toISOString(),
}

describe('GithubProjectCard', () => {
  it('renders the project name, a link to GitHub, and curated summary/highlights when available', () => {
    render(<GithubProjectCard project={CURATED_PROJECT} />)
    expect(screen.getByText('booking-api')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', CURATED_PROJECT.url)
    expect(
      screen.getByText(/Express \+ TypeScript REST API for managing bookings/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/JWT-based authentication with bcrypt password hashing/)
    ).toBeInTheDocument()
  })

  it('falls back to the raw GitHub description with no highlights for repos without curated details', () => {
    render(<GithubProjectCard project={UNCURATED_PROJECT} />)
    expect(
      screen.getByText('Raw GitHub description for a repo with no curated details yet.')
    ).toBeInTheDocument()
    expect(document.querySelector('.github-card-highlights')).toBeNull()
  })

  it('shows the "synced from GitHub" indicator with a relative pushed time', () => {
    render(<GithubProjectCard project={CURATED_PROJECT} />)
    expect(
      screen.getByText(/synced from GitHub · pushed today/)
    ).toBeInTheDocument()
  })
})
