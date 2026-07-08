import { useEffect, useRef } from 'react'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProjectShowcase } from './components/ProjectShowcase'
import { Contact } from './components/Contact'
import { initScrollAnimations } from './scrollAnimations'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

function App() {
  const scrollProgress = useRef(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const cleanup = initScrollAnimations({ scrollProgress, prefersReducedMotion })
    return cleanup
  }, [prefersReducedMotion])

  return (
    <main>
      <Hero scrollProgress={scrollProgress} />
      <About />
      <ProjectShowcase />
      <Contact />
    </main>
  )
}

export default App
