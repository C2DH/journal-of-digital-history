import React, { useRef } from 'react'
import ToCStep from './ToCStep'
import '../styles/components/ToC.scss'
import ToCStepGroup from './ToCStepGroup'
import ToCIntoView from './ToCIntoView'

const ToC = ({
  steps = [],
  selectedId = -1,
  width = 200,
  onClick,
  className = '',
  stepHeight = 20,
  visibleHeight = 200,
  aboveTheFoldSteps = 2,
}) => {
  const ref = useRef(null)
  const shouldCollapse = stepHeight * steps.length > visibleHeight

  // get tree of headings and figures last stuff
  const groups = shouldCollapse
    ? steps.reduce(
        (acc, d, i, arr) => {
          if (d.level.indexOf('H2') !== 0) {
            acc.buffer.push(d)
            // if this is the last one
            if (i + 1 === arr.length) {
              acc.groups.push([...acc.buffer])
              acc.buffer = []
            }
          } else {
            if (acc.buffer.length) {
              acc.groups.push([...acc.buffer])
              acc.buffer = []
            }
            acc.groups.push(d)
          }
          if (i + 1 === arr.length) {
            return acc.groups
          }
          return acc
        },
        { buffer: [], groups: [] },
      )
    : steps

  const selected = steps.reduce((acc, d, i) => {
    if (acc !== -1) {
      return acc
    }
    if (Array.isArray(d)) {
      if (d.some((di) => di.id === selectedId)) {
        return i
      }
    } else if (d.id === selectedId) {
      return i
    }
    return acc
  }, -1)

  console.debug(
    '[ToC] \n - shouldCollapse:',
    shouldCollapse,
    '\n - steps:',
    steps.length,
    '\n - selected index:',
    selected,
  )
  const stepGroups = Array.isArray(groups) ? groups : []

  return (
    <div className={`ToC ${className}`}>
      <div ref={ref} style={{ height: visibleHeight, overflow: 'scroll' }}>
        {stepGroups.map((step, i) => {
          if (!Array.isArray(step)) {
            return <ToCStep key={i} {...step} width={width} onClick={onClick} />
          } else if (step.length > aboveTheFoldSteps) {
            // if at least one og the steps is `active`, we expand the group.
            // dep as loading force the scroll...
            const isAtLEastOneStepSelected = step.some((d) => !!d.isSelected)

            return (
              <ToCStepGroup
                key={i}
                steps={step}
                isSelected={isAtLEastOneStepSelected}
                aboveTheFoldSteps={aboveTheFoldSteps}
                width={width}
                onClick={onClick}
              />
            )
          }
          return step.map((s, j) => (
            <ToCStep key={[i, j].join('-')} {...s} width={width} onClick={onClick} />
          ))
        })}
      </div>
      {selected !== -1 && <ToCIntoView targetRef={ref} targetOffsetTop={selected * stepHeight} />}
    </div>
  )
}

export default ToC
