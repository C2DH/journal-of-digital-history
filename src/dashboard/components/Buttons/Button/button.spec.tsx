import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Button from './Button'

const handleClick = vi.fn()

describe('Button', () => {
  it('renders with given text', () => {
    render(<Button text="Click me" type="button" variant="primary" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies the correct classes', () => {
    render(<Button text="Test" type="submit" variant="secondary" onClick={() => {}} />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('default-button')
    expect(button).toHaveClass('secondary')
  })

  it('calls onClick when clicked', () => {
    render(<Button text="Press" type="button" variant="primary" onClick={handleClick} />)
    fireEvent.click(screen.getByText('Press'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
