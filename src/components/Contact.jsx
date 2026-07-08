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
