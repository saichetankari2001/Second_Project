import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGithubProjects } from './useGithubProjects'
import { fetchGithubProjects } from '../githubProjects'

vi.mock('../githubProjects', () => ({
  fetchGithubProjects: vi.fn(),
}))

describe('useGithubProjects', () => {
  it('starts loading and resolves with the fetched projects', async () => {
    const projects = [
      {
        name: 'booking-api',
        description: '',
        url: '',
        language: 'TypeScript',
        pushedAt: '2026-07-29T00:00:00Z',
      },
    ]
    fetchGithubProjects.mockResolvedValue(projects)

    const { result } = renderHook(() => useGithubProjects())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.projects).toEqual(projects)
  })
})
