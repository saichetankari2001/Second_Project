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
