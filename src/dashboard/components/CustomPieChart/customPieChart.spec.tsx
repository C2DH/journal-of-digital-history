import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CustomPieChart from './CustomPieChart'
import { fetchPieChartData } from './fetch'

vi.mock('./fetch', () => ({
  fetchPieChartData: vi.fn(),
}))

vi.mock('../../utils/constants/article', () => ({
  articlePieChart: [
    { key: 0, label: 'Published', value: 'published' },
    { key: 1, label: 'Draft', value: 'draft' },
  ],
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: ({ onItemClick }: any) => (
    <div data-testid="pie-chart">
      <button onClick={(e) => onItemClick?.(e, { dataIndex: 0 })}>slice-0</button>
      <button onClick={(e) => onItemClick?.(e, { dataIndex: 1 })}>slice-1</button>
    </div>
  ),
}))

const mockData = [
  { label: 'Writing', value: 1 },
  { label: 'Technical review', value: 12 },
  { label: 'Peer review', value: 7 },
  { label: 'Design review', value: 0 },
]

const renderComponent = (data = mockData) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  vi.mocked(fetchPieChartData).mockResolvedValue(data)

  return render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div data-testid="loading">Loading...</div>}>
        <CustomPieChart />
      </Suspense>
    </QueryClientProvider>,
  )
}

describe('CustomPieChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should call fetchPieChartData once', async () => {
      renderComponent()
      await screen.findByTestId('pie-chart')

      expect(fetchPieChartData).toHaveBeenCalledTimes(1)
    })

    it('should render the PieChart when data is available', async () => {
      renderComponent()

      const pieChart = await screen.findByTestId('pie-chart')
      expect(pieChart).toBeInTheDocument()
    })

    it('should render the title', async () => {
      renderComponent()

      await screen.findByTestId('pie-chart')
      expect(screen.getByText('KPI.pieChart.title')).toBeInTheDocument()
    })

    it('should not render PieChart when data array is empty', async () => {
      renderComponent([])

      await waitFor(() => {
        expect(fetchPieChartData).toHaveBeenCalled()
      })

      expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument()
    })
  })

  describe('slice click navigation', () => {
    it('should navigate to articles page with published status when first slice is clicked', async () => {
      renderComponent()

      await screen.findByTestId('pie-chart')

      fireEvent.click(screen.getByText('slice-0'))

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith({
          pathname: '/articles',
          search: '?status=published',
        })
      })
    })

    it('should URL-encode the status value in search param', async () => {
      renderComponent()

      await screen.findByTestId('pie-chart')

      fireEvent.click(screen.getByText('slice-0'))

      await waitFor(() => {
        const call = navigateMock.mock.calls[0][0]
        expect(call.search).toBe('?status=published')
      })
    })
  })

  describe('data handling', () => {
    it('should handle non-array data gracefully', async () => {
      vi.mocked(fetchPieChartData).mockResolvedValue(undefined as any)

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      render(
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div data-testid="loading">Loading...</div>}>
            <CustomPieChart />
          </Suspense>
        </QueryClientProvider>,
      )

      await waitFor(() => {
        expect(fetchPieChartData).toHaveBeenCalled()
      })

      // Should not render chart with non-array data
      expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument()
    })

    it('should render with different data shapes', async () => {
      const differentData = [
        { label: 'Status A', value: 5 },
        { label: 'Status B', value: 10 },
      ]

      renderComponent(differentData)

      await screen.findByTestId('pie-chart')
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })
  })
})
