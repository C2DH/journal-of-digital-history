import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Step } from './interface'

import Timeline from './Timeline'

vi.mock('../../utils/constants/article', () => ({
  articleStatus: [
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
  ],
}))

const mockSteps: Step[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'accepted', label: 'Accepted' },
]

describe('Timeline', () => {
  it('renders the correct number of timeline items', () => {
    render(<Timeline steps={mockSteps} currentStatus="UNDER_REVIEW" />)

    const items = document.querySelectorAll('.timeline-item')
    expect(items).toHaveLength(mockSteps.length)
  })

  it('renders the correct status badge label', () => {
    render(<Timeline steps={mockSteps} currentStatus="UNDER_REVIEW" />)

    expect(screen.getByText('Under Review')).toBeInTheDocument()
  })

  it('renders "Unknown" when status is not found in articleStatus', () => {
    render(<Timeline steps={mockSteps} currentStatus="UNKNOWN_STATUS" />)

    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('applies correct colors for each step state', () => {
    render(<Timeline steps={mockSteps} currentStatus="UNDER_REVIEW" />)

    const items = document.querySelectorAll('.timeline-item span')
    expect(items[0]).toHaveClass('timeline-done')
    expect(items[1]).toHaveClass('timeline-pending')
    expect(items[2]).toHaveClass('timeline-todo')
  })

  it('renders correct icons for each step state', () => {
    render(<Timeline steps={mockSteps} currentStatus="UNDER_REVIEW" />)

    const items = document.querySelectorAll('.timeline-item span')
    expect(items[0].textContent).toBe('check_circle') // done
    expect(items[1].textContent).toBe('error') // current
    expect(items[2].textContent).toBe('radio_button_unchecked') // todo
  })

  it('marks all steps as done except the last when current is last step', () => {
    render(<Timeline steps={mockSteps} currentStatus="ACCEPTED" />)

    const items = document.querySelectorAll('.timeline-item span')
    expect(items[0]).toHaveClass('timeline-done')
    expect(items[1]).toHaveClass('timeline-done')
    expect(items[2]).toHaveClass('timeline-pending')
  })

  it('marks all steps as todo except the first when current is first step', () => {
    render(<Timeline steps={mockSteps} currentStatus="SUBMITTED" />)

    const items = document.querySelectorAll('.timeline-item span')
    expect(items[0]).toHaveClass('timeline-pending')
    expect(items[1]).toHaveClass('timeline-todo')
    expect(items[2]).toHaveClass('timeline-todo')
  })

  it('applies correct css class to status badge', () => {
    render(<Timeline steps={mockSteps} currentStatus="ACCEPTED" />)

    const badge = document.querySelector('.status-fancy-badge')
    expect(badge).toHaveClass('accepted')
  })
})
