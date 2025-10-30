import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Mock, vi } from 'vitest'

import {
  getAbstractsByStatusAndCallForPapers,
  getArticlesByStatusAndIssues,
} from '../../utils/api/api'
import { abstractStatus } from '../../utils/constants/abstract'
import { articleBarChart } from '../../utils/constants/article'
import CustomBarChart from './CustomBarChart'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('../../utils/api/api', () => ({
  getArticlesByStatusAndIssues: vi.fn(),
  getAbstractsByStatusAndCallForPapers: vi.fn(),
}))

vi.mock('../../utils/constants/article', () => ({
  articleBarChart: [
    { key: 0, label: 'Published', value: 'published' },
    { key: 1, label: 'Draft', value: 'draft' },
  ],
}))
vi.mock('../../utils/constants/abstract', () => ({
  abstractStatus: [
    { key: 0, label: 'Accepted', value: 'accepted' },
    { key: 1, label: 'Declined', value: 'declined' },
  ],
}))

// Zustand stores
const issuesData = [
  { id: 'i1', name: 'Issue 1' },
  { id: 'i2', name: 'Issue 2' },
]
const cfpData = [
  { id: 'c1', title: 'Call 1' },
  { id: 'c2', title: 'Call 2' },
]

const fetchIssuesMock = vi.fn().mockResolvedValue(undefined)
const fetchCFPMock = vi.fn().mockResolvedValue(undefined)

vi.mock('../../store', () => {
  const useIssuesStore = vi.fn(() => ({
    fetchIssues: fetchIssuesMock,
    data: issuesData,
  }))
  ;(useIssuesStore as any).getState = () => ({ data: issuesData })

  const useCallForPapersStore = vi.fn(() => ({
    fetchCallForPapers: fetchCFPMock,
    data: cfpData,
  }))
  ;(useCallForPapersStore as any).getState = () => ({ data: cfpData })

  return { useIssuesStore, useCallForPapersStore }
})

// MUI BarChart test double
vi.mock('@mui/x-charts/BarChart', () => ({
  BarChart: (props: any) => (
    <div data-testid={`${props['data-testid']}`}>
      <div>bar-mock</div>
    </div>
  ),
  barLabelClasses: { root: 'barLabelClasses-root' },
}))
vi.mock('@mui/x-charts/ChartsAxis', () => ({
  axisClasses: { root: 'axisClasses-root', tickLabel: 'axisClasses-tickLabel' },
}))

describe('CustomBarChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and fetches article counts for each status x issue', async () => {
    ;(getArticlesByStatusAndIssues as unknown as Mock).mockResolvedValue({ count: 5 })
    ;(getAbstractsByStatusAndCallForPapers as unknown as Mock).mockResolvedValue({ count: 0 })

    render(<CustomBarChart />)

    await screen.findByTestId('bar-chart-abstract')

    expect(screen.getByTestId('bar-chart-abstract')).toBeInTheDocument()
    expect(screen.getByTestId('flip-button')).toBeInTheDocument()

    // Call for each status x each issue
    const expectedCalls = articleBarChart.length * issuesData.length
    expect(getArticlesByStatusAndIssues).toHaveBeenCalledTimes(expectedCalls)
  })

  it('shows "no data" when fetching fails', async () => {
    fetchIssuesMock.mockRejectedValueOnce(new Error('fail'))
    fetchCFPMock.mockResolvedValueOnce(undefined)

    render(<CustomBarChart />)

    await waitFor(() => expect(screen.getByTestId('loading-dots')).toBeInTheDocument())
  })

  it('switches to abstract dataset when clicking the flip button', async () => {
    ;(getArticlesByStatusAndIssues as unknown as Mock).mockResolvedValue({ count: 1 })
    ;(getAbstractsByStatusAndCallForPapers as unknown as Mock).mockResolvedValue({
      count: 2,
    })

    render(<CustomBarChart />)

    await screen.findByTestId('bar-chart-article')

    const flipBtn = screen.getByTestId('flip-button')
    expect(flipBtn).toHaveTextContent('KPI.barChart.button.article')

    fireEvent.click(flipBtn)

    // after flip -> isArticle=false -> button shows 'description'
    await waitFor(() => expect(flipBtn).toHaveTextContent('KPI.barChart.button.abstract'))

    const expectedAbstractCalls = abstractStatus.length * cfpData.length
    expect(getAbstractsByStatusAndCallForPapers).toHaveBeenCalledTimes(expectedAbstractCalls)
  })
})
