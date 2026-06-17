import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getPeerReviewArticlesTiming } from '../../utils/api/api'
import PeerReviewSimple from './PeerReviewSimple'

const mockUseSuspenseQuery = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: (...args: any[]) => mockUseSuspenseQuery(...args),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@mui/x-charts', () => ({
  BarChart: ({ dataset }: { dataset: Array<{ order: string }> }) => (
    <div data-testid="peerreview-simple-chart">{dataset.map((item) => item.order).join(',')}</div>
  ),
}))

vi.mock('../SmallCard/SmallCard', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <section data-testid="small-card" className={className}>
      {children}
    </section>
  ),
}))

vi.mock('../../styles/theme', () => ({
  colorPeerReviewSimpleChart: ['#111111', '#222222', '#333333'],
}))

vi.mock('../../utils/api/api', () => ({
  getPeerReviewArticlesTiming: vi.fn(),
}))

describe('PeerReviewSimple', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the card and translated title', () => {
    mockUseSuspenseQuery.mockReturnValue({
      data: [{ order: 'R1', ontime: 2, delay: 1, declined: 0 }],
    })

    render(<PeerReviewSimple />)

    expect(screen.getByTestId('small-card')).toBeInTheDocument()
    expect(screen.getByText('KPI.peerReviewChart.simple.title')).toBeInTheDocument()
  })

  it('renders the chart when data exists', () => {
    mockUseSuspenseQuery.mockReturnValue({
      data: [{ order: 'R1', ontime: 2, delay: 1, declined: 0 }],
    })

    render(<PeerReviewSimple />)

    expect(screen.getByTestId('peerreview-simple-chart')).toBeInTheDocument()
    expect(screen.getByText('R1')).toBeInTheDocument()
  })

  it('does not render the chart when data is empty', () => {
    mockUseSuspenseQuery.mockReturnValue({
      data: [],
    })

    render(<PeerReviewSimple />)

    expect(screen.queryByTestId('peerreview-simple-chart')).not.toBeInTheDocument()
  })

  it('configures useSuspenseQuery with the expected query key and staleTime', () => {
    mockUseSuspenseQuery.mockReturnValue({
      data: [],
    })

    render(<PeerReviewSimple />)

    expect(mockUseSuspenseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['peerReviewSimpleData'],
        staleTime: 0,
        queryFn: expect.any(Function),
      }),
    )
  })

  it('filters out rows where ontime, delay and declined are all zero', async () => {
    mockUseSuspenseQuery.mockReturnValue({
      data: [],
    })

    vi.mocked(getPeerReviewArticlesTiming).mockResolvedValue([
      { order: 'R1', ontime: 0, delay: 0, declined: 0 },
      { order: 'R2', ontime: 1, delay: 0, declined: 0 },
      { order: 'R3', ontime: 0, delay: 2, declined: 0 },
      { order: 'R4', ontime: 0, delay: 0, declined: 3 },
    ])

    render(<PeerReviewSimple />)

    const queryOptions = mockUseSuspenseQuery.mock.calls[0][0]
    const result = await queryOptions.queryFn()

    expect(result).toEqual([
      { order: 'R2', ontime: 1, delay: 0, declined: 0 },
      { order: 'R3', ontime: 0, delay: 2, declined: 0 },
      { order: 'R4', ontime: 0, delay: 0, declined: 3 },
    ])
  })
})
