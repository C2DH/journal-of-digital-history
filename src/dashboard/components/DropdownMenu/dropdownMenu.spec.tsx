import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import DropdownMenu from './DropdownMenu'

const onChange = vi.fn()
const mockLocation = vi.fn()
const mockSearchParams = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
  }
})

// vi.mock('react-router', () => ({
//   useLocation: () => mockLocation,
// }))

const options = [
  { key: 0, value: 'one', label: 'Option One' },
  { key: 1, value: 'two', label: 'Option Two' },
]

describe('DropdownMenu', () => {
  // beforeEach(() => {
  //   // Set up a mock implementation
  //   vi.mocked(useLocation).mockReturnValue({
  //     pathname: '/articles/',
  //     search: '?status=PUBLISHED',
  //   })
  // })

  it('renders with selected value', () => {
    render(
      <MemoryRouter initialEntries={['/articles/?status=PUBLISHED']}>
        <DropdownMenu name={'test'} options={options} value="one" onChange={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Option One')).toBeInTheDocument()
  })

  // it('shows options when clicked', () => {
  //   render(<DropdownMenu name={'test'} options={options} value="one" onChange={() => {}} />)
  //   fireEvent.click(screen.getByText('Option One'))
  //   expect(screen.getByText('Option Two')).toBeInTheDocument()
  // })

  // it('calls onChange and closes when option is selected', () => {
  //   render(<DropdownMenu name={'test'} options={options} value="one" onChange={onChange} />)
  //   fireEvent.click(screen.getByText('Option One'))
  //   fireEvent.mouseDown(screen.getByText('Option Two'))
  //   expect(onChange).toHaveBeenCalledWith('two')
  //   expect(screen.queryByText('Option Two')).not.toBeInTheDocument()
  // })

  // it('shows placeholder when no value is selected', () => {
  //   render(<DropdownMenu name={'test'} options={options} value={''} onChange={() => {}} />)
  //   expect(screen.getByText('-')).toBeInTheDocument()
  // })
})
