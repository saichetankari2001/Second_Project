import { useEffect, useState } from 'react'
import { fetchGithubProjects } from '../githubProjects'

export function useGithubProjects() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchGithubProjects().then((result) => {
      if (!cancelled) {
        setProjects(result)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, isLoading }
}
