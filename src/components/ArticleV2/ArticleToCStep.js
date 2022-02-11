import React from 'react'
import { Layers, Image, Grid } from 'react-feather'
import { useArticleStore } from '../../store'


const ArticleToCStep = ({
  cell, active=false,
  isSectionStart=false,
  isSectionEnd=false,
  children,
  width=0,
  marginLeft=70,
  className='',
  onStepClick,
}) => {
  const displayLayer = useArticleStore(state=>state.displayLayer)

  const availableWidth = width - marginLeft
  const levelClassName = `ArticleToCStep_Level_${cell.level}`
  const labelClassName = cell.isHermeneutics
    ? 'ArticleToCStep_labelHermeneutics'
    : !cell.isHermeneutics && !cell.isTable && !cell.isFigure
      ? 'ArticleToCStep_labelCircle'
      : cell.isFigure && !cell.isTable
        ? 'ArticleToCStep_labelFigure'
        : 'ArticleToCStep_labelTable'

  const handleClick = () => {
    if (typeof onStepClick === 'function') {
      onStepClick({ cell })
    }
  }
  return (
    <div className={`ArticleToCStep ${active?'active':''} ${className} ${levelClassName} ${isSectionEnd?'end':''} ${isSectionStart?'start':''} ${displayLayer}`} onClick={handleClick} style={{
      width: availableWidth
    }}>
      <label className={labelClassName} title={children}>
      {children}
      </label>
      <div className="ArticleToCStep_icon">
        {cell.isHermeneutics && !cell.isTable && !cell.isFigure && <Layers size={13} />}
        {!cell.isHermeneutics && !cell.isTable && !cell.isFigure && <div className="ArticleToCStep_icon_circle" />}
        {cell.isFigure && !cell.isTable && <Image size={13} />}
        {cell.isTable && <Grid size={13} />}
      </div>
    </div>
  )
}

export default ArticleToCStep
