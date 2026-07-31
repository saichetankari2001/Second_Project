import { FeaturedProject } from './FeaturedProject'
import { GithubProjectCard } from './GithubProjectCard'
import { useGithubProjects } from '../hooks/useGithubProjects'
import './ProjectShowcase.css'

export function ProjectShowcase() {
  const { projects } = useGithubProjects()

  return (
    <section className="project" id="project">
      <div className="project-label">// SELECTED WORK</div>
      <h2>Projects, synced live from GitHub</h2>
      <div className="project-grid">
        <FeaturedProject />
        {projects.map((project) => (
          <GithubProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  )
}
