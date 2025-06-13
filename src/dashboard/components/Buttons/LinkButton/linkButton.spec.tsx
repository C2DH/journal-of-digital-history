import { render, screen } from '@testing-library/react'

import LinkButton from './LinkButton'

describe('ButtonLink', () => {
  it('renders the Github icon and link with path for github.com', () => {
    const url = 'https://github.com/user/repo'
    render(<LinkButton url={url} />)

    expect(screen.getByRole('button')).toHaveTextContent('/user/repo')
    expect(screen.getByRole('link')).toHaveAttribute('href', url)
    // The Github icon should be present (by title or svg role)
    expect(screen.getByTestId('github-icon')).toBeInTheDocument()
  })

  it('renders the domain name and no icon if not a github.com url', () => {
    const url = 'https://example.com/user/repo'
    render(<LinkButton url={url} />)

    expect(screen.getByRole('button')).toHaveTextContent('/user/repo')
    // The Github icon should NOT be present
    expect(screen.queryByTestId('github-icon')).toBeNull()
  })
})
