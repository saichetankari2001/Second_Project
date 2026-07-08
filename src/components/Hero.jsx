import { lazy, Suspense } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { HeroFallback } from './HeroFallback'
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
        <Suspense fallback={<HeroFallback />}>
          <Hero3DScene scrollProgress={scrollProgress} />
          <div className="hero-overlay">
            <h1 className="hero-title">Your Name</h1>
            <p className="hero-tagline">Software Developer</p>
          </div>
        </Suspense>
      )}
    </section>
  )
}
