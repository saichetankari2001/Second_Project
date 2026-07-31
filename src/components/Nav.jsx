import './Nav.css'

export function Nav() {
  return (
    <nav className="nav">
      <span className="nav-logo">Your Name</span>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#project">Project</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  )
}
