import React, { useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'
import ArticleCellWrapper from './ArticleCellWrapper'
import ArticleScrollamaSticky from './ArticleScrollamaSticky'


const ArticleScrollama = ({memoid='', initialNumCell=0, cells=[], onStepChange, onCellClick }) => {
  const [currentStep, setCurrentStep] = useState({idx: -1, direction: 'down'})
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
  // we take the first figure as sticky cell.
  const stickyCellIdx = cells.findIndex(d => d.isFigure)
  return (
    <section className="ArticleScrollama position-relative">
      {stickyCellIdx > -1 ? (
        <ArticleScrollamaSticky memoid={memoid} currentStep={currentStep} cell={cells[stickyCellIdx]} />
      ):null}

      <Scrollama
        onStepEnter={onStepEnter}
        onStepExit={onStepExit}
        offset={.5}
        threshold={0}
      >
        {cells.filter((d,i)=> i!== stickyCellIdx).map((cell, i) => {
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
                isNarrativeStep
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
