import { render, screen } from '@testing-library/react'

import ProgressBar from './ProgressBar'

describe('ProgressBar', () => {
  it('should render the progress bar', () => {
    render(<ProgressBar days={30} />)

    const container = screen.getByTestId('progress-bar-container')
    const progressBar = screen.getByTestId('progress-bar-fill')
    const days = screen.getByTestId('days-left')

    expect(container).toBeInTheDocument()
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle({ color: 'green' })
    expect(days).toBeInTheDocument()
  })

  it('should display the green progress bar if article is on time', () => {
    const print = render(<ProgressBar days={-74} />)

    const progressBar = screen.getByTestId('progress-bar-fill')
    expect(progressBar).toHaveStyle({ background: 'green' })
  })
  it('should display the orange progress bar if article is closed to its due date', () => {
    render(<ProgressBar days={15} />)

    const progressBar = screen.getByTestId('progress-bar-fill')
    expect(progressBar).toHaveStyle({ background: 'orange' })
  })
  it('should display the red progress bar if article is overdue', () => {
    render(<ProgressBar days={-100} />)

    const progressBar = screen.getByTestId('progress-bar-fill')
    expect(progressBar).toHaveStyle({ background: 'red' })
  })
})
