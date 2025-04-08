import React, { useRef } from 'react'
import { Layers } from 'react-feather'
import { useArticleStore } from '../store'
import '../styles/components/ToCStep.scss'
import {
  DialogRefPrefix,
  FigureRefPrefix,
  TableRefPrefix,
  DataTableRefPrefix,
  VideoRefPrefix,
  SoundRefPrefix,
  LayerNarrative,
} from '../constants/globalConstants'
import { MediaImage, MediaVideo, MessageText, SoundMin, Table } from 'iconoir-react'

const FigureRefPrefixMapping = {
  [FigureRefPrefix]: MediaImage,
  [DialogRefPrefix]: MessageText,
  [TableRefPrefix]: Table,
  [DataTableRefPrefix]: Table,
  [SoundRefPrefix]: SoundMin,
  [VideoRefPrefix]: MediaVideo,
}

const ToCStep = ({
  id = -1,
  active = false,
  isFigure = false,
  isTable = false,
  layer = LayerNarrative,
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
  const ref = useRef(null)
  const displayLayer = useArticleStore((state) => state.displayLayer)

  const availableWidth = width - marginEnd
  const levelClassName = `ToCStep_Level_${level}`
  let labelClassName = ''
  if (isHermeneutics) {
    labelClassName = 'ToCStep_labelHermeneutics'
  } else if (!isHermeneutics && !isTable && !isFigure) {
    labelClassName = 'ToCStep_labelCircle'
  } else if (isFigure && !isTable) {
    labelClassName = 'ToCStep_labelFigure'
  } else {
    labelClassName = 'ToCStep_labelTable'
  }

  const handleClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e, { id, label, layer })
    }
  }

  const Icon = isFigure ? FigureRefPrefixMapping[figureRefPrefix] || MediaImage : null
  // console.debug('[ToCStep] @render')
  return (
    <div
      ref={ref}
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
      <div className={`ToCStep_icon ${figureRefPrefix}`}>
        {isHermeneutics && !isFigure && <Layers size={iconSize} />}
        {!isHermeneutics && !isFigure && <div className="ToCStep_icon_circle" />}
        {isFigure && <Icon size={iconSize} height={iconSize} width={iconSize} />}
      </div>
    </div>
  )
}

export default ToCStep
