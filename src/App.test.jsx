import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./scrollAnimations', () => ({
  initScrollAnimations: vi.fn(() => vi.fn()),
}))
vi.mock('./components/Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="hero-3d-scene" />,
}))
vi.mock('./components/AmbientBackground', () => ({
  AmbientBackground: () => <div data-testid="ambient-background" />,
}))
vi.mock('./hooks/useGithubProjects', () => ({
  useGithubProjects: () => ({ projects: [], isLoading: false }),
}))

describe('App', () => {
  it('renders Hero, About, Project, and Contact sections in order', async () => {
    render(<App />)
    await screen.findByTestId('hero-3d-scene')
    const sectionIds = Array.from(document.querySelectorAll('section')).map(
      (section) => section.id
    )
    expect(sectionIds).toEqual(['hero', 'about', 'project', 'contact'])
  })
})
