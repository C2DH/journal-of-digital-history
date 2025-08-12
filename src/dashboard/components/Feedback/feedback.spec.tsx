import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Feedback from './Feedback'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('Feedback', () => {
  it('renders error feedback', () => {
    const { container } = render(<Feedback type="error" message="Something went wrong" />)
    expect(screen.getByText('error.general')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(container.querySelector('.feedback-icon-bg-error')).toBeTruthy()
  })

  it('renders warning feedback', () => {
    const { container } = render(<Feedback type="warning" message="Be careful" />)
    expect(screen.getByText('warning.general')).toBeInTheDocument()
    expect(screen.getByText('Be careful')).toBeInTheDocument()
    expect(container.querySelector('.feedback-icon-bg-warning')).toBeTruthy()
  })
})

expect.extend({
  toBeTruthy(received) {
    return {
      pass: !!received,
      message: () => `Expected element to exist`,
    }
  },
})
