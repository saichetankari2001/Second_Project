# Portfolio Site v2 — Design Spec

**Status:** Approved, ready for implementation planning.

## Context

The portfolio site (this repo) was previously built as a single-page Vite + React app with a placeholder hero, a hardcoded single project case study, and no real content — see `docs/superpowers/specs/2026-07-08-portfolio-site-design.md` and `docs/superpowers/plans/2026-07-08-portfolio-site.md` for the original build. That version is functional (Hero3DScene, GSAP ScrollTrigger reveals, reduced-motion support, a full Vitest suite) but was never deployed and never got real content.

This spec covers the v2 redesign: real content for Saichetan Kari (final-semester Master of IT student at Swinburne, targeting Full-Stack Software Developer roles), a visual overhaul, a live GitHub-synced multi-project grid (replacing the single hardcoded case study), device-orientation ("motion sensor") support extending the existing pointer-based hero parallax, and first-time public deployment.

## Visual System

- **Palette:** graphite base (`#08090c` background, `#12151a`/`#0b0c10` card gradients) with a two-tone accent — teal-mint (`#5eead4`) for primary glow/CTAs, terminal-green (`#22c55e`) for "live/synced" status indicators (a git-status visual pun). Replaces the original spec's near-black/pure-cyan palette, which read as "gamer RGB" rather than professional.
- **Typography:** Inter (UI text, headings) + JetBrains Mono (labels, tags, technical accents — eyebrow badges, terminal widget, tech tags). Replaces the original spec's Playfair Display serif, which no longer fits the more technical/dev-tool direction.
- **Motion libraries:** GSAP + ScrollTrigger is kept specifically for the scroll-scrubbed hero (`scrollAnimations.js` already drives the 3D scene via a plain ref — the right tool for that scrub-linked job). **Framer Motion is newly introduced** for all other motion: card hover/tap states, the cursor-follow spotlight on project cards, stagger-reveal of the bento grid on scroll into view, and the hero tilt panel's spring-physics response. This is a real skill of the site's subject (confirmed via resume), not just an aesthetic choice.
- **Background texture:** animated aurora blobs (slow morphing radial gradients), a faint drifting grid-mesh, and slow-rising ember particles — all `transform`/`opacity` only, all disabled under `prefers-reduced-motion` alongside the existing hero fallback behavior.
- **Signature extra pieces:** a terminal-style typing widget beneath the hero (cycles short lines like a real shell prompt) and an infinite-scrolling tech-stack marquee. Both respect reduced-motion (static text shown, no animation).
- Approved via interactive HTML prototype during brainstorming (`.superpowers/brainstorm/` — not committed, gitignored). The final `full-prototype-v2.html` iteration is the reference for visual tone; it is not final markup.

## Content & Positioning

- **Name / role:** Saichetan Kari — **Full-Stack Software Developer**. Final-semester Master of Information Technology (Specialisation: Software Development), Swinburne University of Technology, Melbourne VIC, expected November 2026.
- **Positioning rationale:** the project mix (Express/Prisma REST APIs, a FastAPI+React real-time app, a Gemini-based tool-using AI agent, a production Firebase/React Native ecosystem) supports a credible full-stack generalist headline. The About section explicitly calls out AI-agent and real-time-systems work as differentiators rather than leading with an unproven "AI Engineer" title.
- **Contact:** `karisaichetan@gmail.com`, `+61 401 800 149` (public, per explicit approval), LinkedIn (`https://www.linkedin.com/in/sai-chetan-kari-927b9b309/`), GitHub (`github.com/saichetankari2001`). No contact form/backend — direct links only.
- **Resume button:** dropped from this build (no PDF ready yet). Follow-up item, not in scope now.
- **Skills strip:** grouped tag chips sourced directly from the resume, not invented — Frontend (React, React Native/Expo, Three.js, Framer Motion), Backend & Data (Node.js, Express, Firebase, REST APIs, Prisma/PostgreSQL), Cloud & DevOps (AWS, Oracle Cloud, Docker, Linux, Git), AI & Integrations (Google Gemini AI, Groq API, Twilio, Nodemailer).

### Projects

**Featured case study** (large bento tile, hand-written — not GitHub-sync'd): **TJ's Kebab Centre — Full-Stack Food Ordering Ecosystem**. Rewritten from the resume, not the old placeholder single-admin-panel description:
- Three-app ecosystem — customer web app, React Native/Expo merchant tablet app, admin panel — syncing in real time via Firestore.
- Customer app: animated menus, live Firestore-backed cart, automated Twilio SMS + Nodemailer email confirmations.
- Merchant app: live order alerts, accept/prepare/complete workflow, PIN-based staff clock-in/out, revenue dashboard; shipped as an installable PWA across iOS/Android/Mac/Web with no app store.
- Node.js/Express REST API secured with Firebase ID token auth on every endpoint plus Firestore security rules.
- A concrete debugging story: fixed a cart data-corruption bug caused by non-unique IDs in static seed data by moving to live Firestore queries.
- Tech tags: React, React Native (Expo), Node.js/Express, Firebase (Firestore/Auth/Hosting), Twilio, Three.js.

**Auto-synced grid** (live client-side GitHub API fetch, no build step, no server): `booking-api` (Node/Express/Prisma REST API, JWT auth, Docker, CI), `live-chat-room` (FastAPI/WebSockets backend + React/Vite/TypeScript frontend, real-time no-auth chat), `Agent_Chintu` (Python, Google Gemini tool-using agent — web search via Tavily, sandboxed file read/write, Python code execution — Gradio UI). Any new public repo pushed to `github.com/saichetankari2001` after launch appears automatically on next page load — this is the "push a project, it shows up" requirement.

**Filtering approach (revised during implementation):** the account has 17 public repos, most of them coursework/practice throwaways (`First_Demo`, `Hello-Swinburne`, `ATMMachine`, etc.). A denylist of just the two known non-portfolio repos (`Second_Project`, `Chintu1112`) let all of that noise through. The fetch logic uses an **allowlist** (`ALLOWED_REPOS`) instead — only `booking-api`, `live-chat-room`, and `Agent_Chintu` render. Adding a genuinely new project later means adding its repo name to that one-line list. SACA and the Multi-Cloud Photo Album project (also on the resume) are explicitly **out of scope** for this build per direct instruction — not added now, can be a future follow-up.

## Architecture

### GitHub project sync

A new module (e.g. `src/githubProjects.js`) fetches `https://api.github.com/users/saichetankari2001/repos?sort=pushed&per_page=100` client-side on mount, filters out forks and the denylisted repo names above, maps each remaining repo to a card (name, description, primary language → color dot, `pushed_at` → "pushed Xd ago"), and renders them after the hand-written featured TJ's Kebab tile in the bento grid. Unauthenticated GitHub API calls are capped at 60/hour per IP — acceptable for a personal portfolio's traffic; response is cached in `localStorage` with a short TTL (e.g. 10 minutes) so repeat visits within that window don't re-hit the API. Fetch failure (rate limit, offline) falls back to showing just the featured case study with no error state exposed to the visitor — the site must not look broken if GitHub is unreachable.

### Motion sensor (device orientation)

Extends the existing pointer-driven hero parallax (`Hero3DScene.jsx`'s `pointer` ref, already lerped into camera position) with a second input source: `window.ondeviceorientation`, normalized the same way pointer coordinates are today, feeding the same camera-lerp logic — not a separate code path. On iOS Safari, `DeviceOrientationEvent.requestPermission()` requires a user gesture, so a small "Enable motion" affordance appears only when that API exists and permission is `'default'`; other browsers get orientation access without a prompt. Like all motion in this app, it's skipped entirely when `prefers-reduced-motion` is set — the existing `usePrefersReducedMotion` hook already gates the whole 3D scene, so no new reduced-motion logic is needed here, only wiring the new input source into the existing gated component.

### Deployment

Deploy to Vercel, connected to the existing GitHub repo (`saichetankari2001/Second_Project`), on Vercel's free `.vercel.app` subdomain. Vercel auto-detects the Vite build (`npm run build` → `dist/`) with no extra config. Custom domain is a future follow-up, not in scope now.

## Testing

Existing Vitest + React Testing Library conventions continue: unit tests for the GitHub fetch/filter/cache logic (mocking `fetch`), unit tests for the updated content components (About, the rewritten ProjectShowcase featured tile, Contact with the three real links), and the existing reduced-motion/lazy-load tests remain as-is. The 3D scene and device-orientation wiring remain manually verified in-browser (as the original plan already established for WebGL-dependent code) rather than unit tested.

## Out of Scope

- SACA and Multi-Cloud Photo Album projects (explicitly declined for this build).
- Resume PDF download button (no file ready yet).
- Contact form / backend (direct links only).
- Custom domain (Vercel subdomain only for now).
- Build-time GitHub sync / redeploy webhooks (client-side fetch chosen instead — simpler, no moving parts).
