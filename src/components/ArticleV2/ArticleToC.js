import React from 'react'
import { useQueryParams, withDefault, NumberParam, StringParam } from 'use-query-params'
import { Bookmark } from 'react-feather'
import { Button } from 'react-bootstrap'
import { useArticleToCStore } from '../../store'
import {
  LayerHermeneutics,
  LayerNarrative,
  DisplayLayerQueryParam,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerCellTopQueryParam,
  DisplayPreviousLayerQueryParam,
} from '../../constants'
import ArticleToCStep from './ArticleToCStep'


const ArticleToC = ({
  memoid='',
  layers=[],
  paragraphs=[],
  headingsPositions=[],
  width=100
}) => {
  const visibleCellsIdx = useArticleToCStore(state=>state.visibleCellsIdx)

  const [{
    [DisplayLayerQueryParam]:selectedLayer,
    [DisplayLayerCellIdxQueryParam]:selectedCellIdx,
  }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    [DisplayLayerCellTopQueryParam]: withDefault(NumberParam, 0),
  })

  let count = 0
  const cellIndex = React.useMemo(() => paragraphs.reduce((acc, cell) => {
    acc[cell.idx] = cell
    return acc
  }, {}), [memoid])

  const steps = React.useMemo(() => headingsPositions.reduce((acc, idx, i) => {
    const cell = cellIndex[idx]
    if(!cell) {
      // is possible that there are headingPositions outside of the
      // articleTree.paragraphs list (e.g in the metadata section).
      // In this case, we just skip.
      return acc
    }
    const nextCell = i < headingsPositions.length - 1
      ? cellIndex[headingsPositions[i + 1]]
      : null
    let isSectionStart = false
    let isSectionEnd = false
    if(cell.isHeading && cell.heading.level === 2) {
      isSectionStart = true
    }
    if (count === 0) {
      isSectionEnd = true
      isSectionStart = true
    }
    if (nextCell && nextCell.isHeading && nextCell.heading.level === 2 ) {
      isSectionEnd = true
    }
    if (!nextCell) {
      isSectionEnd = true
    }

    count++
    // is last only if next heading is higher than this one, or it is a hermeneutic
    const isHermeneutics = cell.layer === LayerHermeneutics
    return acc.concat([{
      isSectionStart,
      isSectionEnd,
      isHermeneutics,
      cell,
      count
    }])
  }, []), [memoid])

  const firstVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[0] : -1
  const lastVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[visibleCellsIdx.length -1] : -1

  const { previousHeadingIdx } = React.useMemo(()=> {
    let previousHeadingIdx = -1
    let nextHeadingIdx = -1
    for(let i = 0; i < headingsPositions.length; i++) {
      if (headingsPositions[i] <= firstVisibleCellIdx) {
        previousHeadingIdx = headingsPositions[i]
      }
      if (nextHeadingIdx === -1 && headingsPositions[i] >= lastVisibleCellIdx) {
        nextHeadingIdx = headingsPositions[i]
        // nextVisibleLoopIndex = i
      }
    }
    return {
      previousHeadingIdx,
      nextHeadingIdx
    }
  }, [ firstVisibleCellIdx, lastVisibleCellIdx ])

  const onStepClickHandler = (step) => {
    console.debug('[ArticleToC] @onClickHandler step:', step, selectedLayer)
    // go to the cell
    setQuery({
      [DisplayLayerCellIdxQueryParam]: step.cell.idx,
      [DisplayPreviousLayerQueryParam]: undefined
    })
  }

  const onBookmarkClickHandler = () => {
    setQuery({
      [DisplayLayerCellIdxQueryParam]: selectedCellIdx,
      [DisplayPreviousLayerQueryParam]: undefined
    })
  }
  return (
    <>
    <div className="flex-shrink-1 py-3 mb-0 pointer-events-auto text-end">
      {layers.map((d,i) => (
        <div className="me-5" key={i} onClick={() =>setQuery({
          [DisplayLayerQueryParam]: d
        })}>{selectedLayer === d ? <b>{d}</b>: d}</div>
      ))}
    </div>
    <div className="flex-grow-1 border-bottom mb-3 border-dark" style={{ overflow: "scroll"}}>
      {steps.map((step, i) => {
        const showBookmark = i < steps.length - 1
          ? selectedCellIdx >= step.cell.idx && selectedCellIdx < steps[i+1].cell.idx
          : false
        return (
          <div className="position-relative" key={i}>
          {showBookmark ? (
            <Button
              onClick={onBookmarkClickHandler}
              variant="secondary"
              size="sm"
              className="pill p-0 position-absolute pointer-events-auto border-top border-secondary top-0"
              style={{
                width: 25,
                height: 25,
                right: 10,
                lineHeight: '25px'
              }}
            ><Bookmark size={14}/>
            </Button>
          ): null}
          <ArticleToCStep
            width={width * .16}
            cell={step.cell}
            isSectionStart={step.isSectionStart}
            isSectionEnd={step.isSectionEnd}
            isHermeneutics={step.isHermeneutics}
            onStepClick={onStepClickHandler}
            selected={step.cell.idx === selectedCellIdx}
            active={step.cell.idx >= previousHeadingIdx && step.cell.idx <= lastVisibleCellIdx}
            className={step.isHermeneutics ? 'hermeneutics': ''}
          >
            {step.cell.isHeading
              ? step.cell.heading.content
              : step.cell.isFigure
                ? step.cell.figure.ref
                : '(na)'
            }
          </ArticleToCStep>
          </div>
      )})}
    </div>
    </>
  )
}
export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
