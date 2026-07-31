import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectShowcase } from './ProjectShowcase'
import { useGithubProjects } from '../hooks/useGithubProjects'

vi.mock('../hooks/useGithubProjects')

describe('ProjectShowcase', () => {
  it('renders the featured case study and a card for each synced GitHub project inside a #project section', () => {
    useGithubProjects.mockReturnValue({
      isLoading: false,
      projects: [
        {
          name: 'booking-api',
          description: 'Node/Express + Prisma REST API.',
          url: 'https://github.com/saichetankari2001/booking-api',
          language: 'TypeScript',
          pushedAt: new Date().toISOString(),
        },
      ],
    })

    render(<ProjectShowcase />)

    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
    expect(screen.getByText('booking-api')).toBeInTheDocument()
    expect(document.querySelector('section#project')).not.toBeNull()
  })

  it('still renders the featured case study when no GitHub projects have loaded yet', () => {
    useGithubProjects.mockReturnValue({ isLoading: true, projects: [] })

    render(<ProjectShowcase />)

    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
  })
})
