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
