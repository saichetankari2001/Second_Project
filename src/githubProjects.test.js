import { describe, it, expect, vi } from 'vitest'
import {
  fetchGithubProjects,
  formatRelativeTime,
  GITHUB_USERNAME,
  EXCLUDED_REPOS,
} from './githubProjects'

function createStorage() {
  const store = new Map()
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  }
}

describe('EXCLUDED_REPOS', () => {
  it('denylists the portfolio repo and the personal project', () => {
    expect(EXCLUDED_REPOS).toEqual(['Second_Project', 'Chintu1112'])
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-07-31T12:00:00Z').getTime()

  it('formats same-day pushes as "pushed today"', () => {
    expect(formatRelativeTime('2026-07-31T08:00:00Z', now)).toBe('pushed today')
  })

  it('formats a few days ago in days', () => {
    expect(formatRelativeTime('2026-07-29T12:00:00Z', now)).toBe('pushed 2d ago')
  })

  it('formats a few months ago in months', () => {
    expect(formatRelativeTime('2026-05-01T12:00:00Z', now)).toBe('pushed 3mo ago')
  })
})

describe('fetchGithubProjects', () => {
  const REPOS_RESPONSE = [
    { name: 'booking-api', description: 'Node/Express API', html_url: 'https://github.com/saichetankari2001/booking-api', language: 'TypeScript', pushed_at: '2026-07-29T00:00:00Z', fork: false },
    { name: 'live-chat-room', description: 'Real-time chat', html_url: 'https://github.com/saichetankari2001/live-chat-room', language: 'Python', pushed_at: '2026-07-20T00:00:00Z', fork: false },
    { name: 'Second_Project', description: 'This portfolio', html_url: 'https://github.com/saichetankari2001/Second_Project', language: 'JavaScript', pushed_at: '2026-07-30T00:00:00Z', fork: false },
    { name: 'Chintu1112', description: 'Personal', html_url: 'https://github.com/saichetankari2001/Chintu1112', language: 'TypeScript', pushed_at: '2026-07-01T00:00:00Z', fork: false },
    { name: 'some-fork', description: 'A fork', html_url: 'https://github.com/saichetankari2001/some-fork', language: 'JavaScript', pushed_at: '2026-06-01T00:00:00Z', fork: true },
  ]

  it('fetches, excludes forks and denylisted repos, and maps to the project shape', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(REPOS_RESPONSE),
    })
    const storage = createStorage()

    const projects = await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })

    expect(fetchImpl).toHaveBeenCalledWith(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`
    )
    expect(projects.map((p) => p.name)).toEqual(['booking-api', 'live-chat-room'])
    expect(projects[0]).toEqual({
      name: 'booking-api',
      description: 'Node/Express API',
      url: 'https://github.com/saichetankari2001/booking-api',
      language: 'TypeScript',
      pushedAt: '2026-07-29T00:00:00Z',
    })
  })

  it('returns a cached result within the TTL without calling fetch again', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(REPOS_RESPONSE),
    })
    const storage = createStorage()

    await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })
    await fetchGithubProjects({ fetchImpl, now: () => 2000, storage })

    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('returns an empty array when the request fails', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network error'))
    const storage = createStorage()

    const projects = await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })

    expect(projects).toEqual([])
  })
})
