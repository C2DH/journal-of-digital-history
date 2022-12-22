import React from 'react'
import { Layers, Image, Grid } from 'react-feather'
import { useArticleStore } from '../store'
import '../styles/components/ToCStep.scss'

const ToCStep = ({
  step,
  active = false,
  isSectionStart = false,
  isSectionEnd = false,
  children,
  width = 100,
  marginLeft = 0,
  className = '',
  onClick,
  iconSize = 13,
}) => {
  const displayLayer = useArticleStore((state) => state.displayLayer)

  const availableWidth = width - marginLeft
  const levelClassName = `ToCStep_Level_${step.level}`
  const labelClassName = step.isHermeneutics
    ? 'ToCStep_labelHermeneutics'
    : !step.isHermeneutics && !step.isTable && !step.isFigure
    ? 'ToCStep_labelCircle'
    : step.isFigure && !step.isTable
    ? 'ToCStep_labelFigure'
    : 'ToCStep_labelTable'

  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick({ step })
    }
  }
  return (
    <div
      className={`ToCStep ${active ? 'active' : ''} ${className} ${levelClassName} ${
        isSectionEnd ? 'end' : ''
      } ${isSectionStart ? 'start' : ''} ${displayLayer}`}
      onClick={handleClick}
      style={{
        width: availableWidth,
      }}
    >
      <label className={labelClassName} title={children}>
        {children}
      </label>
      <div className="ToCStep_icon">
        {step.isHermeneutics && !step.isTable && !step.isFigure && <Layers size={iconSize} />}
        {!step.isHermeneutics && !step.isTable && !step.isFigure && (
          <div className="ToCStep_icon_circle" />
        )}
        {step.isFigure && !step.isTable && <Image size={iconSize} />}
        {step.isTable && <Grid size={iconSize} />}
      </div>
    </div>
  )
}

export default ToCStep
