import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { describe, it, vi } from 'vitest'

import { Step } from './interface'

import Timeline from './Timeline'

// Helper to set window width and fire resize
function setWindowWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
}

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

const defaultSteps = [
  { key: 'submitted', label: 'submitted' },
  { key: 'peer_review', label: 'peer review' },
  { key: 'accepted', label: 'accepted' },
  { key: 'published', label: 'published' },
]

describe('Timeline', () => {
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

    expect(screen.getByText('accepted')).toBeTruthy()
  })

  it('handles an empty steps array', () => {
    const { container } = render(<Timeline steps={[]} currentStatus="submitted" />)

    const items = container.querySelectorAll('.timeline-item')
    expect(items.length).toBe(0)
  })
})

describe('Timeline — mobile behavior', () => {
  afterEach(() => {
    setWindowWidth(1024) // reset to desktop after each test
  })

  it('renders the timeline on desktop', () => {
    setWindowWidth(1024)
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="submitted" />)
    expect(container.querySelector('.timeline-container')).toBeTruthy()
    expect(container.querySelector('[data-testid="status-badge-id"]')).toBeNull()
  })

  it('renders only the status badge on mobile', () => {
    setWindowWidth(400)
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="submitted" />)
    expect(container.querySelector('.timeline-container')).toBeNull()
    expect(container.querySelector('[data-testid="status-badge-id"]')).toBeTruthy()
  })

  it('switches to mobile badge when window is resized below 767px', () => {
    setWindowWidth(1024)
    const { container } = render(<Timeline steps={defaultSteps} currentStatus="accepted" />)
    expect(container.querySelector('.timeline-container')).toBeTruthy()

    setWindowWidth(400)
    expect(container.querySelector('.timeline-container')).toBeNull()
    expect(container.querySelector('[data-testid="status-badge-id"]')).toBeTruthy()
  })
})
