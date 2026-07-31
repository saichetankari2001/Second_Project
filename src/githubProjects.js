export const GITHUB_USERNAME = 'saichetankari2001'
export const EXCLUDED_REPOS = ['Second_Project', 'Chintu1112']

const CACHE_KEY = 'portfolio:github-projects'
const CACHE_TTL_MS = 10 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function formatRelativeTime(isoDateString, now = Date.now()) {
  const diffMs = now - new Date(isoDateString).getTime()
  const days = Math.floor(diffMs / DAY_MS)

  if (days < 1) return 'pushed today'
  if (days < 30) return `pushed ${days}d ago`
  if (days < 365) return `pushed ${Math.floor(days / 30)}mo ago`
  return `pushed ${Math.floor(days / 365)}y ago`
}

function readCache(storage, now) {
  try {
    const raw = storage.getItem(CACHE_KEY)
    if (!raw) return null
    const { timestamp, projects } = JSON.parse(raw)
    if (now() - timestamp > CACHE_TTL_MS) return null
    return projects
  } catch {
    return null
  }
}

function writeCache(storage, now, projects) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now(), projects }))
  } catch {
    // storage unavailable (e.g. private browsing) — not fatal, just skip caching
  }
}

function toProject(repo) {
  return {
    name: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    language: repo.language,
    pushedAt: repo.pushed_at,
  }
}

export async function fetchGithubProjects({
  fetchImpl = fetch,
  now = () => Date.now(),
  storage = typeof window !== 'undefined' ? window.localStorage : undefined,
} = {}) {
  const cached = storage ? readCache(storage, now) : null
  if (cached) return cached

  try {
    const response = await fetchImpl(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`
    )
    if (!response.ok) return []
    const repos = await response.json()
    const projects = repos
      .filter((repo) => !repo.fork && !EXCLUDED_REPOS.includes(repo.name))
      .map(toProject)
    if (storage) writeCache(storage, now, projects)
    return projects
  } catch {
    return []
  }
}
