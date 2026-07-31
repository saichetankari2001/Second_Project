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
