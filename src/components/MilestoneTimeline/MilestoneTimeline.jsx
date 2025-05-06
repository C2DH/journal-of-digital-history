import React from 'react'
import { scaleTime } from 'd3-scale'
import { extent as d3extent } from 'd3-array'
import { useTranslation } from 'react-i18next'
import styles from './MilestoneTimeline.module.scss'
import MilestoneVerticalTimeline from './MilestoneVerticalTimeline'

const now = new Date()
let size = 200

const HorizontalTimeline = ({
  values = [],
  size = [100, -100],
  scale,
  minDate,
  maxDate,
  maxHeight,
}) => {
  const { t } = useTranslation()
  if (!size.length || isNaN(size[0])) {
    return null
  }
  const height = Math.abs(size[0]) + Math.abs(size[1])
  const origin = Math.abs(size[0])
  // esling-disable-next-line
  console.debug('[HorizontalTimeline] rendered', size, values)
  return (
    <div
      className="position-relative"
      style={{
        height,
      }}
    >
      <div
        className="position-absolute w-100"
        style={{
          top: origin,
          height: 1,
          backgroundColor: 'var(--dark)',
        }}
      />

      <div
        className={`${styles.MilestonePointer} blink`}
        style={{
          left: `${scale(now)}%`,
        }}
      >
        {' '}
      </div>

      <div className={`${styles.AxisEdge} ${styles.left}`} style={{ top: origin }}>
        {t('dates.short', { date: minDate })}
      </div>

      <div className={`${styles.AxisEdge} ${styles.right}`} style={{ top: origin }}>
        {t('dates.short', { date: maxDate })}
      </div>

      {values.map((d, i) => (
        <div
          className={styles.MilestoneCircle}
          key={i}
          style={{
            left: `${scale(d.date)}%`,
            top: origin,
          }}
        >
          <div
            className={styles.MilestoneLine}
            style={{
              top: d.level === 'top' ? d.y : 0,
              bottom: d.level === 'top' ? 0 : 'auto',
              height: d.level === 'top' ? 'auto' : parseInt(d.offsetTop, 10) + maxHeight,
            }}
          />
          <div
            className={styles.MilestoneLabel}
            style={{
              top: d.level === 'top' ? d.y : parseInt(d.offsetTop, 10),
              height: maxHeight,

              overflow: 'hidden',
              // top: d.level === 'top' ? 'auto': 0,
              // bottom: d.level === 'top' ? 0 : 'auto',
              // paddingTop: d.level === 'top'? 0: Math.abs(d.offsetTop),
              // paddingBottom: d.level === 'top' ? Math.abs(d.offsetTop) : 0
            }}
          >
            <b className="monospace">{t('dates.short', { date: d.date })}</b>
            <br />
            <span dangerouslySetInnerHTML={{ __html: d.title }} />
          </div>
        </div>
      ))}
    </div>
  )
}

const MilestoneTimeline = ({ isPortrait, milestones = [], extent = [], maxHeight = 100 }) => {
  const values = milestones.map((d) => ({
    ...d,
    y:
      d.level === 'top'
        ? -(parseInt(d.offsetTop, 10) + maxHeight)
        : parseInt(d.offsetTop, 10) + maxHeight,
    date: new Date(d.date),
  }))
  const [minDate, maxDate] = extent.length
    ? extent.map((d) => new Date(d))
    : d3extent(values, (d) => d.date)
  const scale = scaleTime().domain([minDate, maxDate]).range([0, 100])
  // update hegiht based on data stored, plus padding
  size = d3extent(values, (d) => d.y)

  const props = {
    values,
    scale,
    size,
    maxDate,
    minDate,
    maxHeight,
  }

  if (isPortrait) {
    return <MilestoneVerticalTimeline {...props} />
  }
  return <HorizontalTimeline {...props} />
}

export default MilestoneTimeline
