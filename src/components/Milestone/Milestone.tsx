import './Milestone.css'

import hljs from 'highlight.js'
import parse from 'html-react-parser'
import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'iconoir-react'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault } from 'use-query-params'

import {
  FilterByQueryparam,
  OrderByQueryParam,
  StatusSuccess,
} from '../../constants/globalConstants'
import { validateForm } from '../../dashboard/utils/helpers/schema'
import { useGetJSON } from '../../logic/api/fetchData'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import Facets from '../Facets/Facets'
import OrderByDropdown from '../OrderByDropdown'
import MonthCard from './Card/MonthCard'
import { getMonths } from './helper'
import { milestoneSchema } from './schema'

const Milestone = () => {
  const { t } = useTranslation()

  const [selectedIndices, setSelectedIndices] = useState<any>(null)
  const [facetsResetKey, setFacetsResetKey] = useState(0)
  const [cursor, setCursor] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const MONTH = 12

  const {
    data: dataGithub,
    error: errorGithub,
    status: statusGithub,
  } = useGetJSON({
    url: import.meta.env.VITE_WIKI_EVENTS,
  })

  const {
    data: articles,
    error: errorArticles,
    status: statusArticles,
  } = useGetJSON({
    url: '/api/articles?limit=500',
    delay: 0,
  })

  const { parsedTimeline, timelineError } = useMemo(() => {
    if (!dataGithub) return {}
    let json = {}

    //Validate Github Data
    try {
      if (statusGithub !== StatusSuccess) {
        return { parsedTimeline: null, timelineError: null }
      }

      if (!dataGithub || typeof dataGithub !== 'string') {
        return {
          parsedTimeline: null,
          timelineError: t('milestone.error.emptyData'),
        }
      }

      if (statusGithub === StatusSuccess) {
        json = JSON.parse(dataGithub.replace(/^```json\n/, '').replace(/\n```$/, ''))
      }
    } catch (e) {
      return {
        parsedTimeline: null,
        timelineError: t('milestone.error.notValid'),
      }
    }

    const { valid, errors } = validateForm(json, milestoneSchema)

    if (!valid) {
      const detail = errors?.[0]?.message ?? t('milestone.error.structure')
      return {
        parsedTimeline: null,
        timelineError: `${t('milestone.error.malformed')} ${detail}`,
      }
    }

    // Merging data from API and Github
    const articlesByYear = (articles?.results ?? []).reduce((acc, article) => {
      const year = DateTime.fromISO(article.publication_date).year
      const issue = article.issue.pid.replace(/jdh0+(\d+)/, (m, n) => n)
      const title = article.data.title[0].replace('# ', '')

      if (!acc[year]) {
        acc[year] = []
      }

      acc[year].push({
        date: article.publication_date,
        title: title,
        issue: issue,
        pid: article.abstract.pid,
      })

      return acc
    }, {})

    const articlesAndGithubData = Object.keys(json).reduce((acc, year) => {
      acc[year] = {
        ...json[year],
        articles: articlesByYear[year] ?? [],
      }
      return acc
    }, {})

    return { parsedTimeline: articlesAndGithubData, timelineError: null }
  }, [articles, dataGithub])

  // Set up years for dropdown
  const years = Object.keys(parsedTimeline ?? [])
    .map((year) => ({ value: year, label: year }))
    .reverse()

  const [{ [OrderByQueryParam]: orderByYear }, setQuery] = useQueryParams({
    [OrderByQueryParam]: withDefault(
      asEnumParam(years.map((year) => year.value)),
      years[0]?.value ?? '',
    ),
    [FilterByQueryparam]: asRegexArrayParam(),
  })

  const months = getMonths(MONTH, orderByYear, cursor)

  const currentYearData = parsedTimeline?.[orderByYear] ?? {
    articles: [] as any[],
    callForPapers: [] as any[],
    conferences: [] as any[],
    releases: [] as any[],
  }

  const milestoneItems = currentYearData
    ? [
        ...currentYearData.articles.map((item) => ({ ...item, type: 'Articles' })),
        ...currentYearData.callForPapers.map((item) => ({ ...item, type: 'Call for Papers' })),
        ...currentYearData.conferences.map((item) => ({ ...item, type: 'Conferences' })),
        ...currentYearData.releases.map((item) => ({ ...item, type: 'Releases' })),
      ]
    : []

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
      ? milestoneItems
      : milestoneItems.filter((_, index) => selectedIndices?.includes(index))

  const handleFacetAll = () => {
    setSelectedIndices(null)
    setFacetsResetKey((k) => k + 1)
  }

  useEffect(() => {
    setCursor(0)
  }, [orderByYear])

  if (timelineError || errorArticles || errorGithub || parsedTimeline === undefined) {
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

  // --- Scrolling with arrows ---
  const handleScroll = (direction) => {
    if (!containerRef.current) return
    const scrollAmount = 300 // Length for the scrolling in pixels

    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // --- Scrolling with Drag to Scroll ---
  const handleMouseDown = (e) => {
    const container = containerRef.current
    if (!container) return

    setIsDragging(true)
    // Initial position for the mouse related to the container
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeft(container.scrollLeft)
  }

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
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
              key={`${orderByYear}-${facetsResetKey}`}
              dimensions={milestoneDimensions}
              items={milestoneItems}
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
            onChange={({ value }) => setQuery({ [OrderByQueryParam]: value })}
          />
        </div>
      </div>
      <div
        className={`milestone-timeline ${isDragging ? 'dragging' : ''}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        <ArrowLeftCircle className={`timeline-btn`} onClick={() => () => handleScroll('left')} />
        {months.map(({ key, title }) => {
          return (
            <MonthCard
              key={key}
              title={title}
              events={visibleItems.filter((item) => item.date.startsWith(key))}
            />
          )
        })}
        <ArrowRightCircle className={`timeline-btn`} onClick={() => handleScroll('right')} />
      </div>
    </div>
  )
}

export default Milestone
