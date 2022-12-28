import React from 'react'
import { Layers, Image, Grid } from 'react-feather'
import { useArticleStore } from '../store'
import '../styles/components/ToCStep.scss'

const ToCStep = ({
  id = -1,
  active = false,
  isFigure = false,
  isTable = false,
  isHermeneutics = false,
  isSectionStart = false,
  isSectionEnd = false,
  level = 'CODE',
  label = '',
  width = 100,
  marginEnd = 50,
  className = '',
  onClick,
  iconSize = 13,
}) => {
  const displayLayer = useArticleStore((state) => state.displayLayer)

  const availableWidth = width - marginEnd
  const levelClassName = `ToCStep_Level_${level}`
  const labelClassName = isHermeneutics
    ? 'ToCStep_labelHermeneutics'
    : !isHermeneutics && !isTable && !isFigure
    ? 'ToCStep_labelCircle'
    : isFigure && !isTable
    ? 'ToCStep_labelFigure'
    : 'ToCStep_labelTable'

  const handleClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e, { id, label })
    }
  }
  return (
    <div
      className={`ToCStep ${active ? 'active' : ''} ${className} ${levelClassName} ${
        isSectionEnd ? 'end' : ''
      } ${isSectionStart ? 'start' : ''} ${displayLayer} ${isHermeneutics ? 'hermeneutics' : ''}`}
      onClick={handleClick}
      style={{
        width: availableWidth,
      }}
    >
      <label className={labelClassName} title={label}>
        {label}
      </label>
      <div className="ToCStep_icon">
        {isHermeneutics && !isTable && !isFigure && <Layers size={iconSize} />}
        {!isHermeneutics && !isTable && !isFigure && <div className="ToCStep_icon_circle" />}
        {isFigure && !isTable && <Image size={iconSize} />}
        {isTable && <Grid size={iconSize} />}
      </div>
    </div>
  )
}

export default ToCStep
