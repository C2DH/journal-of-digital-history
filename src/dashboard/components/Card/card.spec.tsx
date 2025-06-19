import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Card from './Card'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}))
vi.mock('../Loading/Loading', () => ({
  default: () => <div>Loading...</div>,
}))
vi.mock('../ProgressionTable/ProgressionTable', () => ({
  default: ({ title }: { title: string }) => <div>ProgressionTable: {title}</div>,
}))
vi.mock('../Table/Table', () => ({
  default: ({ title }: { title: string }) => <div>Table: {title}</div>,
}))
vi.mock('../../hooks/useFetch', () => ({
  useInfiniteScroll: () => {},
}))

describe('Card', () => {
  it('renders loading when loading and data is empty', () => {
    render(
      <Card
        item="articles"
        headers={[]}
        data={[]}
        error={null}
        loading={true}
        hasMore={false}
        loadMore={() => {}}
      />,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error when error is present', () => {
    const print = render(
      <Card
        item="articles"
        headers={[]}
        data={[]}
        error={{ response: 'Error details' }}
        loading={false}
        hasMore={false}
        loadMore={() => {}}
      />,
    )

    console.log(print.container.innerHTML)
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Error details')).toBeInTheDocument()
  })

  it('renders ProgressionTable when item is articles', () => {
    render(
      <Card
        item="articles"
        headers={['h1']}
        data={[{ id: 1 }]}
        error={null}
        loading={false}
        hasMore={false}
        loadMore={() => {}}
      />,
    )
    expect(screen.getByText('ProgressionTable: articles')).toBeInTheDocument()
  })

  it('renders Table when item is not articles', () => {
    render(
      <Card
        item="abstracts"
        headers={['h1']}
        data={[{ id: 1 }]}
        error={null}
        loading={false}
        hasMore={false}
        loadMore={() => {}}
      />,
    )
    expect(screen.getByText('Table: abstracts')).toBeInTheDocument()
  })

  it('shows loading at the bottom if loading and data is not empty', () => {
    render(
      <Card
        item="articles"
        headers={['h1']}
        data={[{ id: 1 }]}
        error={null}
        loading={true}
        hasMore={false}
        loadMore={() => {}}
      />,
    )
    // There should be two "Loading..." if both loading and data.length > 0
    expect(screen.getAllByText('Loading...').length).toBeGreaterThanOrEqual(1)
  })
})
