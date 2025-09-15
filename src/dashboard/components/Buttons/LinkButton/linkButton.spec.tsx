import { render, screen } from '@testing-library/react'

import LinkButton from './LinkButton'

describe('ButtonLink', () => {
  it('renders the Github icon and link with path for github.com', () => {
    const url = 'https://github.com/user/repo'
    render(<LinkButton url={url} />)

    expect(screen.getByTestId('link-button')).toHaveTextContent('/user/repo')
    expect(screen.getByRole('link')).toHaveAttribute('href', url)
    expect(screen.getByTestId('github-icon')).toBeInTheDocument()
  })
  it('renders the Binder icon', () => {
    const url = 'https://mybinder.org/blabla'
    render(<LinkButton url={url} />)

    expect(screen.getByTestId('binder-icon')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', url)
  })
  it('renders the Preview icon', () => {
    const url = 'https://journalofdigitalhistory.org/notebook-viewer/blabla'
    render(<LinkButton url={url} />)

    expect(screen.getByTestId('preview-icon')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', url)
  })
  it('renders the domain name and a random link icon attributed', () => {
    const url = 'https://example.com/user/repo'
    render(<LinkButton url={url} />)

    expect(screen.getByTestId('link-button')).toHaveTextContent('/user/repo')
    expect(screen.queryByTestId('link-icon')).toBeInTheDocument()
  })
})
