import React from 'react'
import { useHistory } from 'react-router-dom'
import { Layers, Image, Grid } from 'react-feather'


const ArticleToCStep = ({
  idx, active=false,
  level='',
  isFigure=false,
  isTable=false,
  isHermeneutics=false,
  children,
  className=''
}) => {
  const history = useHistory()
  const levelClassName = `ArticleToCStep_Level_${level}`
  const color = active ? 'var(--dark)': 'var(--gray-500)'
  const handleClick = () => {
    // if the layer is hidden, opens it up and scroll to it on click.
    if (!isNaN(idx)) {
      history.push(`#C-${idx}`)
    } else {
      history.push(`#${idx}`)
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
