import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import SmallTable from './SmallTable'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../utils/helpers/table', async () => {
  const actual = await vi.importActual<any>('../../utils/helpers/table')
  return {
    ...actual,
    authorColumn: vi.fn((headers, data) => {
      return { headers, data }
    }),
    getVisibleHeaders: vi.fn(({ headers }) => headers ?? []),
    getCleanData: vi.fn(({ data }) => data ?? []),
    renderCell: vi.fn((props) => String(props.cell)),
  }
})

vi.mock('../../utils/helpers/checkItem', () => ({
  isPidHeader: (header: string) => header === 'pid',
  isTitleHeader: (header: string) => header === 'title',
  isStepCell: () => false,
}))

describe('SmallTable', () => {
  const defaultProps = {
    item: 'abstracts',
    headers: ['pid', 'title', 'author'],
    data: [
      ['123', 'An interesting study on history', 'John Doe'],
      ['456', 'Digital archives and their impact', 'Jane Smith'],
    ],
  }

  it('renders headers except pid', () => {
    render(<SmallTable {...defaultProps} />)
    expect(screen.getByText('abstracts.title')).toBeInTheDocument()
    expect(screen.getByText('abstracts.author')).toBeInTheDocument()
    expect(screen.queryByText('abstracts.pid')).not.toBeInTheDocument()
  })

  it('renders table rows and cells', () => {
    render(<SmallTable {...defaultProps} />)
    expect(screen.getByText('An interesting study on history')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Digital archives and their impact')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('calls navigate when clicking title cell', () => {
    render(<SmallTable {...defaultProps} />)
    const titleCell = screen.getByText('An interesting study on history')
    fireEvent.click(titleCell)
    expect(mockNavigate).toHaveBeenCalledWith('/abstracts/123')
  })
})
