import './Milestone.css'

import hljs from 'highlight.js'
import parse from 'html-react-parser'
import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'iconoir-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault } from 'use-query-params'

import { FilterByQueryparam, OrderByQueryParam } from '../../constants/globalConstants'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import Facets from '../Facets/Facets'
import OrderByDropdown from '../OrderByDropdown'
import MonthCard from './Card/MonthCard'
import useMilestoneFetch from './fetch'
import { getMonths } from './helper'

const Milestone = () => {
  const { t } = useTranslation()

  const {
    parsedTimeline: timeline,
    timelineError,
    errorArticles,
    errorGithub,
  } = useMilestoneFetch()

  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const [selectedIndices, setSelectedIndices] = useState<any>(null)
  const [facetsResetKey, setFacetsResetKey] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const MONTH = 12

  // Set up years for dropdown
  const years = Object.keys(timeline ?? [])
    .map((year) => ({ value: year, label: year }))
    .reverse()

  const [{ [OrderByQueryParam]: orderByYear }, setQuery] = useQueryParams({
    [OrderByQueryParam]: withDefault(
      asEnumParam(years.map((year) => year.value)),
      years.at(-1)?.value ?? '',
    ),
    [FilterByQueryparam]: asRegexArrayParam(),
  })

  const months = getMonths(timeline, MONTH)

  const allEvents = useMemo(() => {
    if (!timeline) return []

    return Object.keys(timeline).flatMap((year) => {
      const eventsOneYear = timeline[year]

      return [
        ...eventsOneYear.articles.map((item) => ({ ...item, type: 'Articles' })),
        ...eventsOneYear.callForPapers.map((item) => ({ ...item, type: 'Call for Papers' })),
        ...eventsOneYear.conferences.map((item) => ({ ...item, type: 'Conferences' })),
        ...eventsOneYear.releases.map((item) => ({ ...item, type: 'Releases' })),
      ]
    })
  }, [timeline])

  const milestoneDimensions = [
    {
      fixed: true,
      name: 'type',
      isArray: false,
      fn: (item) => item.type,
      sortFn: (a, b) => a.key.localeCompare(b.key),
    },
  ]

  const visibleItems =
    selectedIndices === null
      ? allEvents
      : allEvents.filter((_, index) => selectedIndices?.includes(index))

  const handleFacetAll = () => {
    setSelectedIndices(null)
    setFacetsResetKey((k) => k + 1)
  }

  const handleScrollSync = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    setAtStart(container.scrollLeft <= 0)
    setAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 1)

    if (isProgrammaticScroll.current) return

    const containerLeft = container.getBoundingClientRect().left
    const children = container.querySelectorAll<HTMLElement>('.month-container')

    for (let i = 0; i < children.length; i++) {
      if (children[i].getBoundingClientRect().right > containerLeft + 4) {
        const year = months[i]?.year
        if (year && year !== orderByYear) {
          setQuery({ [OrderByQueryParam]: year }, 'replaceIn')
        }
        break
      }
    }
  }, [months, orderByYear, setQuery])

  const scrollToYear = useCallback(
    (year: string) => {
      const el = containerRef.current
      if (!el) return

      const idx = months.findIndex((m) => m.year === year)
      if (idx < 0) return

      const children = el.querySelectorAll<HTMLElement>('.month-container')
      const target = children[idx]
      if (!target) return

      const left =
        target.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft
      isProgrammaticScroll.current = true
      el.scrollTo({ left, behavior: 'smooth' })
      setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 600)
      setQuery({ [OrderByQueryParam]: year }, 'replaceIn')
    },
    [months, setQuery],
  )

  const handleScroll = (direction) => {
    if (!containerRef.current) return
    const scrollAmount = 300 // Length for the scrolling in pixels

    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (e) => {
    const container = containerRef.current
    if (!container) return

    setIsDragging(true)
    // Initial position for the mouse related to the container
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const container = containerRef.current
    if (!container) return

    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1.5 // Speed
    container.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
  }

  if (timelineError || errorArticles || errorGithub || timeline === undefined) {
    const err = hljs.highlight(
      'typescript',
      `${t('milestone.error.general')} ${timelineError || errorArticles || errorGithub}`,
    )
    return (
      <pre className="hljs" data-test="error-message">
        <div>{parse(err.value)}</div>
      </pre>
    )
  }

  return (
    <div className="milestone-wrapper">
      <p>Key dates and events for {orderByYear}</p>
      <div className="milestone-filter">
        <div>
          <div className="milestone-facets">
            {' '}
            <p>Filter by</p>
            <button
              className={`milestone-btn-all ${selectedIndices === null ? 'active' : ''}`}
              onClick={handleFacetAll}
            >
              All
            </button>
            <Facets
              key={facetsResetKey}
              dimensions={milestoneDimensions}
              items={allEvents}
              onSelect={(_, indices) => setSelectedIndices(indices)}
              className="milestone"
            />
          </div>
        </div>
        <div className="milestone-dropdown">
          <Calendar />
          <OrderByDropdown
            selectedValue={orderByYear}
            values={years}
            title={t(`${orderByYear}`)}
            onChange={({ value }) => scrollToYear(value)}
          />
        </div>
      </div>
      <div className="milestone-timeline-wrapper">
        {!atStart && (
          <ArrowLeftCircle
            className="timeline-btn timeline-btn-left"
            onClick={() => handleScroll('left')}
          />
        )}
        <div
          className={`milestone-timeline ${isDragging ? 'dragging' : ''}`}
          ref={containerRef}
          onScroll={handleScrollSync}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          {months.map(({ key, title }) => {
            return (
              <MonthCard
                key={key}
                title={title}
                events={visibleItems.filter((item) => item.date.startsWith(key))}
              />
            )
          })}
        </div>
        {!atEnd && (
          <ArrowRightCircle
            className={`timeline-btn timeline-btn-right`}
            onClick={() => handleScroll('right')}
          />
        )}
      </div>
    </div>
  )
}

export default Milestone
