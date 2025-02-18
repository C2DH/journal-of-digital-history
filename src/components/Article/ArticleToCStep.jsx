import React from 'react'
import { useHistory } from 'react-router-dom'
import { Layers, Grid } from 'react-feather'
import { useArticleStore } from '../../store'
import { MediaImage } from 'iconoir-react'

const ArticleToCStep = ({
  idx,
  active = false,
  level = '',
  isFigure = false,
  isTable = false,
  isHermeneutics = false,
  isAccordionOpen = false,
  isSectionStart = false,
  isSectionEnd = false,
  children,
  width = 0,
  marginLeft = 70,
  className = '',
}) => {
  const history = useHistory()
  const setVisibleShadowCell = useArticleStore((state) => state.setVisibleShadowCell)
  const displayLayer = useArticleStore((state) => state.displayLayer)

  const availableWidth = width - marginLeft
  const levelClassName = `ArticleToCStep_Level_${level}`
  let labelClassName = ''
  if (isHermeneutics) {
    labelClassName = 'ArticleToCStep_labelHermeneutics'
  } else if (!isHermeneutics && !isTable && !isFigure) {
    labelClassName = 'ArticleToCStep_labelCircle'
  } else if (isFigure && !isTable) {
    labelClassName = 'ArticleToCStep_labelFigure'
  } else {
    labelClassName = 'ArticleToCStep_labelTable'
  }

  const handleClick = () => {
    // if the layer is hidden, opens it up and scroll to it on click.
    if (isNaN(idx)) {
      history.push(`#${idx}`)
    } else {
      history.push(`#${displayLayer}${idx}`)
    }
    if (isHermeneutics) {
      setVisibleShadowCell(idx, !isAccordionOpen)
    }
  }
  return (
    <div
      className={`ArticleToCStep ${active ? 'active' : ''} ${className} ${levelClassName} ${
        isSectionEnd ? 'end' : ''
      } ${isSectionStart ? 'start' : ''} ${displayLayer}`}
      onClick={handleClick}
      style={{
        width: availableWidth,
      }}
    >
      <label className={labelClassName}>{children}</label>
      <div className="ArticleToCStep_icon">
        {isHermeneutics && !isTable && !isFigure && <Layers size={13} />}
        {!isHermeneutics && !isTable && !isFigure && <div className="ArticleToCStep_icon_circle" />}
        {isFigure && !isTable && <MediaImage size={13} />}
        {isTable && <Grid size={13} />}
      </div>
    </div>
  )
}

export default ArticleToCStep
