import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import Navbar from './Navbar'

vi.mock('../../../assets/icons/LogoBlue', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}))

describe('Navbar', () => {
  it('renders the logo and title', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByText('Journal of Digital History')).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument()
    expect(screen.getByTestId('HomeOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('NotesIcon')).toBeInTheDocument()
    expect(screen.getByTestId('NotesOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('DescriptionIcon')).toBeInTheDocument()
    expect(screen.getByTestId('DescriptionOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CampaignIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CampaignOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('AutoStoriesIcon')).toBeInTheDocument()
    expect(screen.getByTestId('AutoStoriesOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument()
    expect(screen.getByTestId('PersonOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('LinkIcon')).toBeInTheDocument()
    expect(screen.getByTestId('LinkOutlinedIcon')).toBeInTheDocument()
  })

  it('highlights the active item based on location', () => {
    render(
      <MemoryRouter initialEntries={['/articles']}>
        <Navbar />
      </MemoryRouter>,
    )
    const articlesItem = screen.getByText('Articles').closest('li')
    expect(articlesItem).toHaveClass('active')
  })
})
