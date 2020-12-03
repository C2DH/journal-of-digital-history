import React, {useState, useEffect} from 'react'
import { scaleTime } from 'd3-scale'
import { extent as d3extent, max as d3max } from 'd3-array'
import { useTranslation } from 'react-i18next'
import styles from './MilestoneTimeline.module.scss'
import MilestoneVerticalTimeline from './MilestoneVerticalTimeline'

const now = new Date()
let size = 200



const HorizontalTimeline = ({ values=[], size=0, scale, minDate, maxDate }) => {
  const { t } = useTranslation()
  const height = size;
  return (
    <div className="position-relative" style={{
      height,
    }}>
      <div className={`${styles.AxisEdge} ${styles.left}`} >{t('dates.short', {date: minDate })}</div>
      <div className={`${styles.AxisEdge} ${styles.right}`}>{t('dates.short', {date: maxDate })}</div>
      <div className={`${styles.MilestonePointer} blink`} style={{
        left: `${scale(now)}%`,
      }}> </div>
      {values.map((d, i) => (
        <div className={styles.MilestoneCircle} key={i} style={{
          left: `${scale(d.date)}%`,
          top: d.level === 'top' ? height/2 - 10 : height/2 + 10,
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

const MilestoneTimeline = ({ milestones=[], extent=[], showToday }) => {
  const values = milestones.map((d) => ({
    ...d,
    date: new Date(d.date)
  }))
  const [ minDate, maxDate ] = extent.length
    ? extent.map(d => new Date(d))
    : d3extent(values, (d) => d.date)
  const scale = scaleTime()
      .domain([minDate, maxDate]).range([0, 100])
  // update hegiht based on data stored, plus padding
  size = d3max(values, (d) => d.offsetTop) * 2 + 120
  const props = { values, scale, size, maxDate, minDate }

  const [dims, setDims] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setDims({
        h: window.innerHeight,
        w: window.innerWidth,
        isPortrait: window.innerHeight > window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  if (!dims) {
    return null
  }

  if (dims.isPortrait) {
    return (<MilestoneVerticalTimeline {...props} />)
  }
  return (<HorizontalTimeline {...props} />)
}


export default MilestoneTimeline
