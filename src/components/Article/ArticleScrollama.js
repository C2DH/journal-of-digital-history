import React, { useState, useMemo } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import { RoleHidden, LayerHermeneuticsStep, LayerHermeneutics } from '../../constants'
import ArticleCellAccordion from './ArticleCellAccordion'
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
  let key = -1
  // rebuild cell index based on same Layer
  const isSameChunk = (cell) => shadowLayers.includes(cell.layer)
  const chunks = useMemo(() => {
    const buffers = []
    let prevConcatenate = null
    let buffer = new Array()
    cells.forEach((c,i) => {
      const concatenate = isSameChunk(c)
      if (i > 0 && concatenate !== prevConcatenate) {
        buffers.push([...buffer])
        buffer = new Array()
      }
      buffer.push(i)
      prevConcatenate = !!concatenate
    })
    if (buffer.length) {
      buffers.push(buffer)
    }
    return buffers
  }, [memoid, shadowLayers])
  console.info('SCROLLAMA rendered', chunks)
  return (
    <Scrollama
      className="ArticleScrollama"
      onStepEnter={onStepEnter}
      onStepExit={onStepExit}
      offset={.5}
      threshold={0}
    >
      {chunks.map((chunk, i) => chunk.map((j) => {
        key++
        const cell = cells[j]
        const isActive = currentStep.idx === key
        if (cell.role === RoleHidden || cell.hidden) {
          return (
            <Step data={key} key={key}>
              <div style={{height: 1, overflow: 'hidden'}}>&nbsp;</div>
            </Step>
          )
        }
        if (!cell.isFigure) {
          numCell += 1
        }
        return (
          <Step data={key} key={key}>
            <div
              className={`ArticleText_ArticleParagraph position-relative ${isActive ? 'active' : ''}`}
              id={`C-${cell.idx}`}
              onClick={(e) => handleCellClick(e, cell.idx)}>&nbsp;
              <ArticleCellAccordion
                memoid={memoid}
                cell={cell}
                num={numCell}
                isPreviousCellCollapsible={j > 0}
                isEnabled={shadowLayers.includes(cell.layer)}
                isCollapsed={shadowLayers.includes(cell.layer)}
                isActive={isActive}
              />
            </div>
          </Step>
        )
      }))}
    </Scrollama>
  )
}

export default React.memo(ArticleScrollama, (prevProps, nextProps) => {
  if (prevProps.memoid === nextProps.memoid) {
    return true // props are equal
  }
  return false // props are not equal -> update the component
})
