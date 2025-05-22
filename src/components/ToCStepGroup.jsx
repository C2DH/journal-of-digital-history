import React, { useEffect } from 'react'
import { a, useSpring, config } from '@react-spring/web'
import ToCStep from './ToCStep'
import { ChevronDown } from 'react-feather'
import '../styles/components/ToCStepGroup.scss'

const ToCStepGroup = ({
  steps = [],
  aboveTheFoldSteps = 2,
  width = 200,
  marginEnd = 50,
  stepHeight = 20,
  isSelected = false,
  onClick,
}) => {
  // const isExpanded = useRef(false)
  const minHeight = aboveTheFoldSteps * stepHeight
  const maxHeight = steps.length * stepHeight
  const angleCoeff = 180 / (maxHeight - minHeight)
  const [{ height }, api] = useSpring(() => ({
    height: minHeight,
    config: config.stiff,
  }))

  useEffect(() => {
    if (isSelected) {
      api.start({ height: maxHeight })
    }
  }, [isSelected])
  console.debug('[ToCStepGroup] isSelected:', isSelected)
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
          style={{ right: marginEnd / 2 - 4 }}
          onClick={() => {
            if (height.get() === minHeight) {
              api.start({ height: maxHeight })
            } else {
              api.start({ height: minHeight })
            }
          }}
        >
          <a.span
            style={{
              transform: height.to((d) => {
                const angle = (d - minHeight) * angleCoeff

                return `rotate(${angle}deg)`
              }),
            }}
          >
            <ChevronDown size={10} />
          </a.span>
        </button>
      </div>
    </div>
  )
}

export default ToCStepGroup
