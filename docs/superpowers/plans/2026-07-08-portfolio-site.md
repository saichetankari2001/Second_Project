# Personal Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page React portfolio site with a cinematic Three.js particle-tunnel hero, GSAP ScrollTrigger-driven section reveals, and a tjs-v6 project case study, matching the spec at `docs/superpowers/specs/2026-07-08-portfolio-site-design.md`.

**Architecture:** A static Vite + React app with four composed sections (Hero, About, ProjectShowcase, Contact). The 3D hero is isolated into its own lazy-loaded component so the rest of the page never blocks on WebGL init. A single `scrollAnimations.js` module owns all GSAP ScrollTrigger wiring and exposes scroll progress to the 3D scene via a plain ref, avoiding React re-renders on every scroll tick.

**Tech Stack:** React 18, Vite, react-three-fiber (Three.js), GSAP + ScrollTrigger, Vitest + React Testing Library for tests.

## Global Constraints

- Palette: near-black base (`#05070d` → `#0a1420` → `#0d2233`) with electric cyan/blue glow accent (`#38e0ff` family) — matches the reference reel exactly, does not reuse tjs-v6's amber/charcoal brand.
- Typography: editorial serif display font (`Playfair Display`) for headings, grotesk sans (`Inter`) for body/labels.
- No backend — fully static site, deployable as a Vite production build.
- `prefers-reduced-motion` must be respected everywhere motion is used (hero particle scene included), not just decoratively.
- The 3D scene must be lazy-loaded so the rest of the page is not blocked behind WebGL initialization.
- Single project showcase only (tjs-v6) — no multi-project grid, no skills list, no contact form, no resume download (all explicitly declined in the spec).
- tjs-v6's sanitized demo-mode is out of scope for this plan — the "Live Demo" link must render a disabled "Coming Soon" state until that URL exists.

---

### Task 1: Project scaffold (Vite + React + Vitest)

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/App.css`
- Test: `src/App.test.jsx`
- Create: `src/test/setup.js`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a working `npm run dev` / `npm run build` / `npm test` toolchain; `App` default export from `src/App.jsx` that later tasks will rewrite in Task 11.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "portfolio-site",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "three": "latest",
    "@react-three/fiber": "latest",
    "gsap": "latest"
  },
  "devDependencies": {
    "vite": "latest",
    "@vitejs/plugin-react": "latest",
    "vitest": "latest",
    "jsdom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest"
  }
}
```

- [ ] **Step 2: Write `vite.config.js`**

```js
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: false,
  },
})
```

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Name — Software Developer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write `src/test/setup.js`**

```js
import '@testing-library/jest-dom'

window.matchMedia = window.matchMedia || function matchMediaStub() {
  return {
    matches: false,
    media: '',
    addEventListener: () => {},
    removeEventListener: () => {},
  }
}
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: completes with a generated `package-lock.json` and `node_modules/`, no errors.

- [ ] **Step 6: Write `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 7: Write the failing smoke test `src/App.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Portfolio scaffold ready')).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Run test to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL — `src/App.jsx` does not exist yet (module not found).

- [ ] **Step 9: Write minimal `src/App.jsx`**

```jsx
function App() {
  return (
    <main>
      <h1>Portfolio scaffold ready</h1>
    </main>
  )
}

export default App
```

- [ ] **Step 10: Write empty `src/App.css`**

```css
/* Global styles added in Task 2 */
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npx vitest run src/App.test.jsx`
Expected: PASS

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx src/App.css src/App.test.jsx src/test/setup.js
git commit -m "chore: scaffold Vite + React + Vitest project"
```

---

### Task 2: Global design tokens and base styles

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: nothing beyond the scaffold from Task 1.
- Produces: CSS custom properties (`--color-bg-1`, `--color-bg-2`, `--color-bg-3`, `--color-glow-cyan`, `--color-text-primary`, `--color-text-secondary`, `--font-display`, `--font-body`, `--ease-standard`) that every later component's styles reference.

This task is pure CSS configuration — there is no meaningful unit test for a color/font token file, so it is verified visually instead of via Vitest.

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  --color-bg-1: #05070d;
  --color-bg-2: #0a1420;
  --color-bg-3: #0d2233;
  --color-glow-cyan: #38e0ff;
  --color-text-primary: #e8fbff;
  --color-text-secondary: #7fb8c9;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', Arial, sans-serif;

  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: Replace `src/App.css` with base styles**

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
@import './styles/tokens.css';

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: linear-gradient(
    160deg,
    var(--color-bg-1) 0%,
    var(--color-bg-2) 55%,
    var(--color-bg-3) 100%
  );
  color: var(--color-text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
  position: relative;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

h1, h2, h3 {
  font-family: var(--font-display);
  margin: 0 0 0.5em;
}

section {
  padding: 6rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`
Open the printed local URL. Confirm: dark near-black-to-charcoal gradient background, `Portfolio scaffold ready` heading rendered in the serif display font, subtle grain texture visible on close inspection.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/App.css
git commit -m "style: add design tokens and base page styles"
```

---

### Task 3: `usePrefersReducedMotion` hook

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.js`
- Test: `src/hooks/usePrefersReducedMotion.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `usePrefersReducedMotion(): boolean` — a hook later used by `Hero.jsx` (Task 6) to choose between the 3D scene and the static fallback.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

function mockMatchMedia(matches) {
  const listeners = []
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener: (_, cb) => listeners.push(cb),
    removeEventListener: vi.fn(),
  }))
  return listeners
}

describe('usePrefersReducedMotion', () => {
  it('returns true when the media query initially matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('returns false when the media query initially does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('updates when the media query change event fires', () => {
    const listeners = mockMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
    act(() => {
      listeners.forEach((cb) => cb({ matches: true }))
    })
    expect(result.current).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/usePrefersReducedMotion.test.js`
Expected: FAIL — `src/hooks/usePrefersReducedMotion.js` does not exist.

- [ ] **Step 3: Write the implementation**

```js
import { useEffect, useState } from 'react'

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setPrefersReducedMotion(event.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/usePrefersReducedMotion.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePrefersReducedMotion.js src/hooks/usePrefersReducedMotion.test.js
git commit -m "feat: add usePrefersReducedMotion hook"
```

---

### Task 4: `HeroFallback` component

**Files:**
- Create: `src/components/HeroFallback.jsx`
- Test: `src/components/HeroFallback.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `HeroFallback` named export — a static, canvas-free hero used both as the reduced-motion result and as the `Suspense` fallback while the 3D scene lazy-loads (Task 6).

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroFallback } from './HeroFallback'

describe('HeroFallback', () => {
  it('renders the name and tagline without any canvas element', () => {
    render(<HeroFallback />)
    expect(screen.getByText('Your Name')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('exposes an accessible label describing the static hero', () => {
    render(<HeroFallback />)
    expect(
      screen.getByRole('img', { name: /static version/i })
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/HeroFallback.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```jsx
export function HeroFallback() {
  return (
    <div
      className="hero-fallback"
      role="img"
      aria-label="Cyan particle tunnel, static version"
    >
      <h1 className="hero-title">Your Name</h1>
      <p className="hero-tagline">Software Developer</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/HeroFallback.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroFallback.jsx src/components/HeroFallback.test.jsx
git commit -m "feat: add static HeroFallback component"
```

---

### Task 5: `Hero3DScene` particle tunnel (react-three-fiber)

**Files:**
- Create: `src/components/Hero3DScene.jsx`
- Create: `src/components/Hero.css`

**Interfaces:**
- Consumes: `scrollProgress` — a ref shaped `{ current: number }` (0–1), written by `scrollAnimations.js` (Task 7).
- Produces: `Hero3DScene` named export — a full-viewport `react-three-fiber` `Canvas` rendering a cyan particle tunnel, consumed by `Hero.jsx` (Task 6).

This component renders real WebGL via `@react-three/fiber`, which requires a GPU-backed canvas context that jsdom does not provide. It is **not** covered by an automated test — Task 6 tests the branching logic around it using a mock. This task's correctness is verified by manually running the dev server and observing the scene, per the step below.

- [ ] **Step 1: Write `src/components/Hero.css`**

```css
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  padding: 0;
  max-width: none;
}

.hero-canvas-wrapper {
  position: absolute;
  inset: 0;
}

.hero-canvas-wrapper canvas {
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
}

.hero-tagline {
  color: var(--color-text-secondary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.hero-fallback {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
```

- [ ] **Step 2: Write `src/components/Hero3DScene.jsx`**

```jsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const TUNNEL_LENGTH = 40
const TUNNEL_RADIUS = 3

function ParticleTunnel({ scrollProgress, pointer }) {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = TUNNEL_RADIUS * (0.6 + Math.random() * 0.4)
      const z = (Math.random() - 0.5) * TUNNEL_LENGTH
      array[i * 3] = Math.cos(angle) * radius
      array[i * 3 + 1] = Math.sin(angle) * radius
      array[i * 3 + 2] = z
    }
    return array
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.z += delta * 0.05

    const targetZ = scrollProgress.current * TUNNEL_LENGTH
    pointsRef.current.position.z = THREE.MathUtils.lerp(
      pointsRef.current.position.z,
      targetZ,
      0.05
    )

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointer.current.x * 0.3,
      0.05
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      pointer.current.y * 0.3,
      0.05
    )
    state.camera.lookAt(0, 0, targetZ - 10)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38e0ff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

export function Hero3DScene({ scrollProgress }) {
  const pointer = useRef({ x: 0, y: 0 })

  function handlePointerMove(event) {
    pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  return (
    <div className="hero-canvas-wrapper" onPointerMove={handlePointerMove}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleTunnel scrollProgress={scrollProgress} pointer={pointer} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev`
Temporarily render `<Hero3DScene scrollProgress={{ current: 0 }} />` alone in `src/App.jsx` (or wait until Task 6 wires it in — either works). Confirm: a cyan particle field fills the viewport, particles rotate slowly, moving the mouse causes a subtle camera parallax shift, no errors in the browser console. Revert any temporary edit to `App.jsx` before continuing if you rendered it early.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero3DScene.jsx src/components/Hero.css
git commit -m "feat: add Hero3DScene particle tunnel"
```

---

### Task 6: `Hero` wrapper (reduced-motion branching + lazy load)

**Files:**
- Create: `src/components/Hero.jsx`
- Test: `src/components/Hero.test.jsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` from Task 3; `HeroFallback` from Task 4; `Hero3DScene` from Task 5 (lazy-loaded); `scrollProgress` prop shaped `{ current: number }`, supplied by `App.jsx` (Task 11).
- Produces: `Hero` named export — `<Hero scrollProgress={ref} />` — consumed by `App.jsx` (Task 11).

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

vi.mock('../hooks/usePrefersReducedMotion')
vi.mock('./Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="hero-3d-scene" />,
}))

describe('Hero', () => {
  it('renders the fallback when reduced motion is preferred', () => {
    usePrefersReducedMotion.mockReturnValue(true)
    render(<Hero scrollProgress={{ current: 0 }} />)
    expect(
      screen.getByRole('img', { name: /static version/i })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('hero-3d-scene')).toBeNull()
  })

  it('renders the 3D scene when reduced motion is not preferred', async () => {
    usePrefersReducedMotion.mockReturnValue(false)
    render(<Hero scrollProgress={{ current: 0 }} />)
    expect(await screen.findByTestId('hero-3d-scene')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero.test.jsx`
Expected: FAIL — `src/components/Hero.jsx` does not exist.

- [ ] **Step 3: Write the implementation**

```jsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Hero.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.test.jsx
git commit -m "feat: add Hero wrapper with reduced-motion and lazy-loaded 3D scene"
```

---

### Task 7: `scrollAnimations.js` (GSAP ScrollTrigger wiring)

**Files:**
- Create: `src/scrollAnimations.js`
- Test: `src/scrollAnimations.test.js`

**Interfaces:**
- Consumes: `scrollProgress` — a ref shaped `{ current: number }`, created by `App.jsx` (Task 11) and shared with `Hero3DScene` (Task 5).
- Produces: `initScrollAnimations({ scrollProgress }): () => void` — called once from `App.jsx`'s effect; the returned function tears down all ScrollTriggers on unmount. Also exports `EASE` (string) for reuse if other components need the same easing curve.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn(() => ({ kill: vi.fn() }))
const mockFromTo = vi.fn(() => ({ scrollTrigger: { kill: vi.fn() } }))
const mockRegisterPlugin = vi.fn()

vi.mock('gsap', () => ({
  default: {
    registerPlugin: mockRegisterPlugin,
    fromTo: mockFromTo,
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: mockCreate },
}))

import { initScrollAnimations } from './scrollAnimations'

describe('initScrollAnimations', () => {
  beforeEach(() => {
    mockCreate.mockClear()
    mockFromTo.mockClear()
  })

  it('registers a scroll-scrubbed trigger for the hero section', () => {
    initScrollAnimations({ scrollProgress: { current: 0 } })
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: '#hero', scrub: true })
    )
  })

  it('updates scrollProgress.current from the hero trigger onUpdate callback', () => {
    const scrollProgress = { current: 0 }
    initScrollAnimations({ scrollProgress })
    const { onUpdate } = mockCreate.mock.calls[0][0]
    onUpdate({ progress: 0.42 })
    expect(scrollProgress.current).toBe(0.42)
  })

  it('creates a reveal animation for each content section', () => {
    initScrollAnimations({ scrollProgress: { current: 0 } })
    const triggeredSelectors = mockFromTo.mock.calls.map((call) => call[0])
    expect(triggeredSelectors).toEqual(['#about', '#project', '#contact'])
  })

  it('returns a cleanup function that kills all triggers', () => {
    const cleanup = initScrollAnimations({ scrollProgress: { current: 0 } })
    const heroKill = mockCreate.mock.results[0].value.kill
    cleanup()
    expect(heroKill).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/scrollAnimations.test.js`
Expected: FAIL — `src/scrollAnimations.js` does not exist.

- [ ] **Step 3: Write the implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/scrollAnimations.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/scrollAnimations.js src/scrollAnimations.test.js
git commit -m "feat: add GSAP ScrollTrigger wiring for scroll-driven animations"
```

---

### Task 8: `About` component

**Files:**
- Create: `src/components/About.jsx`
- Test: `src/components/About.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `About` named export, rendered as the `#about` section, consumed by `App.jsx` (Task 11). Note the `id="about"` matches the selector `scrollAnimations.js` (Task 7) already targets.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the About heading and bio copy inside an #about section', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(/TJ's Kebab Centre/)).toBeInTheDocument()
    expect(document.querySelector('section#about')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/About.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```jsx
export function About() {
  return (
    <section className="about" id="about">
      <h2>About</h2>
      <p>
        I'm a software developer who also manages a real, physical business
        day-to-day — TJ's Kebab Centre. That means the software I build isn't
        theoretical: it runs a live shop, handles real orders, and has to
        work every single day. I build the tools I actually use.
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/About.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/About.jsx src/components/About.test.jsx
git commit -m "feat: add About section"
```

---

### Task 9: `ProjectShowcase` component (tjs-v6 case study)

**Files:**
- Create: `src/components/ProjectShowcase.jsx`
- Test: `src/components/ProjectShowcase.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `ProjectShowcase` named export, rendered as the `#project` section, consumed by `App.jsx` (Task 11). The `id="project"` matches the selector `scrollAnimations.js` (Task 7) already targets. Exposes the `DEMO_URL` constant as the single place to flip on the live demo link once the sanitized tjs-v6 demo mode ships (out of scope for this plan).

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectShowcase } from './ProjectShowcase'

describe('ProjectShowcase', () => {
  it('renders the case study heading and tech stack inside a #project section', () => {
    render(<ProjectShowcase />)
    expect(
      screen.getByRole('heading', { name: /tjs-v6/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Three.js')).toBeInTheDocument()
    expect(screen.getByText('Firebase (Firestore + Auth)')).toBeInTheDocument()
    expect(document.querySelector('section#project')).not.toBeNull()
  })

  it('shows a disabled "coming soon" state instead of a live demo link', () => {
    render(<ProjectShowcase />)
    expect(screen.getByText('Live Demo — Coming Soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view live demo/i })).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProjectShowcase.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```jsx
const DEMO_URL = null // set to the live demo URL once the sanitized tjs-v6 demo mode ships

export function ProjectShowcase() {
  return (
    <section className="project" id="project">
      <h2>tjs-v6 — TJ's Kebab Centre Admin Panel</h2>
      <p className="project-summary">
        A full rebuild of the admin panel behind a real, live restaurant —
        rebuilt to a SaaS-agency quality bar, centered on a real-time,
        cursor-reactive 3D dashboard built with Three.js.
      </p>

      <div className="project-details">
        <div>
          <h3>Problem</h3>
          <p>
            The shop's admin tools needed to feel as considered as the
            customer-facing app, without ever risking the live order flow
            staff depend on every day.
          </p>
        </div>
        <div>
          <h3>Approach</h3>
          <p>
            Rebuilt the dashboard around a real-time 3D scene tied to live
            order volume, backed by a shared design token system reused
            across every screen.
          </p>
        </div>
        <div>
          <h3>Tech Stack</h3>
          <ul>
            <li>React</li>
            <li>Three.js</li>
            <li>Firebase (Firestore + Auth)</li>
            <li>Node.js / Express</li>
          </ul>
        </div>
      </div>

      {DEMO_URL ? (
        <a className="project-demo-link" href={DEMO_URL}>
          View Live Demo
        </a>
      ) : (
        <span className="project-demo-link project-demo-link--disabled">
          Live Demo — Coming Soon
        </span>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ProjectShowcase.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectShowcase.jsx src/components/ProjectShowcase.test.jsx
git commit -m "feat: add ProjectShowcase section with tjs-v6 case study"
```

---

### Task 10: `Contact` component

**Files:**
- Create: `src/components/Contact.jsx`
- Test: `src/components/Contact.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `Contact` named export, rendered as the `#contact` section, consumed by `App.jsx` (Task 11). The `id="contact"` matches the selector `scrollAnimations.js` (Task 7) already targets.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders email, GitHub, and LinkedIn links with correct hrefs inside a #contact section', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:your.email@example.com'
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/your-username'
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/your-username'
    )
    expect(document.querySelector('section#contact')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```jsx
const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:your.email@example.com' },
  { label: 'GitHub', href: 'https://github.com/your-username' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/your-username' },
]

export function Contact() {
  return (
    <section className="contact" id="contact">
      <h2>Contact</h2>
      <ul className="contact-links">
        {CONTACT_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.test.jsx
git commit -m "feat: add Contact section"
```

---

### Task 11: Assemble `App.jsx`

**Files:**
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx` (replaces the Task 1 smoke test)

**Interfaces:**
- Consumes: `Hero` (Task 6), `About` (Task 8), `ProjectShowcase` (Task 9), `Contact` (Task 10), `initScrollAnimations` (Task 7).
- Produces: the final `App` default export used by `src/main.jsx` (Task 1).

- [ ] **Step 1: Write the failing test (replacing the Task 1 scaffold test)**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./scrollAnimations', () => ({
  initScrollAnimations: vi.fn(() => vi.fn()),
}))
vi.mock('./components/Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="hero-3d-scene" />,
}))

describe('App', () => {
  it('renders Hero, About, Project, and Contact sections in order', async () => {
    render(<App />)
    await screen.findByTestId('hero-3d-scene')
    const sectionIds = Array.from(document.querySelectorAll('section')).map(
      (section) => section.id
    )
    expect(sectionIds).toEqual(['hero', 'about', 'project', 'contact'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL — `App` still renders only the Task 1 placeholder heading, no `section` elements exist yet.

- [ ] **Step 3: Rewrite `src/App.jsx`**

```jsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/App.test.jsx`
Expected: PASS

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: all test files pass (Tasks 3, 4, 6, 7, 8, 9, 10, 11).

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat: assemble full page from Hero, About, ProjectShowcase, and Contact"
```

---

### Task 12: Production build verification

**Files:**
- None created — this task verifies the existing build, no source changes expected unless verification surfaces a bug.

**Interfaces:**
- Consumes: the complete app from Task 11.
- Produces: a verified `dist/` production build, ready to deploy to Vercel or Netlify (both auto-detect a Vite project with no extra config needed).

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: completes with no errors, produces a `dist/` directory containing `index.html` and hashed asset files.

- [ ] **Step 2: Serve the production build locally**

Run: `npm run preview`
Open the printed local URL.

- [ ] **Step 3: Manually verify the full page in the browser**

Confirm all of the following:
- Hero particle tunnel renders in cyan, cursor movement causes camera parallax.
- Scrolling past the hero triggers the About, Project, and Contact sections to fade/slide in.
- The Project section shows tech stack list and the "Live Demo — Coming Soon" disabled state.
- Contact links point to the placeholder email/GitHub/LinkedIn URLs (to be replaced with real ones before going live).
- No errors in the browser console.
- Toggle `prefers-reduced-motion` in your OS/browser dev tools and reload — the hero should render `HeroFallback` (static, no canvas) instead of the particle scene.

- [ ] **Step 4: Commit (only if verification required fixes)**

```bash
git add -A
git commit -m "fix: address issues found during production build verification"
```

If no fixes were needed, skip this step — there is nothing to commit.

---

## Follow-up work (not part of this plan)

- Replace placeholder copy (`Your Name`, tagline, contact links) with real content.
- Capture real tjs-v6 screenshots and add them to the Project section.
- Build the sanitized tjs-v6 demo mode (separate project against the tjs-v6 codebase), then set `DEMO_URL` in `ProjectShowcase.jsx`.
- Deploy to Vercel or Netlify and connect a custom domain.
