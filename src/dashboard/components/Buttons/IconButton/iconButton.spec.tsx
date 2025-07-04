import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import IconButton from './IconButton'

vi.mock('../../../utils/helpers/table', () => ({
  convertOrcid: (val: string) => `https://orcid.org/${val}`,
}))

describe('IconButton', () => {
  it('renders Github icon for github url', () => {
    render(<IconButton value="https://github.com/user" />)
    expect(screen.getByTestId('github-icon')).toBeInTheDocument()
  })

  it('renders ORCID icon for orcid url', () => {
    render(<IconButton value="https://orcid.org/0000-0002-1825-0097" />)
    expect(screen.getByTestId('orcid-icon')).toBeInTheDocument()
  })

  it('renders main domain for unknown url', () => {
    render(<IconButton value="https://example.com" />)
    expect(screen.getByText('example')).toBeInTheDocument()
  })

  it('converts non-http value using convertOrcid', () => {
    render(<IconButton value="0000-0002-1825-0097" />)
    expect(screen.getByTestId('orcid-icon')).toBeInTheDocument()
  })

  it('opens link in new tab when clicked', () => {
    window.open = vi.fn()
    render(<IconButton value="https://github.com/user" />)
    fireEvent.click(screen.getByRole('button'))
    expect(window.open).toHaveBeenCalledWith('https://github.com/user', '_blank')
  })
})
