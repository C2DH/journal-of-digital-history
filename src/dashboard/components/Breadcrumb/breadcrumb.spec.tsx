import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Breadcrumb from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders Home link always', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumb />
      </MemoryRouter>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders breadcrumb for nested path', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/abstracts/123']}>
        <Breadcrumb />
      </MemoryRouter>,
    )

    // Home is always a link
    expect(screen.getByText('Home').closest('a')).toBeTruthy()

    // "dashboard" and "abstracts" should be links
    expect(screen.getByText('dashboard').closest('a')).toBeTruthy()
    expect(screen.getByText('abstracts').closest('a')).toBeTruthy()

    // "123" should NOT be a link
    const lastSegment = screen.getByText('/123')
    expect(lastSegment.closest('a')).toBeNull()
  })
})
