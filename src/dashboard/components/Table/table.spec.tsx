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

vi.mock('../../utils/helpers/actions', async () => {
  return {
    ...(await vi.importActual<any>('../../utils/helpers/actions')),
    getRowActions: vi.fn(() => [
      { label: 'Approve', onClick: vi.fn() },
      { label: 'Delete', onClick: vi.fn() },
    ]),
  }
})

vi.mock('../../utils/helpers/table', async () => {
  const actual = await vi.importActual<any>('../../utils/helpers/table')
  return {
    ...actual,
    getVisibleHeaders: vi.fn(({ headers }) => headers),
    getCleanData: vi.fn(({ data }) => data),
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
vi.mock('../Buttons/ActionButton/Short/ActionButton', () => ({
  default: (props: { actions: [{ label: 'Approve' }, { label: 'Delete' }] }) => (
    <div data-testid="action-button">
      {props.actions.map((a: any) => (
        <button data-testid={`action-button-${a.label}`} key={a.label}>
          {a.label}
        </button>
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
    item: 'articles',
    headers: ['title', 'author'],
    data: [
      ['Test Title', 'Test Author'],
      ['Another Title', 'Another Author'],
    ],
    sortBy: 'title',
    sortOrder: 'asc',
    setSort: vi.fn(),
    setRowModal: vi.fn(),
    isAccordeon: false,
    checkedRows: { selectAll: false },
    setCheckedRows: vi.fn(),
  }

  it('renders headers and rows', () => {
    render(<Table {...defaultProps} />)
    expect(screen.getByText('articles.title')).toBeInTheDocument()
    expect(screen.getByText('articles.author')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('Another Title')).toBeInTheDocument()
    expect(screen.getByText('Another Author')).toBeInTheDocument()
    expect(screen.getAllByTestId('action-button').length).toBe(2)
    expect(screen.getAllByTestId('action-button-Approve').length).toBe(2)
    expect(screen.getAllByTestId('action-button-Delete').length).toBe(2)
  })

  it('renders sort button and triggers sort', () => {
    const setSort = vi.fn()
    render(<Table {...defaultProps} setSort={setSort} />)
    const sortBtn = screen.getByTestId('sort-btn-articles.title')
    fireEvent.click(sortBtn)
    expect(setSort).toHaveBeenCalled()
  })

  it('calls navigate when clicking the title cell', () => {
    render(<Table {...defaultProps} />)
    const titleCell = screen.getAllByText('Test Title')[0]
    fireEvent.click(titleCell)
    expect(mockNavigate).toHaveBeenCalled()
  })
})
