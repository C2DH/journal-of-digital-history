import { render, screen } from '@testing-library/react'
import { DateTime, Settings } from 'luxon'

import Deadline from './Deadline'

const cfpDeadlineAbstract = {
  title: 'Call for Papers Abstracts',
  deadline_abstract: '2026-05-31T10:00:48Z',
  deadline_article: '2026-12-31T10:00:48Z',
}

const cfpDeadlineArticle = {
  title: 'Call for Papers Articles',
  deadline_abstract: '2025-05-31T10:00:48Z',
  deadline_article: '2026-12-31T10:00:48Z',
}

const cfpOpenEnded = {
  title: 'Call for Papers Open Forever',
  deadline_abstract: '2099-05-31T10:00:48Z',
  deadline_article: '2099-12-31T10:00:48Z',
}

//Rewriting the now timestamp
let originalNow: (typeof Settings)['now']
const now = DateTime.fromISO('2026-01-01T10:00:48Z', { zone: 'utc' }).toMillis()

describe('Deadline', () => {
  beforeEach(() => {
    originalNow = Settings.now
    Settings.now = () => now
  })

  afterEach(() => {
    Settings.now = originalNow
  })
  it('renders a CFP for 2026 with numbers of days left for abstract', () => {
    render(
      <Deadline
        cfpTitle={cfpDeadlineAbstract.title}
        deadlineAbstract={cfpDeadlineAbstract.deadline_abstract}
        deadlineArticle={cfpDeadlineAbstract.deadline_article}
      />,
    )

    expect(screen.getByText(cfpDeadlineAbstract.title)).toBeInTheDocument()
    expect(screen.getByText('151 days left')).toBeInTheDocument()
    expect(screen.getByText('Abstracts for 31 May 2026')).toBeInTheDocument()
  })
  it('renders a CFP for 2026 with numbers of days left for articles', () => {
    render(
      <Deadline
        cfpTitle={cfpDeadlineArticle.title}
        deadlineAbstract={cfpDeadlineArticle.deadline_abstract}
        deadlineArticle={cfpDeadlineArticle.deadline_article}
      />,
    )

    expect(screen.getByText(cfpDeadlineArticle.title)).toBeInTheDocument()
    expect(screen.getByText('364 days left')).toBeInTheDocument()
    expect(screen.getByText('Articles for 31 Dec 2026')).toBeInTheDocument()
  })
  it('renders a CFP open ended', () => {
    render(
      <Deadline
        cfpTitle={cfpOpenEnded.title}
        deadlineAbstract={cfpOpenEnded.deadline_abstract}
        deadlineArticle={cfpOpenEnded.deadline_article}
      />,
    )

    expect(screen.getByText(cfpOpenEnded.title)).toBeInTheDocument()
    expect(screen.getByText('open ended')).toBeInTheDocument()
    expect(screen.getByText('Abstracts for 31 May 2099')).toBeInTheDocument()
  })
})
