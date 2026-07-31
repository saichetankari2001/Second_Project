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
