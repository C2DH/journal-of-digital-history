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
  className=''
}) => {
  const history = useHistory()
  const setVisibleShadowCell = useArticleStore(state=>state.setVisibleShadowCell)
  const displayLayer = useArticleStore(state=>state.displayLayer)

  const levelClassName = `ArticleToCStep_Level_${level}`
  const color = active ? 'var(--dark)': 'var(--gray-500)'
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
    <div className={`ArticleToCStep ${active?'active':''} ${className} ${levelClassName}`} onClick={handleClick}>
      <label>
      {children}
      </label>
      {isHermeneutics && <Layers className="ArticleToCStep_Hermeneutics" size={12} color={color}/>}
      {!isHermeneutics && !isTable && !isFigure && <div className="ArticleToCStep_Circle" />}
      {isFigure && !isTable && <Image size={12} color={color}/>}
      {isTable && <Grid size={12} color={color}/>}
    </div>
  )
}

export default ArticleToCStep
