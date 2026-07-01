import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useItemsStore } from '../../store'
import { getCallforpaperWithDeadlineOpen } from '../../utils/api/api'
import Home from './Home'

vi.mock('../../utils/api/api', () => ({
  getCallforpaperWithDeadlineOpen: vi.fn(),
}))

vi.mock('../../store', () => ({
  useItemsStore: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
}))

// Mock child components
vi.mock('../../components/CustomPieChart/CustomPieChart', () => ({
  default: () => <div data-testid="custom-pie-chart">CustomPieChart</div>,
}))

vi.mock('../../components/CustomBarChart/CustomBarChart', () => ({
  default: () => <div data-testid="custom-bar-chart">CustomBarChart</div>,
}))

vi.mock('../../components/PeerReviewChart/PeerReviewChart', () => ({
  default: () => <div data-testid="peer-review-chart">PeerReviewChart</div>,
}))

vi.mock('../../components/PeerReviewSimple/PeerReviewSimple', () => ({
  default: () => <div data-testid="peer-review-simple">PeerReviewSimple</div>,
}))

vi.mock('../../components/SmallTable/SmallTable', () => ({
  default: () => <div data-testid="small-table">SmallTable</div>,
}))

vi.mock('../../components/SmallCard/SmallCard', () => ({
  default: ({ children, className }: any) => (
    <div data-testid="small-card" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('../../components/Badge/Accent/Badge', () => ({
  default: ({ text }: any) => <span data-testid="badge">{text}</span>,
}))

vi.mock('../../components/Deadline/Deadline', () => ({
  default: ({ title, deadlineAbstract, deadlineArticle }: any) => (
    <div data-testid="deadline">
      <span>{title}</span>
      <span>{deadlineAbstract}</span>
      <span>{deadlineArticle}</span>
    </div>
  ),
}))

const mockAbstracts = [
  {
    id: 1,
    pid: 'A1',
    title: 'Abstract 1',
    callpaper_title: 'CFP 1',
    submitted_date: '2026-06-01',
    contact_lastname: 'Doe',
    contact_firstname: 'John',
  },
  {
    id: 2,
    pid: 'A2',
    title: 'Abstract 2',
    callpaper_title: 'CFP 2',
    submitted_date: '2026-06-02',
    contact_lastname: 'Smith',
    contact_firstname: 'Jane',
  },
]

const mockCFPData = [
  {
    id: 1,
    title: 'Call for Papers 1',
    deadline_abstract: '2026-07-01',
    deadline_article: '2026-08-01',
  },
  {
    id: 2,
    title: 'Call for Papers 2',
    deadline_abstract: '2026-07-15',
    deadline_article: '2026-08-15',
  },
]

const createMockStore = (data: any[] = []) => ({
  fetchItems: vi.fn(),
  setParams: vi.fn(),
  reset: vi.fn(),
  data,
})

const renderComponent = (
  abstracts = mockAbstracts,
  cfpData = mockCFPData,
  customMockStore?: any,
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const mockStore = customMockStore || createMockStore(abstracts)
  vi.mocked(useItemsStore).mockReturnValue(mockStore as any)
  vi.mocked(useItemsStore).getState = vi.fn(() => mockStore)
  vi.mocked(getCallforpaperWithDeadlineOpen).mockResolvedValue(cfpData)

  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <Home />
      </Suspense>
    </QueryClientProvider>,
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the Home page', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('welcome')).toBeInTheDocument()
        expect(screen.getByTestId('custom-pie-chart')).toBeInTheDocument()
        expect(screen.getByTestId('custom-bar-chart')).toBeInTheDocument()
        expect(screen.getByTestId('peer-review-chart')).toBeInTheDocument()
        expect(screen.getByTestId('peer-review-simple')).toBeInTheDocument()
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
      })
    })
  })

  describe('KPI Row', () => {
    it('should render deadline components for each CFP', async () => {
      renderComponent()

      await waitFor(() => {
        const deadlines = screen.getAllByTestId('deadline')
        expect(deadlines).toHaveLength(2)
      })
    })

    it('should pass correct props to Deadline component', async () => {
      renderComponent()

      await waitFor(() => {
        expect(screen.getByText('Call for Papers 1')).toBeInTheDocument()
        expect(screen.getByText('Call for Papers 2')).toBeInTheDocument()
        expect(screen.getByText('2026-07-01')).toBeInTheDocument()
        expect(screen.getByText('2026-08-01')).toBeInTheDocument()
      })
    })

    it('should handle empty CFP data', async () => {
      renderComponent(mockAbstracts, [])

      await waitFor(() => {
        const deadlines = screen.queryAllByTestId('deadline')
        expect(deadlines).toHaveLength(0)
      })
    })

    it('should handle error fetching CFP data', async () => {
      vi.mocked(getCallforpaperWithDeadlineOpen).mockRejectedValue(new Error('API Error'))

      renderComponent()

      await waitFor(() => {
        expect(screen.getByTestId('custom-pie-chart')).toBeInTheDocument()
      })
    })
  })

  describe('Abstract Data', () => {
    it('should fetch abstracts on mount', async () => {
      const mockStore = createMockStore(mockAbstracts)
      renderComponent(mockAbstracts, mockCFPData, mockStore)

      await waitFor(() => {
        expect(mockStore.reset).toHaveBeenCalled()
        expect(mockStore.setParams).toHaveBeenCalledWith({
          endpoint: 'abstracts',
          limit: 8,
          ordering: '-submitted_date',
          params: { status: 'SUBMITTED' },
          search: '',
        })
        expect(mockStore.fetchItems).toHaveBeenCalledWith(true)
      })
    })

    it('should render AbstractSubmittedCard when abstracts exist', async () => {
      renderComponent(mockAbstracts)

      await waitFor(() => {
        expect(screen.getByText('Abstracts')).toBeInTheDocument()
        expect(screen.getByTestId('badge')).toBeInTheDocument()
        expect(screen.getByTestId('small-table')).toBeInTheDocument()
      })
    })

    it('should not render AbstractSubmittedCard when no abstracts', async () => {
      renderComponent([])

      await waitFor(() => {
        expect(screen.queryByText('Abstracts')).not.toBeInTheDocument()
        expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
      })
    })

    it('should pass correct props to SmallTable', async () => {
      renderComponent(mockAbstracts)

      await waitFor(() => {
        expect(screen.getByTestId('small-table')).toBeInTheDocument()
      })
    })
  })

  describe('AbstractSubmittedCard', () => {
    it('should render with correct className', async () => {
      renderComponent(mockAbstracts)

      await waitFor(() => {
        const abstractCard = screen.getByText('Abstracts').closest('[data-testid="small-card"]')
        expect(abstractCard).toHaveClass('home-abstract-card', 'chart')
      })
    })

    it('should render with header structure', async () => {
      renderComponent(mockAbstracts)

      await waitFor(() => {
        expect(screen.getByText('Abstracts')).toBeInTheDocument()
        expect(screen.getByTestId('badge')).toHaveTextContent('New')
      })
    })
  })
})
