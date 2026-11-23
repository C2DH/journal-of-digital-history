import { render, screen } from '@testing-library/react'
import { DateTime, Settings } from 'luxon'
import { describe, expect, it, vi } from 'vitest'

import StatusLog from './StatusLog'

// Mock the date helper
vi.mock('../../utils/helpers/date', () => ({
  convertDate: vi.fn((date) => '25 Dec 2023'),
}))

// Mock the constants with simplified versions
vi.mock('../../utils/constants/article', () => ({
  articleSteps: [
    { key: 'draft', label: 'Writing', icon: <span>WritingIcon</span> },
    { key: 'published', label: 'Published', icon: <span>PublishedIcon</span> },
  ],
}))

vi.mock('../../utils/constants/abstract', () => ({
  abstractStatus: [
    { key: 1, value: 'ACCEPTED', label: 'Accepted' },
    { key: 2, value: 'SUBMITTED', label: 'Submitted' },
    { key: 3, value: 'SUSPENDED', label: 'Suspended' },
    { key: 4, value: 'ABANDONED', label: 'Abandoned' },
    { key: 5, value: 'DECLINED', label: 'Declined' },
  ],
}))

describe('StatusLog', () => {
  describe('Article mode', () => {
    it('renders article logs with status labels', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'draft', user: 'John Doe' },
        { date: '2023-12-26T10:00:00Z', status: 'published', user: 'Jane Smith' },
      ]

      render(<StatusLog logs={logs} isArticle={true} isAbstract={false} />)

      expect(screen.getByText('Writing')).toBeInTheDocument()
      expect(screen.getByText(/by John Doe/)).toBeInTheDocument()
      expect(screen.getByText('Published')).toBeInTheDocument()
      expect(screen.getByText(/by Jane Smith/)).toBeInTheDocument()
    })

    it('renders formatted dates', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'draft', user: '' }]

      render(<StatusLog logs={logs} isArticle={true} isAbstract={false} />)

      expect(screen.getAllByText('25 Dec 2023')).toHaveLength(1)
    })

    it('displays Rejected for unmatched article status', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'unknown', user: '' }]

      render(<StatusLog logs={logs} isArticle={true} isAbstract={false} />)

      expect(screen.getByText('Rejected')).toBeInTheDocument()
    })

    it('renders without user when user is empty', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'draft', user: '' }]

      render(<StatusLog logs={logs} isArticle={true} isAbstract={false} />)

      expect(screen.getByText('Writing')).toBeInTheDocument()
      expect(screen.queryByText(/by/)).not.toBeInTheDocument()
    })
  })

  describe('Abstract mode', () => {
    //Mock for DateTime.now() with luxon

    const expectedNow = DateTime.local(2023, 12, 1, 23, 0, 0)
    Settings.now = () => expectedNow.toMillis()

    it('renders abstract logs with status labels', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: 'Alice' },
        { date: '2023-12-26T10:00:00Z', status: 'ACCEPTED', user: 'Bob' },
      ]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      // ACCEPTED and SUBMITTED should have CheckCircle icon with check class (green)
      const checkIcons = container.querySelectorAll('.log-check-icon')
      expect(checkIcons).toHaveLength(2)

      expect(screen.getByText('Submitted')).toBeInTheDocument()
      expect(screen.getByText(/by Alice/)).toBeInTheDocument()
      expect(screen.getByText('Accepted')).toBeInTheDocument()
      expect(screen.getByText(/by Bob/)).toBeInTheDocument()
    })

    it('prepends "Waiting for action" when only one log exists', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: 'Alice' }]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      const warningIcons = container.querySelectorAll('.log-warning-icon')
      expect(warningIcons.length).toBeGreaterThan(0)

      expect(logs[0]).include({
        date: String(DateTime.now()),
        status: 'Waiting for action',
        user: '',
      })
      expect(screen.getAllByText('Waiting for action')).toHaveLength(1)
      expect(screen.getByText('Submitted')).toBeInTheDocument()
    })

    it('should not write `Waiting for action` when multiple logs exist', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: 'Alice' },
        { date: '2023-12-26T10:00:00Z', status: 'ACCEPTED', user: 'Bob' },
      ]

      render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      expect(screen.queryByText('Waiting for action')).not.toBeInTheDocument()
    })

    it('displays `Waiting for action` for unmatched abstract status', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'UNKNOWN', user: '' }]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      const warningIcons = container.querySelectorAll('.log-warning-icon')
      expect(warningIcons.length).toBeGreaterThan(0)

      expect(screen.getAllByText('Waiting for action')).toHaveLength(2)
    })

    it('renders SUSPENDED status correctly', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: '' },
        { date: '2023-12-26T10:00:00Z', status: 'SUSPENDED', user: 'Admin' },
      ]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      const warningIcons = container.querySelectorAll('.log-warning-icon')
      expect(warningIcons.length).toBeGreaterThan(0)

      expect(screen.getByText('Suspended')).toBeInTheDocument()
      expect(screen.getByText(/by Admin/)).toBeInTheDocument()
    })

    it('renders ABANDONED status correctly', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: '' },
        { date: '2023-12-26T10:00:00Z', status: 'ABANDONED', user: '' },
      ]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      const errorIcons = container.querySelectorAll('.log-abandoned-icon')
      expect(errorIcons).toHaveLength(1)

      expect(screen.getByText('Abandoned')).toBeInTheDocument()
    })

    it('renders DECLINED status correctly', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: '' },
        { date: '2023-12-26T10:00:00Z', status: 'DECLINED', user: '' },
      ]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      const errorIcons = container.querySelectorAll('.log-declined-icon')
      expect(errorIcons).toHaveLength(1)

      expect(screen.getByText('Declined')).toBeInTheDocument()
    })
  })

  describe('Icon rendering general', () => {
    it('renders icons for article statuses', () => {
      const logs = [{ date: '2023-12-25T10:00:00Z', status: 'draft', user: '' }]

      const { container } = render(<StatusLog logs={logs} isArticle={true} isAbstract={false} />)

      // Check that status icon is rendered (via title attribute)
      const statusIcon = container.querySelector('[title="DRAFT"]')
      expect(statusIcon).toBeInTheDocument()
    })

    it('renders icon placeholders for abstract statuses', () => {
      const logs = [
        { date: '2023-12-25T10:00:00Z', status: 'SUBMITTED', user: '' },
        { date: '2023-12-26T10:00:00Z', status: 'ACCEPTED', user: '' },
      ]

      const { container } = render(<StatusLog logs={logs} isArticle={false} isAbstract={true} />)

      // Abstract mode renders empty divs for spacing
      const spacers = container.querySelectorAll('div[style*="width: 24px"]')
      expect(spacers.length).toBeGreaterThan(0)
    })
  })
})
