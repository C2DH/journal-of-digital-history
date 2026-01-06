import { render, screen } from '@testing-library/react'

import ProgressBar from './progressBar'

const progressBarContainer = expect(screen.getByTestId('progress-bar-container'))
const progressBar = expect(screen.getByTestId('progress-bar-fill'))
const daysLeft = expect(screen.getByTestId('days-left'))

describe('ProgressBar', () => {
  it('should render the progress bar', () => {
    render(<ProgressBar days={60} />)

    progressBarContainer.toBeIntheDocument()

    progressBar.toBeInTheDocument()
    progressBar.toHaveStyle({ color: 'green' })
    daysLeft.toBeInTheDocument()
  })

  it('should display the green progress bar if article is on time', () => {
    render(<ProgressBar days={-74} />)
    progressBar.toHaveStyle({ color: 'green' })
  })
  it('should display the orange progress bar if article is closed to its due date', () => {
    render(<ProgressBar days={15} />)
    progressBar.toHaveStyle({ color: 'orange' })
  })
  it('should display the red progress bar if article is overdue', () => {
    render(<ProgressBar days={-100} />)
    progressBar.toHaveStyle({ color: 'red' })
  })
})
