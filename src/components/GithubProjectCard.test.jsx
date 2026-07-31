import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GithubProjectCard } from './GithubProjectCard'

const PROJECT = {
  name: 'booking-api',
  description: 'Node/Express + Prisma REST API.',
  url: 'https://github.com/saichetankari2001/booking-api',
  language: 'TypeScript',
  pushedAt: new Date().toISOString(),
}

describe('GithubProjectCard', () => {
  it('renders the project name, description, and a link to GitHub', () => {
    render(<GithubProjectCard project={PROJECT} />)
    expect(screen.getByText('booking-api')).toBeInTheDocument()
    expect(screen.getByText('Node/Express + Prisma REST API.')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', PROJECT.url)
  })

  it('shows the "synced from GitHub" indicator with a relative pushed time', () => {
    render(<GithubProjectCard project={PROJECT} />)
    expect(
      screen.getByText(/synced from GitHub · pushed today/)
    ).toBeInTheDocument()
  })
})
