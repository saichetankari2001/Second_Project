import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE = 'power2.out'

export function initScrollAnimations({ scrollProgress }) {
  const heroTrigger = ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      scrollProgress.current = self.progress
    },
  })

  const sectionTweens = ['#about', '#project', '#contact'].map((selector) =>
    gsap.fromTo(
      selector,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: EASE,
        scrollTrigger: {
          trigger: selector,
          start: 'top 80%',
        },
      }
    )
  )

  return () => {
    heroTrigger.kill()
    sectionTweens.forEach((tween) => tween.scrollTrigger?.kill())
  }
}
