import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'

import DropdownMenu from './DropdownMenu'

const options = [
  { key: 0, value: 'one', label: 'Option One' },
  { key: 1, value: 'two', label: 'Option Two' },
]

const onChange = vi.fn()

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams('?status=PUBLISHED'), vi.fn()],
  useLocation: () => ({
    pathname: '/',
    search: '?status=PUBLISHED',
    hash: '',
    state: null,
    key: 'test-key',
  }),
  useNavigate: () => vi.fn(),
}))

describe('DropdownMenu', () => {
  it('renders with selected value', () => {
    render(
      <MemoryRouter>
        <DropdownMenu name={'test'} options={options} value="one" onChange={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Option One')).toBeInTheDocument()
  })

  it('shows options when clicked', () => {
    render(
      <MemoryRouter>
        <DropdownMenu name={'test'} options={options} value="one" onChange={() => {}} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText('Option One'))
    expect(screen.getByText('Option Two')).toBeInTheDocument()
  })

  it('calls onChange and closes when option is selected', () => {
    render(
      <MemoryRouter>
        <DropdownMenu name={'test'} options={options} value="one" onChange={onChange} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText('Option One'))
    fireEvent.mouseDown(screen.getByText('Option Two'))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.queryByText('Option Two')).not.toBeInTheDocument()
  })

  it('shows placeholder when no value is selected', () => {
    render(
      <MemoryRouter>
        <DropdownMenu name={'test'} options={options} value={''} onChange={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText('-')).toBeInTheDocument()
  })
})
