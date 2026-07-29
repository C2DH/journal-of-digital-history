import './Milestone.css'

import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'iconoir-react'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault } from 'use-query-params'

import { MilestoneProps } from './interface'

import { FilterByQueryparam, OrderByQueryParam } from '../../constants/globalConstants'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import Facets from '../Facets/Facets'
import OrderByDropdown from '../OrderByDropdown'

const EventCard = ({ date, text, type, issue }) => {
  return (
    <div className="event-card">
      <div className={`event-content ${type.replace(/\s/g, '')}`}>
        <div className="event-text" dangerouslySetInnerHTML={{ __html: text }}></div>
        <span className="event-date">
          {DateTime.fromISO(date).toFormat('d LLL yyyy')}
          {issue ? ` • Issue n.${issue}` : ''}
        </span>
      </div>
    </div>
  )
}

const MonthCard = ({ title, events }) => {
  return (
    <div className={`month-container`}>
      <span className="month-title">{title}</span>
      <div className="month-card">
        <div className="event-list">
          {events.map((event, index) => (
            <EventCard
              key={index}
              date={event.date}
              text={event.title}
              type={event.type}
              issue={event.issue}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const getMonths = (count: number = 6, year: number, cursor: number) => {
  const start = DateTime.fromObject({ year: year, month: 6 }).minus({ months: cursor })

  return Array.from({ length: count }, (_, i) => {
    const date = start.minus({ months: count - 1 - i }).startOf('month')

    return {
      key: date.toFormat('yyyy-MM'),
      title: date.toFormat('LLL'),
    }
  })
}

const Milestone = ({ data }: MilestoneProps) => {
  const { t } = useTranslation()
  const [selectedIndices, setSelectedIndices] = useState<any>(null)
  const [facetsResetKey, setFacetsResetKey] = useState(0)
  const [cursor, setCursor] = useState(0)
  const MAX_CURSOR = 0
  const MIN_CURSOR = -6

  const years = Object.keys(data)
    .map((year) => ({ value: year, label: year }))
    .reverse()

  const [{ [OrderByQueryParam]: orderByYear }, setQuery] = useQueryParams({
    [OrderByQueryParam]: withDefault(asEnumParam(years.map((year) => year.value)), years[0].value),
    [FilterByQueryparam]: asRegexArrayParam(),
  })
  const months = getMonths(6, orderByYear, cursor)

  const milestoneItems = [
    ...data[orderByYear].articles.map((item) => ({ ...item, type: 'Articles' })),
    ...data[orderByYear].callForPapers.map((item) => ({ ...item, type: 'Call for Papers' })),
    ...data[orderByYear].conferences.map((item) => ({ ...item, type: 'Conferences' })),
    ...data[orderByYear].releases.map((item) => ({ ...item, type: 'Releases' })),
  ]

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

  return (
    <div>
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
          onClick={() => handleCursor(1)}
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
          onClick={() => handleCursor(-1)}
        />
      </div>
    </div>
  )
}

export default Milestone
