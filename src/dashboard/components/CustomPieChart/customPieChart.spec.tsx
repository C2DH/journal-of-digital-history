import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getArticlesByStatus } from '../../utils/api/api'
import { articlePieChart } from '../../utils/constants/article'
import CustomPieChart from './CustomPieChart'

vi.mock('../../utils/constants/article', () => ({
  articlePieChart: [
    { key: 0, label: 'Published', value: 'published' },
    { key: 1, label: 'Draft', value: 'draft' },
  ],
}))
vi.mock('../../utils/api/api', () => ({
  getArticlesByStatus: vi.fn(),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

// Capture navigate calls
const navigateMock = vi.fn()
vi.mock('react-router', () => ({
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

describe('CustomPieChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches counts for each status and renders the chart', async () => {
    const getArticlesByStatusMock = getArticlesByStatus as unknown as Mock

    getArticlesByStatusMock.mockResolvedValueOnce({ count: 5 }).mockResolvedValueOnce({ count: 2 })

    render(<CustomPieChart />)

    await screen.findByTestId('pie-chart')

    expect(getArticlesByStatusMock).toHaveBeenCalledTimes(articlePieChart.length)
    expect(getArticlesByStatusMock).toHaveBeenCalledWith('published')
    expect(getArticlesByStatusMock).toHaveBeenCalledWith('draft')
  })

  it('navigates to the articles page with the clicked status', async () => {
    const getArticlesByStatusMock = getArticlesByStatus as unknown as Mock
    getArticlesByStatusMock.mockResolvedValueOnce({ count: 5 }).mockResolvedValueOnce({ count: 2 })

    render(<CustomPieChart />)

    await screen.findByTestId('pie-chart')

    // Click the first "slice" (dataIndex: 0 -> status value "published")
    fireEvent.click(screen.getByText('slice-0'))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        pathname: '/articles',
        search: '?status=published',
      })
    })
  })
})
