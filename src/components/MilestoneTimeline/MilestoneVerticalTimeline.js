import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './MilestoneTimeline.module.scss'
import { Scrollama, Step } from 'react-scrollama';

const MilestoneVerticalScrollama = ({ values, onStepChange }) => {
  const { t } = useTranslation()
  const [currentStepIndex, setCurrentStepIndex] = useState(null)
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data)
    onStepChange(data)
  }

  return (
    <Scrollama onStepEnter={onStepEnter} offset={0.6} threshold={0}>
      {values.map((d, stepIndex) => (
        <Step data={stepIndex} key={stepIndex}>
          <div style={{
            willChange: 'opacity',
            transition: 'opacity var(--transition)',
            opacity: currentStepIndex === stepIndex ? 1 : 0.5,
          marginTop: window.innerHeight / 4}}>{stepIndex}
            <b className="monospace">{t('dates.short', {date: d.date})}</b>
            <h3 className="d-block">{d.title}</h3>
            <p>{d.description}</p>
          </div>
        </Step>
      ))}
    </Scrollama>
  )
}


const MilestoneVerticalTimeline = ({ values=[], size=0, scale, minDate, maxDate }) => {
  const { t } = useTranslation()
  const now = new Date()
  const sortedvalues = values.sort((a, b) => a.date - b.date)
  const [currentStepIndex, setCurrentStepIndex] = useState(null)

  const handleStepChange = (i) => {
    console.info('handleStepChange', i)
    setCurrentStepIndex(i)
  }
  return (
    <div>
      <div className={`${styles.MilestoneVerticalWrapper} my-4`}>
        <div className="position-absolute h-100" style={{
          left: 20,
          width: 1,
          backgroundColor: 'var(--dark)'
        }}/>
        <div className={`${styles.AxisEdge} ${styles.top}`} >{t('dates.short', {date: minDate })}</div>
        <div className={`${styles.AxisEdge} ${styles.bottom}`}>{t('dates.short', {date: maxDate })}</div>
        <div className={`${styles.MilestoneVerticalPointer} blink`} style={{
          top: `${scale(now)}%`,
          width: 40,
        }}> </div>
        {values.map((d, i) => (
          <div className={`${styles.MilestoneCircle} ${currentStepIndex === i ? 'pulse': ''}`}
            key={i}
            style={{
              top: `${scale(d.date)}%`,
              left: d.level === 'top' ? 30 : 10,
              backgroundColor: d.level === 'top' ? 'var(--accent)' :'var(--secondary)',
            }}
          />
        ))}
      </div>
      {/* Scrolla */}
      <div style={{
        position: 'relative',
        marginLeft: 50,
        paddingLeft: 'var(--spacer-4)',
        paddingBottom: window.innerHeight / 4,
      }}>
      <div className="position-absolute" style={{
        top: -window.innerHeight / 2,
        left: 0,
        paddingLeft: 'var(--spacer-4)',
        right: 0
      }}>scroll down to get the list of events</div>
      <MilestoneVerticalScrollama onStepChange={handleStepChange} values={sortedvalues} />
      </div>
    </div>
  )
}

export default MilestoneVerticalTimeline
