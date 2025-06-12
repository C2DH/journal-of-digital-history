import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from './Navbar'

const items = [
  { href: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: 'articles', label: 'Articles', icon: 'article' },
]

vi.mock('../../../../src/components/Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}))

describe('Navbar', () => {
  it('renders the logo and title', () => {
    const print = render(
      <MemoryRouter>
        <Navbar items={items} />
      </MemoryRouter>,
    )
    console.log(print.container.innerHTML)
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByText('Journal of Digital History')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Navbar items={items} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Articles')).toBeInTheDocument()
  })

  it('highlights the active item based on location', () => {
    render(
      <MemoryRouter initialEntries={['/articles']}>
        <Navbar items={items} />
      </MemoryRouter>,
    )
    const articlesItem = screen.getByText('Articles').closest('li')
    expect(articlesItem).toHaveClass('active')
  })
})
