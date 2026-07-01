import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PeerReviewChart from './PeerReviewChart'

const mockUseSuspenseQuery = vi.fn()
const mockUseQuery = vi.fn()

let clickPayload: { seriesId: string; dataIndex: number } = { seriesId: 'assign', dataIndex: 0 }

vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: (...args: any[]) => mockUseSuspenseQuery(...args),
  useQuery: (...args: any[]) => mockUseQuery(...args),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@mui/x-charts', () => ({
  BarChart: ({ onItemClick }: { onItemClick?: (event: unknown, d: any) => void }) => (
    <button data-testid="peerreview-barchart" onClick={() => onItemClick?.({}, clickPayload)}>
      chart
    </button>
  ),
}))

vi.mock('../SmallCard/SmallCard', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <section data-testid="small-card" className={className}>
      {children}
    </section>
  ),
}))

vi.mock('../Legend/Legend', () => ({
  default: () => <div data-testid="legend">legend</div>,
}))

vi.mock('../SmallTable/SmallTable', () => ({
  default: ({
    placeholder,
    loading,
    data,
  }: {
    placeholder: boolean
    loading: boolean
    data: Array<{ title?: string }>
  }) => (
    <div
      data-testid="small-table"
      data-placeholder={String(placeholder)}
      data-loading={String(loading)}
      data-count={String(data?.length ?? 0)}
    >
      {data?.[0]?.title ?? 'no-data'}
    </div>
  ),
}))

describe('PeerReviewChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clickPayload = { seriesId: 'assign', dataIndex: 0 }

    mockUseSuspenseQuery.mockReturnValue({
      data: [{ order: 'R1', assign: 1, awaiting: 0, review: 0, reviewer: 0, revising: 0 }],
    })

    mockUseQuery.mockReturnValue({
      data: [
        {
          key: 'assign-R1',
          articles: [
            {
              pid: '1',
              authors: 'Alice',
              title: 'Matched article',
              substatus: ['ok'],
              url: 'http://example.test',
            },
          ],
        },
      ],
    })
  })

  it('renders chart, titles, legend and initial placeholder table state', () => {
    render(<PeerReviewChart />)

    expect(screen.getByText('KPI.peerReviewChart.title')).toBeInTheDocument()
    expect(screen.getByText('KPI.peerReviewChart.table.title')).toBeInTheDocument()
    expect(screen.getByTestId('peerreview-barchart')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()

    const table = screen.getByTestId('small-table')
    expect(table.getAttribute('data-placeholder')).toBe('true')
    expect(table.getAttribute('data-loading')).toBe('false')
  })

  it('updates table data and removes placeholder after a matching bar click', async () => {
    render(<PeerReviewChart />)

    fireEvent.click(screen.getByTestId('peerreview-barchart'))

    await waitFor(() => {
      const table = screen.getByTestId('small-table')
      expect(table.getAttribute('data-placeholder')).toBe('false')
      expect(table.getAttribute('data-loading')).toBe('false')
      expect(table.getAttribute('data-count')).toBe('1')
      expect(screen.getByText('Matched article')).toBeInTheDocument()
    })
  })

  it('keeps placeholder when clicked key has no matching details item', async () => {
    clickPayload = { seriesId: 'review', dataIndex: 2 } // review-R3 not in mocked data
    render(<PeerReviewChart />)

    fireEvent.click(screen.getByTestId('peerreview-barchart'))

    await waitFor(() => {
      const table = screen.getByTestId('small-table')
      expect(table.getAttribute('data-placeholder')).toBe('true')
      expect(table.getAttribute('data-loading')).toBe('true')
    })
  })
})
