# Portfolio Site v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing portfolio site with real content for Saichetan Kari, a graphite/teal-mint visual system, a live GitHub-synced multi-project grid, device-orientation ("motion sensor") support on the hero, and first-time public deployment — per `docs/superpowers/specs/2026-07-31-portfolio-v2-design.md`.

**Architecture:** Builds on the existing Vite + React app (Hero, About, ProjectShowcase, Contact, Nav, GSAP ScrollTrigger, Vitest). GSAP stays for the scroll-scrubbed hero; Framer Motion is newly introduced for card hover/reveal micro-interactions. A new pure-logic module fetches and caches the GitHub API client-side (no build step, no server). A new hook extends the hero's existing pointer-parallax with `deviceorientation` events for mobile tilt. A new decorative `AmbientBackground` component adds the aurora/grid/particle motion, fully skipped under `prefers-reduced-motion`.

**Tech Stack:** React 19, Vite, react-three-fiber/three (existing hero scene), GSAP + ScrollTrigger (existing), Framer Motion (new), Vitest + React Testing Library.

## Global Constraints

- Palette: graphite base (`#08090c`, `#0d1015`, `#0b0c10`) with teal-mint accent (`--color-accent-teal: #5eead4`) and terminal-green accent (`--color-accent-green: #22c55e`) for "live/synced" indicators. Replaces the old near-black/cyan palette.
- Typography: `Inter` for UI/headings, `JetBrains Mono` for labels/technical accents. Replaces the old Playfair Display serif.
- Every new decorative animation must be skipped (not just paused) when `prefers-reduced-motion: reduce` is set — follow the existing `usePrefersReducedMotion` hook pattern already used by `Hero.jsx`.
- Real content only, exact strings, used consistently across every task that touches them:
  - Name: `Saichetan Kari`. Role: `Full-Stack Software Developer`.
  - Education line: final-semester Master of Information Technology (Software Development specialisation), Swinburne University of Technology, Melbourne.
  - Email: `karisaichetan@gmail.com`. Phone: `+61 401 800 149` (`tel:+61401800149`). GitHub: `github.com/saichetankari2001`. LinkedIn: `https://www.linkedin.com/in/sai-chetan-kari-927b9b309/`.
  - GitHub username for the live sync: `saichetankari2001`. Denylisted repo names (never shown even though public): `Second_Project` (the portfolio itself), `Chintu1112` (personal project).
- Out of scope for this plan (do not add): a resume download button, a contact form/backend, a custom domain, build-time GitHub sync/webhooks, SACA and the Multi-Cloud Photo Album projects.
- No new automated test is written for `Hero3DScene.jsx` — it renders real WebGL via `@react-three/fiber`, which jsdom cannot provide (the original portfolio plan established this precedent). Changes to it are verified manually in a running browser.

---

### Task 1: Design tokens and global styles

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/App.css`
- Modify: `index.html:11`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties (`--color-bg-1`, `--color-bg-2`, `--color-bg-3`, `--color-accent-teal`, `--color-accent-green`, `--color-text-primary`, `--color-text-secondary`, `--color-border`, `--font-body`, `--font-mono`, `--ease-standard`) that every later styled component references. Removes `--color-glow-cyan` and `--font-display`.

This task is pure CSS/markup configuration — verified visually, not via Vitest (matches the precedent set by the original portfolio plan's Task 2).

- [ ] **Step 1: Rewrite `src/styles/tokens.css`**

```css
:root {
  --color-bg-1: #08090c;
  --color-bg-2: #0d1015;
  --color-bg-3: #0b0c10;
  --color-accent-teal: #5eead4;
  --color-accent-green: #22c55e;
  --color-text-primary: #f4f6f8;
  --color-text-secondary: #9ba3b0;
  --color-border: rgba(255, 255, 255, 0.08);

  --font-body: 'Inter', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: Update `src/App.css`**

Replace the Google Fonts `@import` line and the `h1, h2, h3` rule; keep everything else (the `body`, `body::after`, and `section` rules) as-is:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
@import './styles/tokens.css';
```

```css
h1, h2, h3 {
  font-family: var(--font-body);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 0.5em;
}
```

- [ ] **Step 3: Update the page title in `index.html`**

Change line 11 from:
```html
<title>Your Name — Software Developer</title>
```
to:
```html
<title>Saichetan Kari — Full-Stack Software Developer</title>
```

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev`
Open the printed local URL. Confirm: graphite background (no more near-black/cyan), Inter-rendered headings, browser tab title reads "Saichetan Kari — Full-Stack Software Developer".

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/App.css index.html
git commit -m "style: rework palette and typography tokens for the v2 redesign"
```

---

### Task 2: Real hero content and eyebrow badge

**Files:**
- Modify: `src/components/HeroFallback.jsx`
- Modify: `src/components/HeroFallback.test.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`

**Interfaces:**
- Consumes: design tokens from Task 1 (`--color-accent-teal`, `--color-accent-green`, `--font-mono`).
- Produces: no interface change — `Hero` and `HeroFallback` keep their existing named exports and props (`Hero({ scrollProgress })`, `HeroFallback()`), only their rendered content changes.

- [ ] **Step 1: Update the failing test in `src/components/HeroFallback.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroFallback } from './HeroFallback'

describe('HeroFallback', () => {
  it('renders the name and tagline without any canvas element', () => {
    render(<HeroFallback />)
    expect(screen.getByText('Saichetan Kari')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Software Developer')).toBeInTheDocument()
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('exposes an accessible label describing the static hero', () => {
    render(<HeroFallback />)
    expect(
      screen.getByRole('img', { name: /saichetan kari/i })
    ).toBeInTheDocument()
  })

  it('renders the open-to-roles eyebrow badge', () => {
    render(<HeroFallback />)
    expect(
      screen.getByText('Open to Software Developer roles')
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/HeroFallback.test.jsx`
Expected: FAIL — current implementation still renders "Your Name" / "Software Developer" and has no eyebrow badge.

- [ ] **Step 3: Rewrite `src/components/HeroFallback.jsx`**

```jsx
export function HeroFallback() {
  return (
    <div
      className="hero-fallback"
      role="img"
      aria-label="Static hero: Saichetan Kari, Full-Stack Software Developer"
    >
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        Open to Software Developer roles
      </div>
      <h1 className="hero-title">Saichetan Kari</h1>
      <p className="hero-tagline">Full-Stack Software Developer</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/HeroFallback.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Update `src/components/Hero.jsx`**

Replace the `hero-overlay` block (lines 22–25) with:

```jsx
<div className="hero-overlay">
  <div className="hero-eyebrow">
    <span className="hero-eyebrow-dot" />
    Open to Software Developer roles
  </div>
  <h1 className="hero-title">Saichetan Kari</h1>
  <p className="hero-tagline">Full-Stack Software Developer</p>
</div>
```

- [ ] **Step 6: Add eyebrow styles to `src/components/Hero.css`**

Append:

```css
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: var(--color-accent-teal);
  background: rgba(94, 234, 212, 0.08);
  border: 1px solid rgba(94, 234, 212, 0.25);
  border-radius: 20px;
  padding: 0.35rem 0.85rem;
  margin-bottom: 1rem;
}

.hero-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent-green);
  box-shadow: 0 0 8px var(--color-accent-green);
}

@media (prefers-reduced-motion: no-preference) {
  .hero-eyebrow-dot {
    animation: heroPulse 2s ease-in-out infinite;
  }
}

@keyframes heroPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

The pulse animation is gated in pure CSS via the `no-preference` media query, so both `Hero.jsx` and `HeroFallback.jsx` can share the identical eyebrow markup without any JS branching — reduced-motion users get the same badge, just without the pulsing dot.

- [ ] **Step 7: Run the full test suite and verify existing Hero tests still pass**

Run: `npx vitest run src/components/Hero.test.jsx src/components/HeroFallback.test.jsx`
Expected: PASS (`Hero.test.jsx` doesn't assert on name/role text, so it's unaffected by this content change)

- [ ] **Step 8: Manually verify in the browser**

Run: `npm run dev`. Confirm the hero shows the "Open to Software Developer roles" pill with a pulsing green dot above "Saichetan Kari" / "Full-Stack Software Developer". Toggle `prefers-reduced-motion` in dev tools and reload — the dot should stop pulsing (badge text stays visible).

- [ ] **Step 9: Commit**

```bash
git add src/components/HeroFallback.jsx src/components/HeroFallback.test.jsx src/components/Hero.jsx src/components/Hero.css
git commit -m "feat: add real hero content and open-to-roles eyebrow badge"
```

---

### Task 3: `useDeviceOrientation` hook

**Files:**
- Create: `src/hooks/useDeviceOrientation.js`
- Test: `src/hooks/useDeviceOrientation.test.js`

**Interfaces:**
- Consumes: a `pointerRef` shaped `{ current: { x: number, y: number } }` — the same ref shape already created and used by `Hero3DScene.jsx`'s pointer-parallax.
- Produces: `useDeviceOrientation(pointerRef): { needsPermission: boolean, requestPermission: () => Promise<void> }`, consumed by `Hero3DScene.jsx` in Task 4.

This is a pure hook with no WebGL dependency, so it's fully unit-testable in jsdom (unlike `Hero3DScene.jsx` itself).

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeviceOrientation } from './useDeviceOrientation'

describe('useDeviceOrientation', () => {
  const originalDeviceOrientationEvent = window.DeviceOrientationEvent

  afterEach(() => {
    window.DeviceOrientationEvent = originalDeviceOrientationEvent
  })

  it('does nothing when DeviceOrientationEvent is unsupported', () => {
    delete window.DeviceOrientationEvent
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(false)
  })

  it('listens immediately and updates the pointer ref when no permission is required', () => {
    window.DeviceOrientationEvent = function DeviceOrientationEvent() {}
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(false)

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('deviceorientation'), { beta: 22.5, gamma: -22.5 })
      )
    })

    expect(pointerRef.current.x).toBeCloseTo(-0.5)
    expect(pointerRef.current.y).toBeCloseTo(0.5)
  })

  it('requires a permission request on iOS-style browsers, and attaches the listener once granted', async () => {
    window.DeviceOrientationEvent = function DeviceOrientationEvent() {}
    window.DeviceOrientationEvent.requestPermission = vi.fn().mockResolvedValue('granted')
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(true)

    await act(async () => {
      await result.current.requestPermission()
    })

    expect(window.DeviceOrientationEvent.requestPermission).toHaveBeenCalled()
    expect(result.current.needsPermission).toBe(false)

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('deviceorientation'), { beta: 45, gamma: 45 })
      )
    })
    expect(pointerRef.current.x).toBeCloseTo(1)
    expect(pointerRef.current.y).toBeCloseTo(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useDeviceOrientation.test.js`
Expected: FAIL — `src/hooks/useDeviceOrientation.js` does not exist.

- [ ] **Step 3: Write the implementation**

```js
import { useEffect, useState, useCallback, useRef } from 'react'

const TILT_RANGE_DEGREES = 45

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useDeviceOrientation(pointerRef) {
  const [needsPermission, setNeedsPermission] = useState(false)
  const handlerRef = useRef((event) => {
    if (event.beta == null || event.gamma == null) return
    pointerRef.current.x = clamp(event.gamma / TILT_RANGE_DEGREES, -1, 1)
    pointerRef.current.y = clamp(event.beta / TILT_RANGE_DEGREES, -1, 1)
  })

  useEffect(() => {
    if (typeof window.DeviceOrientationEvent === 'undefined') return
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true)
      return
    }
    const handler = handlerRef.current
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  const requestPermission = useCallback(async () => {
    const result = await window.DeviceOrientationEvent.requestPermission()
    if (result === 'granted') {
      setNeedsPermission(false)
      window.addEventListener('deviceorientation', handlerRef.current)
    }
  }, [])

  return { needsPermission, requestPermission }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useDeviceOrientation.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDeviceOrientation.js src/hooks/useDeviceOrientation.test.js
git commit -m "feat: add useDeviceOrientation hook for mobile tilt parallax"
```

---

### Task 4: Wire device orientation and updated palette into `Hero3DScene`

**Files:**
- Modify: `src/components/Hero3DScene.jsx`
- Modify: `src/components/Hero.css`

**Interfaces:**
- Consumes: `useDeviceOrientation` from Task 3, `pointer` ref already created locally in `Hero3DScene.jsx`.
- Produces: no exported interface change — `Hero3DScene({ scrollProgress })` keeps its existing signature.

No automated test for this task — see the "no new automated test for `Hero3DScene.jsx`" global constraint. Verified manually only.

- [ ] **Step 1: Import and wire the hook in `src/components/Hero3DScene.jsx`**

Add the import at the top:

```js
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
```

Inside `Hero3DScene`, right after `const pointer = useRef({ x: 0, y: 0 })` (line 119), add:

```js
const { needsPermission, requestPermission } = useDeviceOrientation(pointer)
```

- [ ] **Step 2: Render the "Enable motion" affordance**

Replace the `return` statement (lines 126–142) with:

```jsx
return (
  <div className="hero-canvas-wrapper" onPointerMove={handlePointerMove}>
    <Canvas camera={{ position: [BASE_CAMERA.x, BASE_CAMERA.y, BASE_CAMERA.z], fov: 55 }}>
      <fog attach="fog" args={['#08090c', 6, 26]} />
      <AmbientField />
      <ParticleCoil scrollProgress={scrollProgress} pointer={pointer} />
      <EffectComposer>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
    {needsPermission && (
      <button
        type="button"
        className="hero-motion-permission"
        onClick={requestPermission}
      >
        Enable motion
      </button>
    )}
  </div>
)
```

- [ ] **Step 3: Update the coil and ambient field colors to match the new palette**

Change the `CoilStrand` material color (line 43) from `"#7cf0ff"` to `"#5eead4"`, and the `AmbientField` `pointsMaterial` color (line 106) from `"#1c6a8a"` to `"#1c6a4a"`.

- [ ] **Step 4: Add the permission button style to `src/components/Hero.css`**

Append:

```css
.hero-motion-permission {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-bg-1);
  background: linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-green));
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
}
```

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`. On desktop, confirm the hero coil still responds to mouse movement and the updated teal/green colors render. In Chrome DevTools, open the "Sensors" panel (More tools → Sensors), enable an orientation override, and drag the device orientation dial — confirm the coil's camera parallax responds to the simulated tilt the same way it does to the mouse. On an actual iOS device (or note this as a follow-up manual check if unavailable), confirm the "Enable motion" button appears and tapping it starts tilt-based parallax.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero3DScene.jsx src/components/Hero.css
git commit -m "feat: extend hero parallax with device-orientation input on mobile"
```

---

### Task 5: `AmbientBackground` component

**Files:**
- Create: `src/components/AmbientBackground.jsx`
- Create: `src/components/AmbientBackground.css`
- Test: `src/components/AmbientBackground.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (existing hook).
- Produces: `AmbientBackground` named export — `<AmbientBackground />`, no props — consumed by `App.jsx`.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AmbientBackground } from './AmbientBackground'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

vi.mock('../hooks/usePrefersReducedMotion')

describe('AmbientBackground', () => {
  it('renders animated blobs and particles when motion is allowed', () => {
    usePrefersReducedMotion.mockReturnValue(false)
    const { container } = render(<AmbientBackground />)
    expect(container.querySelectorAll('.ambient-blob').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.ambient-particle').length).toBeGreaterThan(0)
  })

  it('renders a static background with no particles when reduced motion is preferred', () => {
    usePrefersReducedMotion.mockReturnValue(true)
    const { container } = render(<AmbientBackground />)
    expect(container.querySelectorAll('.ambient-particle').length).toBe(0)
    expect(container.querySelector('.ambient-static')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/AmbientBackground.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/AmbientBackground.jsx`**

```jsx
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
```

Particle placement is deterministic (index-based, not `Math.random()`) so the test output is stable.

- [ ] **Step 4: Write `src/components/AmbientBackground.css`**

```css
.ambient-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ambient-static {
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(94, 234, 212, 0.06), transparent 70%);
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}

.ambient-blob-1 {
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, var(--color-accent-teal), transparent 70%);
  top: -200px;
  left: -140px;
  animation: ambientFloat1 18s ease-in-out infinite;
}

.ambient-blob-2 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, var(--color-accent-green), transparent 70%);
  bottom: -180px;
  right: -110px;
  animation: ambientFloat2 22s ease-in-out infinite;
}

.ambient-blob-3 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, #38bdf8, transparent 70%);
  top: 35%;
  left: 55%;
  opacity: 0.2;
  animation: ambientFloat3 26s ease-in-out infinite;
}

@keyframes ambientFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(70px, 90px) scale(1.1); }
}

@keyframes ambientFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-80px, -60px) scale(1.12); }
}

@keyframes ambientFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-50px, 70px) scale(1.15); }
}

.ambient-particles {
  position: absolute;
  inset: 0;
}

.ambient-particle {
  position: absolute;
  bottom: -20px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-accent-teal);
  box-shadow: 0 0 8px var(--color-accent-teal);
  animation-name: ambientRise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes ambientRise {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-110vh); opacity: 0; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/AmbientBackground.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Mount it in `src/App.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import { AmbientBackground } from './components/AmbientBackground'
import { Nav } from './components/Nav'
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
    <>
      <AmbientBackground />
      <main>
        <Nav />
        <Hero scrollProgress={scrollProgress} />
        <About />
        <ProjectShowcase />
        <Contact />
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 7: Add stacking-context rule to `src/App.css`**

Append:

```css
main {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 8: Run the App test to confirm nothing broke**

Run: `npx vitest run src/App.test.jsx`
Expected: PASS — `AmbientBackground` renders as a sibling of `<main>`, so `document.querySelectorAll('section')` still finds exactly the same four sections in the same order.

- [ ] **Step 9: Manually verify in the browser**

Run: `npm run dev`. Confirm drifting aurora blobs and rising particles behind the page content, content stays fully readable on top. Toggle `prefers-reduced-motion` and reload — confirm the blobs/particles disappear and only a faint static gradient remains.

- [ ] **Step 10: Commit**

```bash
git add src/components/AmbientBackground.jsx src/components/AmbientBackground.css src/components/AmbientBackground.test.jsx src/App.jsx src/App.css
git commit -m "feat: add animated ambient background with reduced-motion fallback"
```

---

### Task 6: Real Nav content and glass styling

**Files:**
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Nav.css`
- Test: `src/components/Nav.test.jsx` (new — Nav currently has none)

**Interfaces:**
- Consumes: design tokens from Task 1.
- Produces: no interface change — `Nav()` keeps its existing no-props signature.

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the real name and links to each section', () => {
    render(<Nav />)
    expect(screen.getByText('Saichetan Kari')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#project')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Nav.test.jsx`
Expected: FAIL — logo still reads "Your Name" and the "Work" link doesn't exist (it's currently labeled "Project").

- [ ] **Step 3: Update `src/components/Nav.jsx`**

```jsx
import './Nav.css'

export function Nav() {
  return (
    <nav className="nav">
      <span className="nav-logo">Saichetan Kari</span>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#project">Work</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  )
}
```

The `href="#project"` is kept as-is (only the visible label changes to "Work") because `scrollAnimations.js` and `ProjectShowcase.jsx` both target the `#project` id — renaming the id would require touching the scroll-trigger selectors for no benefit.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Nav.test.jsx`
Expected: PASS

- [ ] **Step 5: Update `src/components/Nav.css`**

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 2.5rem;
  backdrop-filter: blur(16px);
  background: rgba(8, 9, 12, 0.6);
  border-bottom: 1px solid var(--color-border);
}

.nav-logo {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  transition: color 0.2s var(--ease-standard);
}

.nav-links a:hover {
  color: var(--color-accent-teal);
}
```

`position: fixed` is kept (not switched to `sticky`, despite the approved prototype using `sticky`) because the hero is exactly `100vh` — a sticky nav would push it down by the nav bar's height and break the full-bleed hero. `fixed` preserves the "nav floats over the hero" behavior the existing layout already relies on.

- [ ] **Step 6: Manually verify in the browser**

Run: `npm run dev`. Confirm the nav shows "Saichetan Kari", a blurred/translucent background over the hero, and the "Work" link scrolls to the projects section.

- [ ] **Step 7: Commit**

```bash
git add src/components/Nav.jsx src/components/Nav.css src/components/Nav.test.jsx
git commit -m "feat: add real nav content and glass-blur styling"
```

---

### Task 7: `githubProjects.js` — fetch, filter, cache, format

**Files:**
- Create: `src/githubProjects.js`
- Test: `src/githubProjects.test.js`

**Interfaces:**
- Consumes: nothing (accepts injected `fetchImpl`/`now`/`storage` for testability).
- Produces:
  - `GITHUB_USERNAME` (string) and `EXCLUDED_REPOS` (string[]).
  - `formatRelativeTime(isoDateString, now = Date.now()): string`.
  - `fetchGithubProjects({ fetchImpl, now, storage } = {}): Promise<Array<{ name, description, url, language, pushedAt }>>`.
  - Consumed by `useGithubProjects` (Task 8) and `GithubProjectCard` (Task 9, for `formatRelativeTime`).

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi } from 'vitest'
import {
  fetchGithubProjects,
  formatRelativeTime,
  GITHUB_USERNAME,
  EXCLUDED_REPOS,
} from './githubProjects'

function createStorage() {
  const store = new Map()
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  }
}

describe('EXCLUDED_REPOS', () => {
  it('denylists the portfolio repo and the personal project', () => {
    expect(EXCLUDED_REPOS).toEqual(['Second_Project', 'Chintu1112'])
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-07-31T12:00:00Z').getTime()

  it('formats same-day pushes as "pushed today"', () => {
    expect(formatRelativeTime('2026-07-31T08:00:00Z', now)).toBe('pushed today')
  })

  it('formats a few days ago in days', () => {
    expect(formatRelativeTime('2026-07-29T12:00:00Z', now)).toBe('pushed 2d ago')
  })

  it('formats a few months ago in months', () => {
    expect(formatRelativeTime('2026-05-01T12:00:00Z', now)).toBe('pushed 3mo ago')
  })
})

describe('fetchGithubProjects', () => {
  const REPOS_RESPONSE = [
    { name: 'booking-api', description: 'Node/Express API', html_url: 'https://github.com/saichetankari2001/booking-api', language: 'TypeScript', pushed_at: '2026-07-29T00:00:00Z', fork: false },
    { name: 'live-chat-room', description: 'Real-time chat', html_url: 'https://github.com/saichetankari2001/live-chat-room', language: 'Python', pushed_at: '2026-07-20T00:00:00Z', fork: false },
    { name: 'Second_Project', description: 'This portfolio', html_url: 'https://github.com/saichetankari2001/Second_Project', language: 'JavaScript', pushed_at: '2026-07-30T00:00:00Z', fork: false },
    { name: 'Chintu1112', description: 'Personal', html_url: 'https://github.com/saichetankari2001/Chintu1112', language: 'TypeScript', pushed_at: '2026-07-01T00:00:00Z', fork: false },
    { name: 'some-fork', description: 'A fork', html_url: 'https://github.com/saichetankari2001/some-fork', language: 'JavaScript', pushed_at: '2026-06-01T00:00:00Z', fork: true },
  ]

  it('fetches, excludes forks and denylisted repos, and maps to the project shape', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(REPOS_RESPONSE),
    })
    const storage = createStorage()

    const projects = await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })

    expect(fetchImpl).toHaveBeenCalledWith(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`
    )
    expect(projects.map((p) => p.name)).toEqual(['booking-api', 'live-chat-room'])
    expect(projects[0]).toEqual({
      name: 'booking-api',
      description: 'Node/Express API',
      url: 'https://github.com/saichetankari2001/booking-api',
      language: 'TypeScript',
      pushedAt: '2026-07-29T00:00:00Z',
    })
  })

  it('returns a cached result within the TTL without calling fetch again', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(REPOS_RESPONSE),
    })
    const storage = createStorage()

    await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })
    await fetchGithubProjects({ fetchImpl, now: () => 2000, storage })

    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('returns an empty array when the request fails', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('network error'))
    const storage = createStorage()

    const projects = await fetchGithubProjects({ fetchImpl, now: () => 1000, storage })

    expect(projects).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/githubProjects.test.js`
Expected: FAIL — `src/githubProjects.js` does not exist.

- [ ] **Step 3: Write the implementation**

```js
export const GITHUB_USERNAME = 'saichetankari2001'
export const EXCLUDED_REPOS = ['Second_Project', 'Chintu1112']

const CACHE_KEY = 'portfolio:github-projects'
const CACHE_TTL_MS = 10 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function formatRelativeTime(isoDateString, now = Date.now()) {
  const diffMs = now - new Date(isoDateString).getTime()
  const days = Math.floor(diffMs / DAY_MS)

  if (days < 1) return 'pushed today'
  if (days < 30) return `pushed ${days}d ago`
  if (days < 365) return `pushed ${Math.floor(days / 30)}mo ago`
  return `pushed ${Math.floor(days / 365)}y ago`
}

function readCache(storage, now) {
  try {
    const raw = storage.getItem(CACHE_KEY)
    if (!raw) return null
    const { timestamp, projects } = JSON.parse(raw)
    if (now() - timestamp > CACHE_TTL_MS) return null
    return projects
  } catch {
    return null
  }
}

function writeCache(storage, now, projects) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now(), projects }))
  } catch {
    // storage unavailable (e.g. private browsing) — not fatal, just skip caching
  }
}

function toProject(repo) {
  return {
    name: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    language: repo.language,
    pushedAt: repo.pushed_at,
  }
}

export async function fetchGithubProjects({
  fetchImpl = fetch,
  now = () => Date.now(),
  storage = typeof window !== 'undefined' ? window.localStorage : undefined,
} = {}) {
  const cached = storage ? readCache(storage, now) : null
  if (cached) return cached

  try {
    const response = await fetchImpl(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`
    )
    if (!response.ok) return []
    const repos = await response.json()
    const projects = repos
      .filter((repo) => !repo.fork && !EXCLUDED_REPOS.includes(repo.name))
      .map(toProject)
    if (storage) writeCache(storage, now, projects)
    return projects
  } catch {
    return []
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/githubProjects.test.js`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add src/githubProjects.js src/githubProjects.test.js
git commit -m "feat: add GitHub project fetch/filter/cache logic"
```

---

### Task 8: `useGithubProjects` hook

**Files:**
- Create: `src/hooks/useGithubProjects.js`
- Test: `src/hooks/useGithubProjects.test.js`

**Interfaces:**
- Consumes: `fetchGithubProjects` from `../githubProjects` (Task 7).
- Produces: `useGithubProjects(): { projects: Project[], isLoading: boolean }`, consumed by `ProjectShowcase.jsx` (Task 11).

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGithubProjects } from './useGithubProjects'
import { fetchGithubProjects } from '../githubProjects'

vi.mock('../githubProjects', () => ({
  fetchGithubProjects: vi.fn(),
}))

describe('useGithubProjects', () => {
  it('starts loading and resolves with the fetched projects', async () => {
    const projects = [
      {
        name: 'booking-api',
        description: '',
        url: '',
        language: 'TypeScript',
        pushedAt: '2026-07-29T00:00:00Z',
      },
    ]
    fetchGithubProjects.mockResolvedValue(projects)

    const { result } = renderHook(() => useGithubProjects())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.projects).toEqual(projects)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useGithubProjects.test.js`
Expected: FAIL — `src/hooks/useGithubProjects.js` does not exist.

- [ ] **Step 3: Write the implementation**

```js
import { useEffect, useState } from 'react'
import { fetchGithubProjects } from '../githubProjects'

export function useGithubProjects() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchGithubProjects().then((result) => {
      if (!cancelled) {
        setProjects(result)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, isLoading }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useGithubProjects.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGithubProjects.js src/hooks/useGithubProjects.test.js
git commit -m "feat: add useGithubProjects hook"
```

---

### Task 9: `GithubProjectCard` component (Framer Motion introduced here)

**Files:**
- Modify: `package.json` (add `framer-motion` dependency)
- Modify: `src/test/setup.js` (add a `requestAnimationFrame` polyfill)
- Create: `src/components/GithubProjectCard.jsx`
- Create: `src/components/GithubProjectCard.css`
- Test: `src/components/GithubProjectCard.test.jsx`

**Interfaces:**
- Consumes: `formatRelativeTime` from `../githubProjects` (Task 7); a `project` prop shaped `{ name, description, url, language, pushedAt }` (the exact shape `fetchGithubProjects` produces).
- Produces: `GithubProjectCard` named export — `<GithubProjectCard project={project} />`, consumed by `ProjectShowcase.jsx` (Task 11).

- [ ] **Step 1: Install Framer Motion**

Run: `npm install framer-motion`
Expected: `package.json` gains `"framer-motion": "^<version>"` under `dependencies`, `package-lock.json` updates.

- [ ] **Step 2: Add a `requestAnimationFrame` polyfill to `src/test/setup.js`**

jsdom doesn't implement `requestAnimationFrame`, which Framer Motion relies on internally. Append:

```js
window.requestAnimationFrame =
  window.requestAnimationFrame || ((callback) => setTimeout(callback, 16))
window.cancelAnimationFrame =
  window.cancelAnimationFrame || ((id) => clearTimeout(id))
```

- [ ] **Step 3: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GithubProjectCard } from './GithubProjectCard'

const PROJECT = {
  name: 'booking-api',
  description: 'Node/Express + Prisma REST API.',
  url: 'https://github.com/saichetankari2001/booking-api',
  language: 'TypeScript',
  pushedAt: new Date().toISOString(),
}

describe('GithubProjectCard', () => {
  it('renders the project name, description, and a link to GitHub', () => {
    render(<GithubProjectCard project={PROJECT} />)
    expect(screen.getByText('booking-api')).toBeInTheDocument()
    expect(screen.getByText('Node/Express + Prisma REST API.')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', PROJECT.url)
  })

  it('shows the "synced from GitHub" indicator with a relative pushed time', () => {
    render(<GithubProjectCard project={PROJECT} />)
    expect(
      screen.getByText(/synced from GitHub · pushed today/)
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/components/GithubProjectCard.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 5: Write `src/components/GithubProjectCard.jsx`**

```jsx
import { motion } from 'framer-motion'
import { formatRelativeTime } from '../githubProjects'
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
      <p className="github-card-desc">{project.description}</p>
      <div className="github-card-sync">
        <span className="github-card-sync-dot" aria-hidden="true" />
        synced from GitHub · {formatRelativeTime(project.pushedAt)}
      </div>
    </motion.a>
  )
}
```

`whileInView` (IntersectionObserver-based) is deliberately not used — jsdom has no `IntersectionObserver`, so a mount-triggered `initial`/`animate` fade is used instead, which needs only the `requestAnimationFrame` polyfill from Step 2.

- [ ] **Step 6: Write `src/components/GithubProjectCard.css`**

```css
.github-card {
  position: relative;
  display: block;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  background: linear-gradient(160deg, #12151a, #0b0c10);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  text-decoration: none;
  color: inherit;
}

.github-card-lang-dot {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.github-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-primary);
}

.github-card-desc {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin: 0.6rem 0 0;
  line-height: 1.5;
}

.github-card-sync {
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-accent-teal);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.github-card-sync-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent-green);
  box-shadow: 0 0 6px var(--color-accent-green);
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run src/components/GithubProjectCard.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/test/setup.js src/components/GithubProjectCard.jsx src/components/GithubProjectCard.css src/components/GithubProjectCard.test.jsx
git commit -m "feat: add GithubProjectCard with Framer Motion hover/reveal"
```

---

### Task 10: `FeaturedProject` component

**Files:**
- Create: `src/components/FeaturedProject.jsx`
- Create: `src/components/FeaturedProject.css`
- Test: `src/components/FeaturedProject.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `FeaturedProject` named export — `<FeaturedProject />`, no props — consumed by `ProjectShowcase.jsx` (Task 11).

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedProject } from './FeaturedProject'

describe('FeaturedProject', () => {
  it("renders the TJ's Kebab Centre case study with its tech tags", () => {
    render(<FeaturedProject />)
    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
    expect(screen.getByText('React Native')).toBeInTheDocument()
    expect(screen.getByText('Firebase')).toBeInTheDocument()
    expect(
      screen.getByText(/three-app ordering ecosystem/i)
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/FeaturedProject.test.jsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/FeaturedProject.jsx`**

```jsx
import './FeaturedProject.css'

const TAGS = [
  { label: 'React', color: '#60a5fa' },
  { label: 'React Native', color: '#38bdf8' },
  { label: 'Node.js/Express', color: '#a3e635' },
  { label: 'Firebase', color: '#facc15' },
  { label: 'Twilio', color: '#f472b6' },
]

export function FeaturedProject() {
  return (
    <article className="featured-project">
      <div className="featured-project-badge">★ FEATURED CASE STUDY</div>
      <h3 className="featured-project-title">
        TJ's Kebab Centre — Full-Stack Food Ordering Ecosystem
      </h3>
      <p className="featured-project-summary">
        A complete three-app ordering ecosystem built independently for a live
        local restaurant — a customer web app, a React Native/Expo merchant
        tablet app, and an admin panel, all syncing in real time via
        Firestore.
      </p>
      <ul className="featured-project-highlights">
        <li>
          Customer web app with animated menus, a live Firestore-backed cart,
          and automated Twilio SMS + Nodemailer email order confirmations.
        </li>
        <li>
          React Native/Expo merchant app with live order alerts, an
          accept/prepare/complete workflow, PIN-based staff clock-in/out, and
          a revenue dashboard — shipped as an installable PWA across iOS,
          Android, Mac, and Web with no app store required.
        </li>
        <li>
          Node.js/Express REST API secured with Firebase ID token
          authentication on every endpoint and Firestore security rules
          enforcing per-collection access control.
        </li>
        <li>
          Diagnosed and fixed a cart data-corruption bug caused by
          non-unique IDs in static seed data, replacing it with live
          Firestore queries to eliminate shared-reference errors.
        </li>
      </ul>
      <div className="featured-project-tags">
        {TAGS.map((tag) => (
          <span
            key={tag.label}
            className="featured-project-tag"
            style={{ color: tag.color, borderColor: tag.color }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Write `src/components/FeaturedProject.css`**

```css
.featured-project {
  background: linear-gradient(160deg, #141820, #0e1015);
  border: 1px solid rgba(94, 234, 212, 0.2);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.featured-project-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--color-accent-teal);
}

.featured-project-title {
  font-size: 1.25rem;
  margin: 0.5rem 0 0.75rem;
}

.featured-project-summary {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.featured-project-highlights {
  margin: 1rem 0;
  padding-left: 1.1rem;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.6;
}

.featured-project-highlights li {
  margin-bottom: 0.5rem;
}

.featured-project-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.featured-project-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.25rem 0.6rem;
  border-radius: 5px;
  border: 1px solid;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/FeaturedProject.test.jsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/FeaturedProject.jsx src/components/FeaturedProject.css src/components/FeaturedProject.test.jsx
git commit -m "feat: add FeaturedProject case study with real TJ's Kebab content"
```

---

### Task 11: Rewrite `ProjectShowcase` as the composed bento grid

**Files:**
- Modify: `src/components/ProjectShowcase.jsx`
- Create: `src/components/ProjectShowcase.css`
- Modify: `src/components/ProjectShowcase.test.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Consumes: `FeaturedProject` (Task 10), `GithubProjectCard` (Task 9), `useGithubProjects` (Task 8).
- Produces: no interface change — `ProjectShowcase()` keeps its existing no-props signature, still renders `<section id="project">`.

This removes the old hardcoded single tjs-v6 case study and the `DEMO_URL`/"Coming Soon" placeholder — both are superseded by the real `FeaturedProject` case study and the live GitHub grid.

- [ ] **Step 1: Update the failing test in `src/components/ProjectShowcase.test.jsx`**

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectShowcase } from './ProjectShowcase'
import { useGithubProjects } from '../hooks/useGithubProjects'

vi.mock('../hooks/useGithubProjects')

describe('ProjectShowcase', () => {
  it('renders the featured case study and a card for each synced GitHub project inside a #project section', () => {
    useGithubProjects.mockReturnValue({
      isLoading: false,
      projects: [
        {
          name: 'booking-api',
          description: 'Node/Express + Prisma REST API.',
          url: 'https://github.com/saichetankari2001/booking-api',
          language: 'TypeScript',
          pushedAt: new Date().toISOString(),
        },
      ],
    })

    render(<ProjectShowcase />)

    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
    expect(screen.getByText('booking-api')).toBeInTheDocument()
    expect(document.querySelector('section#project')).not.toBeNull()
  })

  it('still renders the featured case study when no GitHub projects have loaded yet', () => {
    useGithubProjects.mockReturnValue({ isLoading: true, projects: [] })

    render(<ProjectShowcase />)

    expect(
      screen.getByRole('heading', { name: /TJ's Kebab Centre/ })
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProjectShowcase.test.jsx`
Expected: FAIL — current implementation renders the old tjs-v6 placeholder, not `FeaturedProject`/`GithubProjectCard`.

- [ ] **Step 3: Rewrite `src/components/ProjectShowcase.jsx`**

```jsx
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
```

- [ ] **Step 4: Write `src/components/ProjectShowcase.css`**

```css
.project {
  max-width: 1180px;
}

.project-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent-teal);
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.project-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.25rem;
  margin-top: 2rem;
}

.project-grid > .featured-project {
  grid-row: span 2;
}

@media (max-width: 720px) {
  .project-grid {
    grid-template-columns: 1fr;
  }

  .project-grid > .featured-project {
    grid-row: auto;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/ProjectShowcase.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Update `src/App.test.jsx` to mock the GitHub hook**

`App.test.jsx` renders the full tree, which now includes `ProjectShowcase` → `useGithubProjects` → `fetchGithubProjects`, which would otherwise call the real global `fetch` during the test run. Add a mock alongside the existing two:

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
vi.mock('./hooks/useGithubProjects', () => ({
  useGithubProjects: () => ({ projects: [], isLoading: false }),
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

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: all test files pass, with no real network call made during the run.

- [ ] **Step 8: Commit**

```bash
git add src/components/ProjectShowcase.jsx src/components/ProjectShowcase.css src/components/ProjectShowcase.test.jsx src/App.test.jsx
git commit -m "feat: compose ProjectShowcase from the featured case study and live GitHub grid"
```

---

### Task 12: Real `About` content and skills

**Files:**
- Modify: `src/components/About.jsx`
- Create: `src/components/About.css`
- Modify: `src/components/About.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: no interface change — `About()` keeps its existing no-props signature.

- [ ] **Step 1: Update the failing test in `src/components/About.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the About heading and bio copy inside an #about section', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText(/TJ's Kebab Centre/)).toBeInTheDocument()
    expect(
      screen.getByText(/Swinburne University of Technology/)
    ).toBeInTheDocument()
    expect(document.querySelector('section#about')).not.toBeNull()
  })

  it('renders grouped skill tags sourced from the resume', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(screen.getByText('React Native (Expo)')).toBeInTheDocument()
    expect(screen.getByText('Google Gemini AI')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/About.test.jsx`
Expected: FAIL — no Swinburne mention, no skill groups in the current implementation.

- [ ] **Step 3: Rewrite `src/components/About.jsx`**

```jsx
import './About.css'

const SKILL_GROUPS = [
  {
    label: 'Frontend',
    skills: ['React', 'React Native (Expo)', 'Three.js', 'Framer Motion'],
  },
  {
    label: 'Backend & Data',
    skills: ['Node.js', 'Express', 'Firebase', 'REST APIs', 'MySQL'],
  },
  {
    label: 'Cloud & DevOps',
    skills: ['AWS', 'Oracle Cloud', 'Docker', 'Linux', 'Git/GitHub'],
  },
  {
    label: 'AI & Integrations',
    skills: ['Google Gemini AI', 'Groq API', 'Twilio', 'Nodemailer'],
  },
]

export function About() {
  return (
    <section className="about" id="about">
      <h2>About</h2>
      <p>
        I'm a final-semester Master of Information Technology student
        (Software Development specialisation) at Swinburne University of
        Technology, based in Melbourne. I independently designed, built, and
        deployed a live three-app production ordering system for TJ's Kebab
        Centre — a real restaurant — handling everything from architecture
        and real-time data sync to security and deployment. I'm comfortable
        owning a project end-to-end and debugging across the full stack,
        from a React front end down to cloud infrastructure.
      </p>
      <div className="skill-groups">
        {SKILL_GROUPS.map((group) => (
          <div className="skill-group" key={group.label}>
            <h3 className="skill-group-label">{group.label}</h3>
            <div className="skill-tags">
              {group.skills.map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/components/About.css`**

```css
.skill-groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .skill-groups {
    grid-template-columns: 1fr;
  }
}

.skill-group-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--color-accent-teal);
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skill-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/About.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/About.jsx src/components/About.css src/components/About.test.jsx
git commit -m "feat: rewrite About with real bio and resume-sourced skill groups"
```

---

### Task 13: Real `Contact` links

**Files:**
- Modify: `src/components/Contact.jsx`
- Create: `src/components/Contact.css`
- Modify: `src/components/Contact.test.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: no interface change — `Contact()` keeps its existing no-props signature.

- [ ] **Step 1: Update the failing test in `src/components/Contact.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders email, phone, GitHub, and LinkedIn links with correct hrefs inside a #contact section', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:karisaichetan@gmail.com'
    )
    expect(screen.getByRole('link', { name: 'Phone' })).toHaveAttribute(
      'href',
      'tel:+61401800149'
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/saichetankari2001'
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/sai-chetan-kari-927b9b309/'
    )
    expect(document.querySelector('section#contact')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: FAIL — placeholder links, no phone link.

- [ ] **Step 3: Rewrite `src/components/Contact.jsx`**

```jsx
import './Contact.css'

const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:karisaichetan@gmail.com' },
  { label: 'Phone', href: 'tel:+61401800149' },
  { label: 'GitHub', href: 'https://github.com/saichetankari2001' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sai-chetan-kari-927b9b309/' },
]

export function Contact() {
  return (
    <section className="contact" id="contact">
      <h2>Building something? Let's talk.</h2>
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

- [ ] **Step 4: Write `src/components/Contact.css`**

```css
.contact-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.contact-links a {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: color 0.2s var(--ease-standard), border-color 0.2s var(--ease-standard);
}

.contact-links a:hover {
  color: var(--color-accent-teal);
  border-color: var(--color-accent-teal);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.css src/components/Contact.test.jsx
git commit -m "feat: add real contact links including phone"
```

---

### Task 14: Full-suite and production-build verification

**Files:**
- None created — this task verifies the completed app, no source changes expected unless verification surfaces a bug.

**Interfaces:**
- Consumes: the complete app from Tasks 1–13.
- Produces: a verified `dist/` production build, ready to deploy.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: every test file passes, with no real network calls made.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: completes with no errors, produces a `dist/` directory.

- [ ] **Step 3: Serve the production build locally**

Run: `npm run preview`
Open the printed local URL.

- [ ] **Step 4: Manually verify the full page in the browser**

Confirm all of the following:
- Nav shows "Saichetan Kari" over a blurred glass background; "Work" scrolls to the projects section.
- Hero shows the "Open to Software Developer roles" pulsing badge, "Saichetan Kari" / "Full-Stack Software Developer", and the teal/green coil scene responding to mouse movement.
- Aurora blobs and rising particles drift behind the page; content stays readable on top.
- Scrolling reveals About (real bio + four resume-sourced skill groups), Projects (the TJ's Kebab featured tile plus real GitHub cards for `booking-api`, `live-chat-room`, and `Agent_Chintu` — open dev tools Network tab and confirm a request to `api.github.com/users/saichetankari2001/repos` actually fires and returns real data), and Contact (working `mailto:`, `tel:`, GitHub, and LinkedIn links).
- Toggle `prefers-reduced-motion` in dev tools and reload — aurora blobs/particles disappear, the hero eyebrow dot stops pulsing, hero renders the static fallback.
- Resize to 375px width — confirm the project grid collapses to a single column and nothing overflows horizontally.
- In Chrome DevTools → More tools → Sensors, override device orientation and confirm the hero coil's parallax responds.

- [ ] **Step 5: Commit fixes if verification surfaced any**

```bash
git add -A
git commit -m "fix: address issues found during v2 build verification"
```

If no fixes were needed, skip this step.

---

### Task 15: Push to GitHub and deploy to Vercel

**Files:**
- None — this is an operational task, no source changes.

**Interfaces:**
- Consumes: the verified build from Task 14.
- Produces: all local commits pushed to `github.com/saichetankari2001/Second_Project`, and a live public deployment on a `*.vercel.app` subdomain.

- [ ] **Step 1: Push all commits to GitHub**

Run: `git push origin master`
Expected: all local commits (the 18 pre-existing ones plus every commit from Tasks 1–14 of this plan) are pushed to `origin/master`. This is the "push it to GitHub" step explicitly requested — do this only after Task 14's verification passes.

- [ ] **Step 2: Deploy to Vercel**

Run: `npx vercel --version`

If this prompts to install the `vercel` package, accept — it's a one-time local install, not a global system change.

Run: `npx vercel login` if not already authenticated (this opens a browser to complete GitHub/email login — genuinely interactive, cannot be scripted further).

Once authenticated, run: `npx vercel --prod --yes`
Expected: Vercel detects the Vite project automatically, builds it, and prints a live production URL on a `*.vercel.app` subdomain.

- [ ] **Step 3: Verify the live deployment**

Open the printed production URL in a browser. Confirm the same checks from Task 14 Step 4 pass on the live deployment (particularly the GitHub API fetch, since CORS/network behavior can differ from local `npm run preview`).

- [ ] **Step 4: Report the live URL**

Share the deployed URL — this is the link to put on the resume/LinkedIn/job applications.
