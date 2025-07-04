import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Table from './Table'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../utils/helpers/table', async () => {
  const actual = await vi.importActual<any>('../../utils/helpers/table')
  return {
    ...actual,
    getVisibleHeaders: vi.fn(({ headers }) => headers),
    getCleanData: vi.fn(({ data }) => data),
    getRowActions: vi.fn(() => [
      { label: 'Approve', onClick: vi.fn() },
      { label: 'Delete', onClick: vi.fn() },
    ]),
    isAbstract: vi.fn(() => true),
    isArticle: vi.fn(() => false),
    isCallForPapers: vi.fn(() => false),
    isIssues: vi.fn(() => false),
    isRepositoryHeader: vi.fn(() => false),
    isStatusHeader: vi.fn(() => false),
    isStepCell: vi.fn(() => false),
    isTitleHeader: vi.fn((header) => header === 'title'),
    isStatus: vi.fn(() => false),
    isLinkCell: vi.fn(() => false),
    isDateCell: vi.fn(() => false),
  }
})
vi.mock('../Buttons/ActionButton/ActionButton', () => ({
  default: ({ actions }: any) => (
    <div data-testid="action-button">
      {actions.map((a: any) => (
        <button key={a.label}>{a.label}</button>
      ))}
    </div>
  ),
}))
vi.mock('../Buttons/SortButton/SortButton', () => ({
  default: ({ label, onClick }: any) => (
    <button data-testid={`sort-btn-${label}`} onClick={onClick}>
      {label}
    </button>
  ),
}))
vi.mock('../Buttons/IconButton/IconButton', () => ({
  default: () => <span>icon</span>,
}))
vi.mock('../Status/Status', () => ({
  default: () => <span>Status</span>,
}))
vi.mock('../Timeline/Timeline', () => ({
  default: () => <span>Timeline</span>,
}))

describe('Table', () => {
  const defaultProps = {
    item: 'abstracts',
    headers: ['title', 'author'],
    data: [
      ['Test Title', 'Test Author'],
      ['Another Title', 'Another Author'],
    ],
    sortBy: 'title',
    sortOrder: 'asc',
    setSortBy: vi.fn(),
    setSortOrder: vi.fn(),
  }

  it('renders headers and rows', () => {
    render(<Table {...defaultProps} />)
    expect(screen.getByText('abstracts.title')).toBeInTheDocument()
    expect(screen.getByText('abstracts.author')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    // expect(screen.getAllByTestId('action-button').length).toBe(2)
    // expect(screen.getAllByText('Approve').length).toBe(2)
    // expect(screen.getAllByText('Delete').length).toBe(2)
  })

  it('renders sort button and triggers sort', () => {
    const setSortBy = vi.fn()
    const setSortOrder = vi.fn()
    render(<Table {...defaultProps} setSortBy={setSortBy} setSortOrder={setSortOrder} />)
    const sortBtn = screen.getByTestId('sort-btn-abstracts.title')
    fireEvent.click(sortBtn)
    expect(setSortBy).not.toHaveBeenCalled() // Only setSortOrder is called if already sorted by this header
    expect(setSortOrder).toHaveBeenCalled()
  })

  it('calls navigate when clicking the title cell', () => {
    render(<Table {...defaultProps} />)
    const titleCell = screen.getAllByText('Test Title')[0]
    fireEvent.click(titleCell)
    expect(mockNavigate).toHaveBeenCalled()
  })
})
