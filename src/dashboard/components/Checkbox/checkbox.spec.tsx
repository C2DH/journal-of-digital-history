import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Checkbox from './Checkbox'

const handleChange = vi.fn()

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox checked={false} onChange={() => {}} />)
    const input = screen.getByRole('checkbox')
    expect(input).not.toBeChecked()
  })

  it('renders checked when checked prop is true', () => {
    render(<Checkbox checked={true} onChange={() => {}} />)
    const input = screen.getByRole('checkbox')
    expect(input).toBeChecked()
  })

  it('calls onChange with correct value when clicked', () => {
    render(<Checkbox checked={false} onChange={handleChange} />)
    const input = screen.getByRole('checkbox')
    fireEvent.click(input)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox checked={false} onChange={() => {}} disabled />)
    const input = screen.getByRole('checkbox')
    expect(input).toBeDisabled()
  })
})
