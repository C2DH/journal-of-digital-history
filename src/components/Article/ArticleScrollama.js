import React, { useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { RoleHidden, LayerHermeneuticsStep, LayerHermeneutics } from '../../constants'
import ArticleCell from './ArticleCell'
import ArticleCellShadow from './ArticleCellShadow'

const ArticleScrollama = ({
  memoid, height=0, cells=[],
  shadowLayers = [ LayerHermeneuticsStep, LayerHermeneutics ],
  onDataHrefClick, onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState({idx: -1, direction: 'down'})

  const onStepEnter = ({ data:idx, direction }) => {
    setCurrentStep({ idx, direction })
    if(typeof onStepChange === 'function') {
      onStepChange({ idx, direction })
    }
  }

  const onStepExit = ({ data:idx, direction }) => {
    if(idx === 0 && direction === 'up') {
      setCurrentStep({ idx: -1, direction })
      onStepChange({ idx: -1, direction })
    }
  }

  const handleCellClick = (e, idx) => {
    // only when the child target attribute is 'data-href'
    const dataHref = e.target.getAttribute('data-href')
    onDataHrefClick({ dataHref, idx })
  }
  let numCell = 0
  return (
    <Scrollama
      className="ArticleScrollama"
      onStepEnter={onStepEnter}
      onStepExit={onStepExit}
      offset={.5}
      threshold={0}
    >
    {cells.map((cell, i) => {
      const isActive = currentStep.idx === i
      if (cell.role === RoleHidden || cell.hidden) {
        return (
          <Step data={i} key={i}>
            <div style={{height: 1, overflow: 'hidden'}}>&nbsp;</div>
          </Step>
        )
      }
      if (shadowLayers.indexOf(cell.layer) !== -1) {
        return (
          <Step data={i} key={i}>
            <div
              className={`ArticleText_ArticleParagraph ${isActive ? 'active' : ''} ${cell.layer}`}
            >
              <ArticleCellShadow
                {...cell}
                idx={cell.idx}
              />
            </div>
          </Step>
        )
      }
      if (!cell.isFigure) {
        numCell += 1
      }
      return (
        <Step data={i} key={i}>
          <div
            className={`ArticleText_ArticleParagraph ${isActive ? 'active' : ''}`}
            id={`C-${cell.idx}`}
            onClick={(e) => handleCellClick(e, cell.idx)}>&nbsp;

            <ArticleCell
              mmoid={memoid}
              {...cell}
              num={numCell}
              idx={cell.idx}
              active={isActive}
            />
          </div>
        </Step>
      )
    })}
    </Scrollama>
  )
}

export default React.memo(ArticleScrollama, (prevProps, nextProps) => {
  if (prevProps.memoid === nextProps.memoid) {
    return true // props are equal
  }
  return false // props are not equal -> update the component
})
