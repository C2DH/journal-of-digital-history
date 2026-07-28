import './Milestone.css'

import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'iconoir-react'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault } from 'use-query-params'

import { MilestoneProps } from './interface'

import { FilterByQueryparam, OrderByQueryParam } from '../../constants/globalConstants'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import Facets from '../Facets/Facets'
import OrderByDropdown from '../OrderByDropdown'

const EventCard = ({ date, text }) => {
  return (
    <div className="event-card">
      <div className="event-content">
        <div className="event-text" dangerouslySetInnerHTML={{ __html: text }}></div>
        <span className="event-date">{date}</span>
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
            <EventCard key={index} date={event.date} text={event.title} />
          ))}
        </div>
      </div>
    </div>
  )
}

const getMonths = (count: number = 6, year: number, cursor: number) => {
  const start = DateTime.fromObject({ year: year, month: 12 }).minus({ months: cursor })
  return Array.from({ length: count }, (_, i) => {
    const month = start.minus({ months: count - 1 - i }).startOf('month')
    return {
      key: month.toFormat('yyyy-MM'),
      title: month.toFormat('MMM'),
    }
  })
}

const Milestone = ({ data }: MilestoneProps) => {
  const { t } = useTranslation()
  const [selectedIndices, setSelectedIndices] = useState<any>(null)
  const [facetsResetKey, setFacetsResetKey] = useState(0)
  const [cursor, setCursor] = useState(0)

  const years = Object.keys(data)
    .map((year) => ({ value: year, label: year }))
    .reverse()

  const [{ [OrderByQueryParam]: orderBy }, setQuery] = useQueryParams({
    [OrderByQueryParam]: withDefault(asEnumParam(years.map((year) => year.value)), years[0].value),
    [FilterByQueryparam]: asRegexArrayParam(),
  })

  const months = getMonths(6, orderBy, cursor)

  const milestoneItems = [
    ...data[orderBy].articles.map((item) => ({ ...item, type: 'Articles' })),
    ...data[orderBy].issues.map((item) => ({ ...item, type: 'Issues' })),
    ...data[orderBy].callForPapers.map((item) => ({ ...item, type: 'Call for Papers' })),
    ...data[orderBy].conferences.map((item) => ({ ...item, type: 'Conferences' })),
    ...data[orderBy].releases.map((item) => ({ ...item, type: 'Releases' })),
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

  const handleAllClick = () => {
    setSelectedIndices(null)
    setFacetsResetKey((k) => k + 1)
  }

  return (
    <div>
      <p>Key dates and events for {orderBy}</p>
      <div className="milestone-filter">
        <div>
          <div className="milestone-facets">
            {' '}
            <p>Filter by</p>
            <button
              className={`milestone-btn-all ${selectedIndices === null ? 'active' : ''}`}
              onClick={handleAllClick}
            >
              All
            </button>
            <Facets
              key={`${orderBy}-${facetsResetKey}`}
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
            selectedValue={orderBy}
            values={years}
            title={t(`${orderBy}`)}
            onChange={({ value }) => setQuery({ [OrderByQueryParam]: value })}
          />
        </div>
      </div>
      <div className="milestone-timeline">
        <ArrowLeftCircle onClick={() => setCursor(cursor + 1)} />
        {months.map(({ key, title }) => {
          return (
            <MonthCard
              key={key}
              title={title}
              events={visibleItems.filter((item) => item.date.startsWith(key))}
            />
          )
        })}
        <ArrowRightCircle onClick={() => setCursor(cursor - 1)} />
      </div>
    </div>
  )
}

export default Milestone
