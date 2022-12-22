import React from 'react'
import ToCStep from './ToCStep'
import '../styles/components/ToC.scss'

const ToC = ({ steps = [], width = 200, onClick, className = '' }) => {
  return (
    <div className={`ToC ${className}`} style={{ overflow: 'scroll' }}>
      {steps.map((step) => (
        <ToCStep key={step.id} {...step} width={width} onClick={onClick} />
      ))}
    </div>
  )
}

export default ToC
