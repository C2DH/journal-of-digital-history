import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'

import { Step } from './interface'

import Timeline from './Timeline'

// Mock the helper function
vi.mock('../../utils/helpers/timeline', () => ({
  getTimelineSteps: vi.fn((currentStatus: string, steps: Step[]) =>
    steps.map((step, idx) => ({
      colorClass: step.key === currentStatus ? 'active' : 'inactive',
      icon: <span data-testid={`icon-${idx}`}>{step.label}</span>,
    })),
  ),
}))

// Mock the articleStatus constant
vi.mock('../../utils/constants/article', () => ({
  articleStatus: [
    { value: 'submitted', label: 'Submitted' },
    { value: 'peer_review', label: 'Peer Review' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'published', label: 'Published' },
    { value: 'declined', label: 'Declined' },
  ],
}))

const mockSteps: Step[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'accepted', label: 'Accepted' },
]

describe('Timeline', () => {
  const defaultSteps = [
    { key: 'submitted', label: 'submitted' },
    { key: 'peer_review', label: 'peer review' },
    { key: 'accepted', label: 'accepted' },
    { key: 'published', label: 'published' },
  ]

  it('renders the timeline container and line', () => {
    render(<Timeline steps={defaultSteps} currentStatus="submitted" />)
    expect(document.querySelector('.timeline-container')).toBeTruthy()
    expect(document.querySelector('.timeline-line')).toBeTruthy()
  })

  it('renders the correct number of timeline items', () => {
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="submitted" />)

    const items = container.querySelectorAll('.timeline-item')
    expect(items.length).toBe(defaultSteps.length)
  })

  it('renders icons for each step', () => {
    render(<Timeline steps={defaultSteps} currentStatus="peer_review" />)
    defaultSteps.forEach((_, idx) => {
      expect(screen.queryByTestId(`icon-${idx}`)).toBeTruthy()
    })
  })

  it('applies the correct color class to each timeline item', () => {
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="peer_review" />)

    const items = container.querySelectorAll('.timeline-item')
    items.forEach((item, idx) => {
      if (defaultSteps[idx].key === 'peer_review') {
        expect(item.classList.contains('active')).toBe(true)
      } else {
        expect(item.classList.contains('inactive')).toBe(true)
      }
    })
  })

  it('displays the correct status label in the badge', () => {
    render(<Timeline steps={defaultSteps} currentStatus="accepted" />)

    expect(screen.getByText('Accepted')).toBeTruthy()
  })

  it('applies the correct CSS class to the status badge', () => {
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="accepted" />)

    const badge = container.querySelector('.status-fancy-badge')
    expect(badge).toBeTruthy()
    expect(badge?.classList.contains('accepted')).toBe(true)
  })

  it('displays "Unknown" when currentStatus does not match any articleStatus', () => {
    render(<Timeline steps={defaultSteps} currentStatus="nonexistent" />)

    expect(screen.getByText('Unknown')).toBeTruthy()
  })

  it('renders the simple-status-container', () => {
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="published" />)

    expect(container.querySelector('.simple-status-container')).toBeTruthy()
  })

  it('handles an empty steps array', () => {
    const { container } = render(<Timeline steps={[]} currentStatus="submitted" />)

    const items = container.querySelectorAll('.timeline-item')
    expect(items.length).toBe(0)
  })

  it('lowercases the currentStatus for the badge class', () => {
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="PUBLISHED" />)

    const badge = container.querySelector('.status-fancy-badge')
    expect(badge?.classList.contains('published')).toBe(true)
  })
})
