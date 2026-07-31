import { lazy, Suspense } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { HeroFallback } from './HeroFallback'
import { ErrorBoundary } from './ErrorBoundary'
import './Hero.css'

const Hero3DScene = lazy(() =>
  import('./Hero3DScene').then((module) => ({ default: module.Hero3DScene }))
)

export function Hero({ scrollProgress }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="hero" id="hero">
      {prefersReducedMotion ? (
        <HeroFallback />
      ) : (
        <ErrorBoundary fallback={<HeroFallback />}>
          <Suspense fallback={<HeroFallback />}>
            <Hero3DScene scrollProgress={scrollProgress} />
            <div className="hero-overlay">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Open to Software Developer roles
              </div>
              <h1 className="hero-title">Saichetan Kari</h1>
              <p className="hero-tagline">Full-Stack Software Developer</p>
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </section>
  )
}
