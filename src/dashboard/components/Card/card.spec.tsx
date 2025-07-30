import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Card from './Card'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock useLocation
const mockLocation = vi.fn()
vi.mock('react-router', () => ({
  useLocation: () => mockLocation,
}))

// Mock Table and Loading to simplify test output
vi.mock('../Table/Table', () => ({
  default: () => <div data-testid="table-mock" />,
}))
vi.mock('../Loading/Loading', () => ({
  default: () => <div data-testid="loading-mock" />,
}))

describe('Card', () => {
  const defaultProps = {
    item: 'abstracts',
    headers: ['title', 'author'],
    data: [{ title: 'Test Title', author: 'Test Author' }],
    error: null,
    loading: false,
    hasMore: false,
    loadMore: vi.fn(),
  }

  it('renders the card and table', () => {
    render(<Card {...defaultProps} />)
    expect(screen.getByText('abstracts.item')).toBeInTheDocument()
    expect(screen.getByTestId('table-mock')).toBeInTheDocument()
  })

  it('renders error state', () => {
    render(<Card {...defaultProps} error={{ response: 'Something went wrong' }} />)
    expect(screen.getByText('error.title')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows loading indicator when loading and has data', () => {
    render(<Card {...defaultProps} loading={true} data={[{ title: 'A', author: 'B' }]} />)
    expect(screen.getByTestId('loading-mock')).toBeInTheDocument()
  })

  it('does not show loading indicator when loading and no data', () => {
    render(<Card {...defaultProps} loading={true} data={[]} />)
    expect(screen.queryByTestId('loading-mock')).not.toBeInTheDocument()
  })
})
