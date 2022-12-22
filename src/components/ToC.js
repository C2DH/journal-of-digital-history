import React from 'react'
import ToCStep from './ToCStep'
import '../styles/components/ToC.scss'

const ToC = ({ steps = [], width = 200, onClick, className = '' }) => {
  console.debug(
    '[ToC] rendered',
    steps.map((d) => d.active),
  )
  // get tree of headings and figures last stuff
  const groups = steps.reduce(
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
  console.debug('[ToC] rendered with groups:', groups)

  return (
    <div className={`ToC ${className}`} style={{ overflow: 'scroll' }}>
      {steps.map((step) => (
        <ToCStep key={step.id} {...step} width={width} onClick={onClick} />
      ))}
    </div>
  )
}

export default ToC
