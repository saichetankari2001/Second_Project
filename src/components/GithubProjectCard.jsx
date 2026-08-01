import { motion } from 'framer-motion'
import { formatRelativeTime } from '../githubProjects'
import { PROJECT_DETAILS } from '../projectDetails'
import './GithubProjectCard.css'

const LANGUAGE_COLORS = {
  JavaScript: '#facc15',
  TypeScript: '#60a5fa',
  Python: '#3b82f6',
  HTML: '#f97316',
  CSS: '#a78bfa',
}
const DEFAULT_LANGUAGE_COLOR = '#8b93a3'

export function GithubProjectCard({ project }) {
  const languageColor = LANGUAGE_COLORS[project.language] ?? DEFAULT_LANGUAGE_COLOR
  const details = PROJECT_DETAILS[project.name]
  const summary = details?.summary || project.description

  return (
    <motion.a
      className="github-card"
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {project.language && (
        <span
          className="github-card-lang-dot"
          style={{ backgroundColor: languageColor }}
          aria-hidden="true"
        />
      )}
      <div className="github-card-title">{project.name}</div>
      <p className="github-card-desc">{summary}</p>
      {details?.highlights && (
        <ul className="github-card-highlights">
          {details.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
      <div className="github-card-sync">
        <span className="github-card-sync-dot" aria-hidden="true" />
        synced from GitHub · {formatRelativeTime(project.pushedAt)}
      </div>
    </motion.a>
  )
}
