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

// Mock SortButton
vi.mock('../Buttons/SortButton/SortButton', () => ({
  default: (props: any) => (
    <button data-testid={`sort-btn-${props.label}`} onClick={props.onClick}>
      {props.label}
    </button>
  ),
}))

// Mock Timeline
vi.mock('../Timeline/Timeline', () => ({
  default: () => <div data-testid="timeline" />,
}))

// Minimal utility mocks (if needed)
vi.mock('../../utils/table', async (importOriginal) => {
  const original = await importOriginal()
  const originalObj =
    original && typeof original === 'object' && 'default' in original ? original.default : original
  return {
    ...originalObj,
    isAbstract: (item: string) => item === 'abstracts',
    isArticle: (item: string) => item === 'articles',
    isCallForPapers: () => false,
    isIssues: () => false,
    isRepositoryHeader: () => false,
    isStatusHeader: () => false,
    isStepCell: () => false,
    isTitleHeader: (header: string) => header === 'title',
    getVisibleHeaders: ({ headers }: any) => headers,
    getCleanData: ({ data }: any) => data,
    isStatus: () => false,
    isLinkCell: () => false,
    isDateCell: () => false,
  }
})

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
  })

  it('renders sort button and triggers sort', () => {
    render(<Table {...defaultProps} />)
    const sortBtn = screen.getByTestId('sort-btn-abstracts.title')
    fireEvent.click(sortBtn)
    expect(defaultProps.setSortBy).not.toHaveBeenCalled() // Only setSortOrder is called if already sorted by this header
    expect(defaultProps.setSortOrder).toHaveBeenCalled()
  })

  it('calls navigate when clicking the title cell', () => {
    render(<Table {...defaultProps} />)
    const titleCell = screen.getAllByText('Test Title')[0]
    fireEvent.click(titleCell)
    expect(mockNavigate).toHaveBeenCalled()
  })
})
