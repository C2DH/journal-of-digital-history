import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'

import CustomBarChart from './CustomBarChart'
import { fetchBarChartData } from './fetch'

// Mock dependencies
vi.mock('./fetch', () => ({
  fetchBarChartData: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@mui/x-charts/BarChart', () => ({
  BarChart: ({ id }: { id: string }) => <div data-testid={id} />,
}))

vi.mock('@mui/x-charts/ChartsAxis', () => ({
  axisClasses: { root: 'root', tickLabel: 'tickLabel' },
}))

vi.mock('../SmallCard/SmallCard', () => ({
  default: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div data-testid="small-card" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('../Buttons/Button/Button', () => ({
  default: ({
    text,
    onClick,
    dataTestId,
  }: {
    text: string
    onClick: () => void
    dataTestId: string
  }) => (
    <button data-testid={dataTestId} onClick={onClick}>
      {text}
    </button>
  ),
}))

vi.mock('../../styles/theme', () => ({
  colorsAbstract: ['#000'],
  colorsArticle: ['#111'],
}))

vi.mock('../../utils/constants/abstract', () => ({
  abstractSeriesKey: [{ dataKey: 'submitted', label: 'Submitted' }],
}))

vi.mock('../../utils/constants/article', () => ({
  articleBarChart: [{ value: 'published', label: 'Published' }],
  articleSeriesKey: [{ dataKey: 'published', label: 'Published' }],
}))

// Mock data
const mockData = {
  articleSeries: [{ pid: 'ISS-01', issueName: 'Issue 1', Published: 3 }],
  articleLabels: ['ISS-01'],
  advanceSeries: [{ pid: 'advance', issueName: 'Advance Articles', Published: 5 }],
  abstractSeries: [{ cfpTitle: 'CFP 1', id: 1, Submitted: 2 }],
  abstractLabels: ['CFP 1'],
}

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  vi.mocked(fetchBarChartData).mockResolvedValue(mockData)

  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <CustomBarChart />
      </Suspense>
    </QueryClientProvider>,
  )
}

describe('CustomBarChart', () => {
  it('shows the suspense fallback while loading', () => {
    vi.mocked(fetchBarChartData).mockImplementation(() => new Promise(() => {}))

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <CustomBarChart />
        </Suspense>
      </QueryClientProvider>,
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('renders the SmallCard container', async () => {
    renderComponent()

    expect(await screen.findByTestId('small-card')).toBeInTheDocument()
  })

  it('renders article chart by default', async () => {
    renderComponent()

    expect(await screen.findByTestId('article-bar-chart')).toBeInTheDocument()
    expect(await screen.findByTestId('article-advanced-bar-chart')).toBeInTheDocument()
  })

  it('renders article title and description by default', async () => {
    renderComponent()

    expect(await screen.findByText('KPI.barChart.article.title')).toBeInTheDocument()
    expect(screen.getByText('KPI.barChart.article.description')).toBeInTheDocument()
  })

  it('renders the flip button', async () => {
    renderComponent()

    expect(await screen.findByTestId('flip-button')).toBeInTheDocument()
  })

  it('toggles to abstract chart when flip button is clicked', async () => {
    renderComponent()

    const flipButton = await screen.findByTestId('flip-button')
    fireEvent.click(flipButton)

    expect(screen.getByText('KPI.barChart.abstract.title')).toBeInTheDocument()
    expect(screen.getByText('KPI.barChart.abstract.description')).toBeInTheDocument()
    expect(screen.getByTestId('abstract-bar-chart')).toBeInTheDocument()
  })

  it('toggles back to article chart when flip button is clicked again', async () => {
    renderComponent()

    const flipButton = await screen.findByTestId('flip-button')

    // Switch to abstract
    fireEvent.click(flipButton)
    expect(screen.getByText('KPI.barChart.abstract.title')).toBeInTheDocument()

    // Switch back to article
    fireEvent.click(flipButton)
    expect(screen.getByText('KPI.barChart.article.title')).toBeInTheDocument()
  })

  it('does not render charts when data arrays are empty', async () => {
    vi.mocked(fetchBarChartData).mockResolvedValue({
      articleSeries: [],
      articleLabels: [],
      advanceSeries: [],
      abstractSeries: [],
      abstractLabels: [],
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <CustomBarChart />
        </Suspense>
      </QueryClientProvider>,
    )

    await screen.findByTestId('small-card')

    expect(screen.queryByTestId('article-bar-chart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('abstract-bar-chart')).not.toBeInTheDocument()
  })
})
