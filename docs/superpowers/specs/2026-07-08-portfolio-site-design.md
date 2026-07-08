# Personal Portfolio Site — Design Spec

## Purpose

A single-page personal developer portfolio, inspired visually by a cinematic
Web3 site (Three.js particle tunnel + GSAP ScrollTrigger transitions) shared
by the user. The site's job is to showcase the user as a software developer,
centered on one real, substantial project: **tjs-v6**, the admin panel for
TJ's Kebab Centre, a live production restaurant business the user also
manages day-to-day.

This is not a demo/toy portfolio — the centerpiece project is real, shipped,
production software.

## Structure

Single scroll-based page, no routing, four sections in order:

1. **Hero**
   - Full-viewport Three.js particle tunnel scene (react-three-fiber)
   - Name + title/tagline, scroll cue
   - This is the visual signature of the site, matching the reel's tech
     approach (particle tunnel, cinematic feel)

2. **About**
   - Short bio (a few sentences): who the user is, that they're a developer
     who also runs a real business — the narrative hook is "I build software
     for the shop I help manage."
   - No separate skills grid — skills are demonstrated by the project, not
     listed.

3. **Project Showcase — tjs-v6**
   - The sole, deep case study on the page.
   - Content: problem → approach → tech stack → outcome, written as
     case-study copy.
   - Screenshots captured from the real app.
   - A "Live Demo" link pointing at a sanitized/demo-mode version of tjs-v6
     (see Out of Scope below — this link may show "coming soon" until that
     work exists).
   - Presented via GSAP ScrollTrigger-driven reveals, consistent with the
     hero's cinematic feel.

4. **Contact**
   - Simple icon links: email, GitHub, LinkedIn.
   - No contact form, no backend.

Sections are connected by GSAP ScrollTrigger — scene/camera changes and
content reveals are tied to scroll position, the same technique used in the
reference site.

## Visual Design

- **Palette**: matches the reference reel exactly — near-black base
  (`#05070d` family) with electric blue/cyan glow accents (`#38e0ff`
  family). Explicitly does **not** reuse tjs-v6's amber/charcoal brand — this
  site has its own identity, separate from the tjs-v6 product.
- **Typography**: editorial serif display font for headlines (premium/studio
  feel) paired with a clean grotesk sans for body text and UI labels.
- **Motion**: one set of GSAP easing curves defined once and reused
  throughout (same discipline as tjs-v6's design token system) — no
  mismatched transition speeds between sections.
- **Atmosphere**: ambient glow + subtle film grain overlay, consistent with
  the reference site's dark cinematic look.
- **Accessibility**: `prefers-reduced-motion` is respected — the hero falls
  back to a static/simplified scene when set, both for accessibility and for
  low-end devices.

## Tech Architecture

- **React + Vite** — component-based, same stack family as tjs-v6 so
  patterns/skills transfer directly.
- **react-three-fiber** for the 3D particle tunnel hero (chosen over raw
  Three.js for cleaner component structure, consistent with the user's
  earlier preference).
- **GSAP + ScrollTrigger** for scroll-linked camera and content animation.
- **No backend** — fully static site. Deploys to Vercel or Netlify as a
  static build (`vite build` output).
- The 3D scene is lazy-loaded so the rest of the page isn't blocked behind
  WebGL initialization.

Suggested component breakdown:
```
src/
  components/
    Hero3D.jsx        -- particle tunnel scene (r3f), scroll-reactive
    About.jsx
    ProjectShowcase.jsx -- tjs-v6 case study
    Contact.jsx
  App.jsx
  main.jsx
vite.config.js
```

## Content Plan

- **Hero copy**: user's name + a short title/tagline. Exact wording is a
  placeholder to be filled in later (e.g. "Software Developer" or something
  more specific).
- **About copy**: a few sentences on who the user is and the
  developer/shop-manager narrative.
- **tjs-v6 case study copy**: problem, approach, tech stack, outcome —
  written once real screenshots are available.
- **Contact info**: user's email, GitHub URL, LinkedIn URL.

## Out of Scope

- **Sanitized demo-mode version of tjs-v6** — building a fake-data,
  read-only demo of the real admin panel is a separate mini-project against
  the tjs-v6 codebase itself, not part of this portfolio site. The
  portfolio's "Live Demo" link depends on that work existing but does not
  include building it.
- Additional projects beyond tjs-v6 — the user currently has one project to
  showcase. The design doesn't need to generalize to a multi-project grid
  right now; that can be revisited if/when a second project exists.
- Resume/CV download, dedicated skills list, and contact form were
  explicitly declined during design.

## Open Questions (to resolve before/during implementation)

- Exact hero tagline/copy and About bio text — user to provide.
- tjs-v6 screenshots — need to be captured from the real app before the
  Project Showcase section can be finalized visually.
