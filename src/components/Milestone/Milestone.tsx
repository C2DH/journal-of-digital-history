import './Milestone.css'

import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'iconoir-react'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQueryParams, withDefault } from 'use-query-params'

import {
  FilterByQueryparam,
  OrderByQueryParam,
  StatusSuccess,
} from '../../constants/globalConstants'
import { useCurrentWindowDimensions } from '../../hooks/graphics'
import { useGetJSON } from '../../logic/api/fetchData'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import Facets from '../Facets/Facets'
import OrderByDropdown from '../OrderByDropdown'

const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const typeClean = event.type.replace(/\s/g, '')
  const hasAnchor = event.title.includes('</a>')

  return (
    <div
      className={`event-card Dimension_${typeClean} ${hasAnchor ? 'hasAnchor' : ''}`}
      onClick={() => navigate(`/en/article/${event.pid}`)}
    >
      <div className={`event-content Dimension_${typeClean} ${hasAnchor ? 'hasAnchor' : ''}`}>
        <div className={`event-text`} dangerouslySetInnerHTML={{ __html: event.title }}></div>
        <span className="event-date">
          {DateTime.fromISO(event.date).toFormat('d LLL yyyy')}
          {event.issue ? ` • Issue n.${event.issue}` : ''}
        </span>
      </div>
    </div>
  )
}

const MonthCard = ({ title, events }) => {
  return (
    <div className="month-container">
      <span className="month-title">{title}</span>
      <div className="month-card">
        <div className="event-list">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

const getMonths = (month: number, year: number, cursor: number) => {
  const start = DateTime.fromObject({ year: Number(year), month }).minus({ months: cursor })

  return Array.from({ length: month }, (_, i) => {
    const date = start.minus({ months: month - 1 - i }).startOf('month')

    return {
      key: date.toFormat('yyyy-MM'),
      title: date.toFormat('LLL'),
    }
  })
}

const getMonthCount = (width: number) => {
  if (width < 768) return 2
  if (width < 1200) return 3
  return 6
}

const Milestone = () => {
  const { t } = useTranslation()
  const { width } = useCurrentWindowDimensions()

  const [selectedIndices, setSelectedIndices] = useState<any>(null)
  const [facetsResetKey, setFacetsResetKey] = useState(0)
  const [cursor, setCursor] = useState(0)

  const YEAR_MONTHS = 12
  const MONTH = getMonthCount(width)
  const MAX_CURSOR = 0
  const MIN_CURSOR = -(YEAR_MONTHS - MONTH)

  const {
    data: dataGithub,
    status: statusGithub,
    error,
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

  const data = useMemo(() => {
    if (!dataGithub) return {}
    let json = {}

    try {
      if (statusGithub === StatusSuccess) {
        json = JSON.parse(dataGithub.replace(/^```json\n/, '').replace(/\n```$/, ''))
      }
    } catch (e) {
      console.warn('Error loading timeline data:', e)
    }

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

    return Object.keys(json).reduce((acc, year) => {
      acc[year] = {
        ...json[year],
        articles: articlesByYear[year] ?? [],
      }
      return acc
    }, {})
  }, [articles, dataGithub])

  const years = Object.keys(data)
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

  const currentYearData = data[orderByYear]
  console.log('🚀 ~ file: Milestone.tsx:163 ~ data:', data)

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

  const handleCursor = (value: number) => {
    setCursor((prev) => Math.min(MAX_CURSOR, Math.max(MIN_CURSOR, prev + value)))
  }

  useEffect(() => {
    setCursor(0)
  }, [orderByYear])

  if (!currentYearData) {
    return null
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
      <div className="milestone-timeline">
        <ArrowLeftCircle
          className={`${cursor === MAX_CURSOR ? 'arrow-left-deactivate' : ''}`}
          onClick={() => handleCursor(MONTH)}
        />
        {months.map(({ key, title }) => {
          return (
            <MonthCard
              key={key}
              title={title}
              events={visibleItems.filter((item) => item.date.startsWith(key))}
            />
          )
        })}
        <ArrowRightCircle
          className={`${cursor === MIN_CURSOR ? 'arrow-right-deactivate' : ''}`}
          onClick={() => handleCursor(-MONTH)}
        />
      </div>
    </div>
  )
}

export default Milestone
