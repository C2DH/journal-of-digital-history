import { fireEvent, render, screen } from '@testing-library/react'

import ReadMore from './ReadMore'

describe('ReadMore', () => {
  it('renders the button', () => {
    render(
      <ReadMore
        text="This is a long text that needs to be truncated for the ReadMore component."
        maxLength={20}
      />,
    )
    expect(screen.getByText('more')).toBeInTheDocument()
  })
  it('toggles text expansion on button click', () => {
    const paragraph = 'This is a long text that needs to be truncated for the ReadMore component.'

    render(<ReadMore text={paragraph} maxLength={10} />)
    const more = screen.getByText('more')
    fireEvent.click(more)

    expect(screen.getByText('less')).toBeInTheDocument()
    expect(screen.getByText(paragraph)).toBeInTheDocument()
  })
  it('toggles text compression on button click', () => {
    const paragraph = 'This is a long text that needs to be truncated for the ReadMore component.'
    const truncatedParagraph = paragraph.slice(0, 10) + '...'

    render(<ReadMore text={paragraph} maxLength={10} />)
    const more = screen.getByText('more')
    fireEvent.click(more)

    expect(screen.getByText(paragraph)).toBeInTheDocument()

    const less = screen.getByText('less')
    fireEvent.click(less)

    expect(screen.getByText(truncatedParagraph)).toBeInTheDocument()
  })
})
