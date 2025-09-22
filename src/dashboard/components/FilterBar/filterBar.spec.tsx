import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import FilterBar from './FilterBar'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('../../store', () => ({
  useSearchStore: () => ({ setQuery: vi.fn() }),
}))
vi.mock('../Search/Search', () => ({
  __esModule: true,
  default: (props: any) => <input data-testid="search-input" placeholder={props.placeholder} />,
}))
vi.mock('../DropdownMenu/DropdownMenu', () => ({
  __esModule: true,
  default: (props: any) => {
    return (
      <select
        data-testid={`dropdown-${props.options[0]?.key}`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  },
}))
vi.mock('../Buttons/Button/Button', () => ({
  __esModule: true,
  default: (props: any) => (
    <button data-testid="clear-all-btn" onClick={props.onClick}>
      {props.text}
    </button>
  ),
}))

describe('FilterBar', () => {
  const filters = [
    {
      name: 'callpaper',
      label: 'callpaper',
      value: '',
      options: [
        { key: 0, value: '', label: 'All' },
        { key: 1, value: 'cp1', label: 'Call 1' },
      ],
    },
    {
      name: 'issue',
      label: 'issue',
      value: '',
      options: [
        { key: 2, value: '', label: 'All' },
        { key: 3, value: 'i1', label: 'Issue 1' },
      ],
    },
  ]
  const onFilterChange = vi.fn()

  it('renders all filters and search', () => {
    render(<FilterBar filters={filters} onFilterChange={onFilterChange} />)
    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-0')).toBeInTheDocument()
    expect(screen.getByTestId('clear-all-btn')).toBeInTheDocument()
  })

  it('calls onFilterChange when dropdown changes', () => {
    render(<FilterBar filters={filters} onFilterChange={onFilterChange} />)
    fireEvent.change(screen.getByTestId('dropdown-0'), { target: { value: 'cp1' } })
    expect(onFilterChange).toHaveBeenCalledWith('callpaper', 'cp1')
  })

  it('calls onFilterChange and setSearch when Clear All is clicked', () => {
    render(<FilterBar filters={filters} onFilterChange={onFilterChange} />)
    fireEvent.click(screen.getByTestId('clear-all-btn'))
    expect(onFilterChange).toHaveBeenCalledWith('callpaper', '')
    expect(onFilterChange).toHaveBeenCalledWith('issue', '')
    expect(onFilterChange).toHaveBeenCalledWith('status', '')
  })
})
