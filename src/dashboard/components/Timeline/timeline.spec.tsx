import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Timeline from './Timeline'

// Mock getTimelineSteps
vi.mock('../../utils/helpers/getTimelineStep', () => ({
  getTimelineSteps: () => [
    { icon: 'done', colorClass: 'green' },
    { icon: 'review', colorClass: 'blue' },
  ],
}))

describe('Timeline', () => {
  it('renders timeline items with correct icons and classes', () => {
    const steps = [
      { key: 'Submission', label: 'Submission', icon: 'upload_file' },
      { key: 'Design Review', label: 'Design Review', icon: 'palette' },
    ]
    render(<Timeline steps={steps} currentStatus="submitted" />)

    // There should be two timeline items
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(2)

    // Check for icons and color classes
    expect(screen.getByText('done')).toHaveClass('material-symbols-outlined')
    expect(screen.getByText('done')).toHaveClass('green')
    expect(screen.getByText('review')).toHaveClass('material-symbols-outlined')
    expect(screen.getByText('review')).toHaveClass('blue')
  })
})
