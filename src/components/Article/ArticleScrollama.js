import React, { useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import ArticleCellWrapper from './ArticleCellWrapper'

const ArticleScrollama = ({ initialNumCell=0, cells=[], onStepChange, onCellClick }) => {
  const [, setCurrentStep] = useState({idx: -1, direction: 'down'})
  const onStepEnter = ({ data:idx, direction }) => {
    setCurrentStep({ idx, direction })
    if (typeof onStepChange === 'function') {
      onStepChange({ idx, direction })
    }
  }

  const onStepExit = ({ data:idx, direction }) => {
    if(idx === 0 && direction === 'up') {
      setCurrentStep({ idx: -1, direction })
      if (typeof onStepChange === 'function') {
        onStepChange({ idx: -1, direction })
      }
    }
  }
  let numCell = +initialNumCell
  return (
    <section className="ArticleScrollama position-relative">
    <div style={{
      position: 'sticky',
      top: 100,
    }}>I'm fixed.</div>

    <Scrollama
      onStepEnter={onStepEnter}
      onStepExit={onStepExit}
      offset={.5}
      threshold={0}
    >
      {cells.filter(cell => !cell.isFigure).map((cell, i) => {
        numCell += 1
        return (
          <Step data={i} key={i}>
            <div style={{ minHeight: window.innerHeight / 2 }}>
            <a className='ArticleStream_anchor anchor' id={`C-${cell.idx}`}></a>
            <ArticleCellWrapper
              id={`C-${cell.idx}`}
              onClick={(e) => onCellClick(e, cell.idx)}
              numCell={numCell}
              cell={cell}
            />
            </div>
          </Step>
        )
      })}
    </Scrollama>
    </section>
  )
}

export default ArticleScrollama
