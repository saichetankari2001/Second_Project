import './AmbientBackground.css'
import Aurora from '../vendor/react-bits/Aurora'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const PARTICLE_COUNT = 18
const AURORA_COLORS = ['#5eead4', '#22c55e', '#5eead4']

export function AmbientBackground() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className="ambient-background ambient-static" aria-hidden="true" />
  }

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-aurora">
        <Aurora colorStops={AURORA_COLORS} amplitude={0.8} blend={0.6} />
      </div>
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
