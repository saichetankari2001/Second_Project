import { describe, it, expect } from 'vitest'
import { PROJECT_DETAILS } from './projectDetails'
import { ALLOWED_REPOS } from './githubProjects'

describe('PROJECT_DETAILS', () => {
  it('has a curated summary and at least two highlights for every allowlisted repo', () => {
    ALLOWED_REPOS.forEach((repoName) => {
      const details = PROJECT_DETAILS[repoName]
      expect(details, `missing curated details for ${repoName}`).toBeTruthy()
      expect(typeof details.summary).toBe('string')
      expect(details.summary.length).toBeGreaterThan(10)
      expect(details.highlights.length).toBeGreaterThanOrEqual(2)
    })
  })
})
