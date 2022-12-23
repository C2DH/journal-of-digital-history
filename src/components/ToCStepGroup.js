import React, { useEffect } from 'react'
import { a, useSpring } from '@react-spring/web'
import ToCStep from './ToCStep'
import { ChevronDown } from 'react-feather'
import '../styles/components/ToCStepGroup.scss'

const ToCStepGroup = ({
  steps = [],
  aboveTheFoldSteps = 3,
  width = 200,
  marginEnd = 50,
  stepHeight = 20,
  active = false,
  onClick,
}) => {
  const minHeight = aboveTheFoldSteps * stepHeight
  const maxHeight = steps.length * stepHeight
  const [{ height }, api] = useSpring(() => ({
    height: minHeight,
  }))

  useEffect(() => {
    if (active) {
      api.start({ height: maxHeight })
    }
  }, [active])

  return (
    <div className="ToCStepGroup">
      <a.div className="ToCStepGroup_collapsible" style={{ width, minHeight, height }}>
        {steps.map((step) => (
          <ToCStep key={step.id} {...step} width={width} marginEnd={marginEnd} onClick={onClick} />
        ))}
      </a.div>
      <div className="ToCStepGroup_toggleButtonWrapper" style={{ width }}>
        <button
          className="ToCStepGroup_toggleButton"
          style={{ right: marginEnd / 2 - 8 }}
          onClick={() => {
            if (height.get() === minHeight) {
              api.start({ height: maxHeight })
            } else {
              api.start({ height: minHeight })
            }
          }}
        >
          <ChevronDown size={10} />
        </button>
      </div>
    </div>
  )
}

export default ToCStepGroup
