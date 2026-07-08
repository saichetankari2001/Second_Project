import { useEffect, useRef } from 'react'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProjectShowcase } from './components/ProjectShowcase'
import { Contact } from './components/Contact'
import { initScrollAnimations } from './scrollAnimations'

function App() {
  const scrollProgress = useRef(0)

  useEffect(() => {
    const cleanup = initScrollAnimations({ scrollProgress })
    return cleanup
  }, [])

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
