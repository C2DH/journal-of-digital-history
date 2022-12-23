import React from 'react'
import ToCStep from './ToCStep'
import '../styles/components/ToC.scss'
import ToCStepGroup from './ToCStepGroup'

const ToC = ({
  steps = [],
  width = 200,
  onClick,
  className = '',
  stepHeight = 20,
  visibleHeight = 200,
  aboveTheFoldSteps = 3,
}) => {
  console.debug(
    '[ToC] rendered',
    steps.map((d) => d.active),
  )
  const shouldCollapse = stepHeight * steps.length > visibleHeight
  // get tree of headings and figures last stuff
  const groups = shouldCollapse
    ? steps.reduce(
        (acc, d, i, arr) => {
          if (d.level.indexOf('H') !== 0) {
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

  console.debug(
    '[ToC] \n - shouldCollapse:',
    shouldCollapse,
    '\n - steps:',
    steps.length,
    '\n - groups:',
  )

  return (
    <div className={`ToC ${className}`} style={{ overflow: 'scroll' }}>
      {groups.map((step, i) => {
        if (!Array.isArray(step)) {
          return <ToCStep key={i} {...step} width={width} onClick={onClick} />
        } else if (step.length > aboveTheFoldSteps) {
          return (
            <ToCStepGroup
              key={i}
              steps={step}
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
  )
}

export default ToC
