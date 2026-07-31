import './AmbientBackground.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const PARTICLE_COUNT = 18

export function AmbientBackground() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className="ambient-background ambient-static" aria-hidden="true" />
  }

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />
      <div className="ambient-particles">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <span
            key={i}
            className="ambient-particle"
            style={{
              left: `${(i / PARTICLE_COUNT) * 100}%`,
              animationDuration: `${10 + (i % 6) * 2}s`,
              animationDelay: `${(i % 9) * 1.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
