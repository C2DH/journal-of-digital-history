import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FilterBar from './FilterBar'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => (k === 'search.placeholder' ? 'Search...' : k) }),
}))

const mockSetSearchParams = vi.fn()
const mockSearchParams = new URLSearchParams()
vi.mock('react-router', async () => {
  const actual = await vi.importActual<any>('react-router')
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  }
})

const mockSetQuery = vi.fn()
const mockResetFilters = vi.fn()
vi.mock('../../store', async () => ({
  useSearchStore: () => ({ setQuery: mockSetQuery }),
  useFilterBarStore: () => ({ resetFilters: mockResetFilters }),
}))

vi.mock('../DropdownMenu/DropdownMenu', () => ({
  default: (props: any) => {
    const { name, options, value, onChange } = props
    return (
      <select
        data-testid={`dropdown-${name}`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">--</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  },
}))

vi.mock('../Search/Search', () => ({
  default: (props: any) => {
    return (
      <input
        data-testid="search-input"
        placeholder={props.placeholder}
        onChange={(e) => props.onChange?.(e.target.value)}
      />
    )
  },
}))

vi.mock('../Buttons/Button/Button', () => ({
  default: (props: any) => {
    return (
      <button data-testid="clear-button" onClick={props.onClick}>
        {props.text}
      </button>
    )
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('FilterBar', () => {
  const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>)

  it('renders search input and dropdowns', () => {
    const filters = [
      {
        name: 'status',
        label: 'Status',
        options: [{ key: 0, value: 'open', label: 'Open' }],
        value: '',
      },
      { name: 'type', label: 'Type', options: [{ key: 1, value: 'bug', label: 'Bug' }], value: '' },
    ]
    renderWithRouter(<FilterBar filters={filters} onFilterChange={vi.fn()} />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-status')).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-type')).toBeInTheDocument()
    expect(screen.getByTestId('clear-button')).toBeInTheDocument()
  })

  it('calls onFilterChange when dropdown value changes', async () => {
    const user = userEvent
    const onFilterChange = vi.fn()
    const filters = [
      {
        name: 'status',
        label: 'Status',
        options: [{ key: 0, value: 'open', label: 'Open' }],
        value: '',
      },
    ]
    renderWithRouter(<FilterBar filters={filters} onFilterChange={onFilterChange} />)

    await user.selectOptions(screen.getByTestId('dropdown-status'), 'open')
    expect(onFilterChange).toHaveBeenCalledTimes(1)
    // first arg is filter name
    expect(onFilterChange).toHaveBeenCalledWith(
      'status',
      'open',
      expect.any(URLSearchParams),
      expect.any(Function),
    )
  })

  it('clears search and resets filters when Clear All clicked', async () => {
    const user = userEvent
    const filters = [
      {
        name: 'status',
        label: 'Status',
        options: [{ key: 0, value: 'open', label: 'Open' }],
        value: 'open',
      },
    ]
    renderWithRouter(<FilterBar filters={filters} onFilterChange={vi.fn()} />)

    await user.click(screen.getByTestId('clear-button'))
    expect(mockSetQuery).toHaveBeenCalledWith('')
    expect(mockResetFilters).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      mockSetSearchParams,
      filters,
    )
  })
})
