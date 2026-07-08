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
