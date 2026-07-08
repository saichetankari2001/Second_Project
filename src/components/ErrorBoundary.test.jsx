import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function ThrowingComponent() {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('renders the fallback when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">fallback</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('fallback')).toBeInTheDocument()
    consoleError.mockRestore()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">fallback</div>}>
        <div data-testid="child">child</div>
      </ErrorBoundary>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.queryByTestId('fallback')).toBeNull()
  })
})
