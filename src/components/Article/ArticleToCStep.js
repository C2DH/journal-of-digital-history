import React from 'react'
import { useHistory } from 'react-router-dom'
import { Layers, Image, Grid } from 'react-feather'
import { useArticleStore } from '../../store'


const ArticleToCStep = ({
  idx, active=false,
  level='',
  isFigure=false,
  isTable=false,
  isHermeneutics=false,
  isAccordionOpen=false,
  children,
  width=0,
  marginLeft=70,
  className=''
}) => {
  const history = useHistory()
  const setVisibleShadowCell = useArticleStore(state=>state.setVisibleShadowCell)
  const displayLayer = useArticleStore(state=>state.displayLayer)

  const availableWidth = width - marginLeft
  const levelClassName = `ArticleToCStep_Level_${level}`
  const labelClassName = isHermeneutics
    ? 'ArticleToCStep_labelHermeneutics'
    : !isHermeneutics && !isTable && !isFigure
      ? 'ArticleToCStep_labelCircle'
      : isFigure && !isTable
        ? 'ArticleToCStep_labelFigure'
        : 'ArticleToCStep_labelTable'



  const handleClick = () => {
    // if the layer is hidden, opens it up and scroll to it on click.
    if (idx) {
      history.push(`#${displayLayer}${idx}`)
    }
    if (isHermeneutics) {
      setVisibleShadowCell(idx, !isAccordionOpen)
    }
  }
  return (
    <div className={`ArticleToCStep ${active?'active':''} ${className} ${levelClassName} ${displayLayer}`} onClick={handleClick} style={{
      width: availableWidth
    }}>
      <label className={labelClassName}>
      {children}
      </label>
      <div className="ArticleToCStep_icon">
        {isHermeneutics && !isTable && !isFigure && <Layers size={12} />}
        {!isHermeneutics && !isTable && !isFigure && <div className="ArticleToCStep_icon_circle" />}
        {isFigure && !isTable && <Image size={12} />}
        {isTable && <Grid  size={12} />}
      </div>
    </div>
  )
}

export default ArticleToCStep
