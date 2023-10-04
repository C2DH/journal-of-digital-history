import React from 'react'
import { Layers } from 'react-feather'
import { useArticleStore } from '../store'
import '../styles/components/ToCStep.scss'
import {
  DialogRefPrefix,
  FigureRefPrefix,
  TableRefPrefix,
  VideoRefPrefix,
  SoundRefPrefix,
} from '../constants'
import { MediaImage, MediaVideo, MessageText, SoundMin, Table } from 'iconoir-react'

const FigureRefPrefixMapping = {
  [FigureRefPrefix]: MediaImage,
  [DialogRefPrefix]: MessageText,
  [TableRefPrefix]: Table,
  [SoundRefPrefix]: SoundMin,
  [VideoRefPrefix]: MediaVideo,
}

const ToCStep = ({
  id = -1,
  active = false,
  isFigure = false,
  isTable = false,
  isHermeneutics = false,
  isSectionStart = false,
  isSectionEnd = false,
  figureRefPrefix = null,
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

  const Icon = isFigure ? FigureRefPrefixMapping[figureRefPrefix] || Image : null

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
        {isHermeneutics && !isFigure && <Layers size={iconSize} />}
        {!isHermeneutics && !isFigure && <div className="ToCStep_icon_circle" />}
        {isFigure && <Icon size={iconSize} height={iconSize} width={iconSize} />}
      </div>
    </div>
  )
}

export default ToCStep
