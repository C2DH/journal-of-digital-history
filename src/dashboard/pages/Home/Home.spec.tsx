import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useItemsStore } from '../../store'
import { getAbstractsSubmittedToOJS, getCallforpaperWithDeadlineOpen } from '../../utils/api/api'
import { Abstract, Callforpaper } from '../../utils/types'
import Home from './Home'

// --- Module mocks ---

vi.mock('../../utils/api/api', () => ({
  getAbstractsSubmittedToOJS: vi.fn(),
  getCallforpaperWithDeadlineOpen: vi.fn(),
}))

vi.mock('../../store', () => ({
  useItemsStore: vi.fn(),
}))

vi.mock('../../hooks/useSorting', () => ({
  useSorting: vi.fn(() => ({ ordering: 'desc', sortBy: null, sortOrder: null })),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../../components/CustomBarChart/CustomBarChart', () => ({
  default: () => <div data-testid="custom-bar-chart" />,
}))

vi.mock('../../components/CustomPieChart/CustomPieChart', () => ({
  default: () => <div data-testid="custom-pie-chart" />,
}))

vi.mock('../../components/Deadline/Deadline', () => ({
  default: ({ title, value }: { title: string; value?: number }) => (
    <div data-testid="deadline" data-title={title} data-value={value ?? 'none'} />
  ),
}))

vi.mock('../../components/SmallCard/SmallCard', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="small-card" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('../../components/SmallTable/SmallTable', () => ({
  default: () => <div data-testid="small-table" />,
}))

vi.mock('../../components/Badge/Badge', () => ({
  default: () => <span data-testid="badge" />,
}))

// --- Helpers ---

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderHome = (queryClient = createQueryClient()) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </MemoryRouter>
    </QueryClientProvider>,
  )

const mockStore = (abstracts: Abstract[] = []) => {
  vi.mocked(useItemsStore).mockReturnValue({
    data: abstracts,
    fetchItems: vi.fn(),
    setParams: vi.fn(),
    reset: vi.fn(),
  } as any)
}

const makeAbstract = (overrides: Partial<Abstract> = {}): Abstract => ({
  id: 1,
  pid: 'abc123',
  title: 'Test Abstract',
  abstract: 'Abstract body',
  callpaper: null,
  callpaper_title: null,
  submitted_date: '2024-01-01',
  validation_date: '',
  contact_orcid: '',
  contact_affiliation: '',
  contact_email: 'test@test.com',
  contact_lastname: 'Doe',
  contact_firstname: 'John',
  status: 'SUBMITTED',
  consented: true,
  authors: [],
  datasets: [],
  repository_url: '',
  ...overrides,
})

const makeCfp = (overrides: Partial<Callforpaper> = {}): Callforpaper => ({
  id: 1,
  title: 'CFP 1',
  folder_name: 'cfp-1',
  deadline_abstract: '2025-06-01',
  deadline_article: '2025-12-01',
  ...overrides,
})

// Helper to wait for suspense to resolve
const waitForRender = () =>
  waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument())

// --- Tests ---

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore()
    vi.mocked(getAbstractsSubmittedToOJS).mockResolvedValue({ count: 0 })
    vi.mocked(getCallforpaperWithDeadlineOpen).mockResolvedValue([])
  })

  describe('Main layout', () => {
    it('renders the welcome heading', async () => {
      renderHome()
      await waitForRender()
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('welcome')
    })

    it('always renders the pie chart and bar chart', async () => {
      renderHome()
      await waitForRender()
      expect(screen.getByTestId('custom-pie-chart')).toBeInTheDocument()
      expect(screen.getByTestId('custom-bar-chart')).toBeInTheDocument()
    })

    it('calls reset, setParams, and fetchItems on mount', async () => {
      const reset = vi.fn()
      const setParams = vi.fn()
      const fetchItems = vi.fn()
      vi.mocked(useItemsStore).mockReturnValue({
        data: [],
        fetchItems,
        setParams,
        reset,
      } as any)

      renderHome()
      await waitForRender()

      expect(reset).toHaveBeenCalledOnce()
      expect(setParams).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: 'abstracts',
          limit: 5,
          ordering: '-submitted_date',
          params: { status: 'SUBMITTED' },
        }),
      )
      expect(fetchItems).toHaveBeenCalledWith(true)
    })
  })

  describe('AbstractSubmittedCard', () => {
    it('does not render when there are no submitted abstracts', async () => {
      mockStore([])
      renderHome()
      await waitForRender()
      expect(screen.queryByTestId('small-card')).not.toBeInTheDocument()
    })

    it('renders the card when there are submitted abstracts', async () => {
      mockStore([makeAbstract()])
      renderHome()
      await waitForRender()
      expect(screen.getByTestId('small-card')).toBeInTheDocument()
      expect(screen.getByText('Abstracts')).toBeInTheDocument()
      expect(screen.getByTestId('small-table')).toBeInTheDocument()
      expect(screen.getByTestId('badge')).toBeInTheDocument()
    })

    it('adds the isAbstract class to the grid when abstracts are present', async () => {
      mockStore([makeAbstract()])
      const { container } = renderHome()
      await waitForRender()
      expect(container.querySelector('.home-grid')).toHaveClass('isAbstract')
    })

    it('does not add the isAbstract class when there are no abstracts', async () => {
      mockStore([])
      const { container } = renderHome()
      await waitForRender()
      expect(container.querySelector('.home-grid')).not.toHaveClass('isAbstract')
    })
  })

  describe('PeerReviewCounter', () => {
    it('does not render the Deadline when OJS count is 0', async () => {
      vi.mocked(getAbstractsSubmittedToOJS).mockResolvedValue({ count: 0 })
      renderHome()
      await waitForRender()
      const peerReviewDeadlines = screen
        .queryAllByTestId('deadline')
        .filter((el) => el.getAttribute('data-title') === 'Ready for')
      expect(peerReviewDeadlines).toHaveLength(0)
    })

    it('renders the Deadline with the correct count when OJS count > 0', async () => {
      vi.mocked(getAbstractsSubmittedToOJS).mockResolvedValue({ count: 5 })
      renderHome()
      await waitForRender()
      const peerReviewDeadline = screen
        .queryAllByTestId('deadline')
        .find((el) => el.getAttribute('data-title') === 'Ready for')
      expect(peerReviewDeadline).toBeInTheDocument()
      expect(peerReviewDeadline).toHaveAttribute('data-value', '5')
    })

    it('does not crash when the OJS API throws an error', async () => {
      vi.mocked(getAbstractsSubmittedToOJS).mockRejectedValue(new Error('Network error'))
      renderHome()
      await waitForRender()
      const peerReviewDeadlines = screen
        .queryAllByTestId('deadline')
        .filter((el) => el.getAttribute('data-title') === 'Ready for')
      // getCount catches the error and returns undefined; the page should still render
      expect(peerReviewDeadlines).toHaveLength(0)
    })
  })

  describe('KPIRow – Call for Papers', () => {
    it('renders no CFP Deadlines when there are no open call for papers', async () => {
      vi.mocked(getCallforpaperWithDeadlineOpen).mockResolvedValue([])
      renderHome()
      await waitForRender()
      const cfpDeadlines = screen
        .queryAllByTestId('deadline')
        .filter((el) => el.getAttribute('data-title') !== 'Ready for')
      expect(cfpDeadlines).toHaveLength(0)
    })

    it('renders no CFP Deadlines when the CFP API throws an error', async () => {
      vi.mocked(getCallforpaperWithDeadlineOpen).mockRejectedValue(new Error('Network error'))
      renderHome()
      await waitForRender()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      const cfpDeadlines = screen
        .queryAllByTestId('deadline')
        .filter((el) => el.getAttribute('data-title') !== 'Ready for')
      expect(cfpDeadlines).toHaveLength(0)
    })
  })
})
