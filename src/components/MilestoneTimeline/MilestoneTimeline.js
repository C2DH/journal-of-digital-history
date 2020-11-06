import React from 'react'
import { scaleTime } from 'd3-scale'
import { extent, max as d3max } from 'd3-array'
import { useTranslation } from 'react-i18next'
import styles from './MilestoneTimeline.module.scss'


let height = 200

const MilestoneTimeline = ({ milestones=[] }) => {
  const { t } = useTranslation()
  const values = milestones.map((d) => ({
    ...d,
    date: new Date(d.date)
  }))
  const [ minDate, maxDate ] = extent(values, (d) => d.date)
  const scaleX = scaleTime()
      .domain([minDate, maxDate]).range([0, 100])
  // update hegiht based on data stored, plus padding
  height = d3max(values, (d) => d.offsetTop) * 2 + 100

  return (
    <div className="position-relative" style={{
      height,
    }}>
      <div className={`${styles.AxisEdge} ${styles.left}`} >{t('dates.short', {date: minDate })}</div>
      <div className={`${styles.AxisEdge} ${styles.right}`}>{t('dates.short', {date: maxDate })}</div>

      {values.map((d, i) => (
        <div className={styles.MilestoneCircle} key={i} style={{
          left: `${scaleX(d.date)}%`,
          top: d.level === 'top' ? height/2 - 20 : height/2 + 10,
        }}>
          <div className={styles.MilestoneLabel} style={{
            top: d.level === 'top' ? 'auto': 0,
            bottom: d.level === 'top' ? 0 : 'auto',
            paddingTop: d.level === 'top'? 0: Math.abs(d.offsetTop),
            paddingBottom: d.level === 'top' ? Math.abs(d.offsetTop) : 0
          }}><b className="monospace">{t('dates.short', {date: d.date})}</b><br/> <span>{d.title}</span></div>
        </div>
      ))}
      <div className="position-absolute w-100" style={{
        top: height/2,
        height: 1,
        backgroundColor: 'var(--dark)'
      }}/>
    </div>
  )
}


export default MilestoneTimeline
