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
