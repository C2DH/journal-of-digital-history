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

import Table from './Table'

// Mock dependencies
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
vi.mock('../../utils/convertStatus', () => ({
  convertStatus: (status: string) => <span>Status: {status}</span>,
}))
vi.mock('../../utils/orcid', () => ({
  isOrcid: (value: string) => value === '0000-0002-1825-0097',
}))
vi.mock('../../utils/table', () => ({
  getCleanData: ({ data }: any) => data,
  getVisibleHeaders: ({ headers }: any) => headers,
}))

describe('Table', () => {
  const headers = ['pid', 'status', 'date', 'url', 'orcid']
  const data = [
    ['123', 'submitted', '2024-06-11', 'http://example.com', '0000-0002-1825-0097'],
    ['456', 'reviewed', null, 'notalink', null],
  ]

  it('renders all table headers', () => {
    render(
      <MemoryRouter>
        <Table title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    headers.forEach((header) => {
      expect(screen.getByText(`articles.${header}`)).toBeInTheDocument()
    })
  })

  it('renders converted status, date, link, orcid, and dash for null', () => {
    render(
      <MemoryRouter>
        <Table title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    // Status
    expect(screen.getByText('Status: submitted')).toBeInTheDocument()
    expect(screen.getByText('Status: reviewed')).toBeInTheDocument()
    // Date
    expect(screen.getByText('converted:2024-06-11')).toBeInTheDocument()
    // Link
    expect(screen.getAllByText('link')[0]).toHaveAttribute('href', 'http://example.com')
    // Orcid
    expect(screen.getAllByText('link')[1]).toBeInTheDocument()
    // Dash for null
    expect(screen.getAllByText('-').length).toBeGreaterThan(0)
  })

  it('calls navigate on row click', () => {
    render(
      <MemoryRouter>
        <Table title="articles" headers={headers} data={data} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText('123').closest('tr')!)
    expect(mockNavigate).toHaveBeenCalledWith('/articles/123')
  })
})
