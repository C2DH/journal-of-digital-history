import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import DropdownMenu from './DropdownMenu'

const options = [
  { key: 0, value: 'one', label: 'Option One' },
  { key: 1, value: 'two', label: 'Option Two' },
]
const onChange = vi.fn()

describe('DropdownMenu', () => {
  it('renders with selected value', () => {
    render(<DropdownMenu options={options} value="one" onChange={() => {}} />)
    expect(screen.getByText('Option One')).toBeInTheDocument()
  })

  it('shows options when clicked', () => {
    render(<DropdownMenu options={options} value="one" onChange={() => {}} />)
    fireEvent.click(screen.getByText('Option One'))
    expect(screen.getByText('Option Two')).toBeInTheDocument()
  })

  it('calls onChange and closes when option is selected', () => {
    render(<DropdownMenu options={options} value="one" onChange={onChange} />)
    fireEvent.click(screen.getByText('Option One'))
    fireEvent.mouseDown(screen.getByText('Option Two'))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.queryByText('Option Two')).not.toBeInTheDocument()
  })

  it('shows placeholder when no value is selected', () => {
    render(<DropdownMenu options={options} value={''} onChange={() => {}} />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })
})
