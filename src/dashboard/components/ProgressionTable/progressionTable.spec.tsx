import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const mod = await vi.importActual<typeof import('react-router')>('react-router')
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  }
})
import ProgressionTable from './ProgressionTable'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))
vi.mock('../../utils/convertDate', () => ({
  convertDate: (date: string) => `converted:${date}`,
}))
vi.mock('../../utils/convertLink', () => ({
  convertLink: (url: string) => <a href={url}>link</a>,
}))
vi.mock('../Timeline/Timeline', () => ({
  default: ({ currentStatus }: { currentStatus: string }) => <div>Timeline: {currentStatus}</div>,
}))
vi.mock('../../utils/table', () => ({
  getCleanData: ({ data }: any) => data,
  getVisibleHeaders: ({ headers }: any) => headers,
}))
vi.mock('../../constants/article', () => ({
  articleSteps: [
    { key: 'submitted', label: 'Submitted', icon: 'done' },
    { key: 'reviewed', label: 'Reviewed', icon: 'review' },
  ],
}))

describe('ProgressionTable', () => {
  const headers = ['pid', 'status', 'date', 'url']
  const data = [
    ['123', 'submitted', '2024-06-11', 'http://example.com'],
    ['456', 'reviewed', null, 'notalink'],
  ]

  it('renders all table headers', () => {
    render(
      <MemoryRouter>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    expect(screen.queryByText(`articles.pid`)).toBeInTheDocument()
    expect(screen.queryByText(`articles.date`)).toBeInTheDocument()
    expect(screen.queryByText(`articles.url`)).toBeInTheDocument()
    expect(screen.queryByText(`articles.status`)).not.toBeInTheDocument()
    expect(
      screen.getAllByText(
        (content, element) =>
          element?.tagName === 'SPAN' && element.classList.contains('material-symbols-outlined'),
      ).length,
    ).toBeGreaterThan(0)
  })

  it('calls navigate on row click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('123').closest('tr')!)
    expect(mockNavigate).toHaveBeenCalledWith('/articles/123')
  })

  it('renders Timeline for status steps', () => {
    render(
      <MemoryRouter>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Timeline: submitted')).toBeInTheDocument()
    expect(screen.getByText('Timeline: reviewed')).toBeInTheDocument()
  })

  it('renders converted date', () => {
    render(
      <MemoryRouter>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    expect(screen.getByText('converted:2024-06-11')).toBeInTheDocument()
  })

  it('renders link for url', () => {
    render(
      <MemoryRouter>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('link')[0]).toHaveAttribute('href', 'http://example.com')
  })

  it('renders "-" for null cell', () => {
    render(
      <MemoryRouter>
        <ProgressionTable title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('-').length).toBeGreaterThan(0)
  })
})
