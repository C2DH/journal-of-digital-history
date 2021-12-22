import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault, NumberParam, StringParam } from 'use-query-params'
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
import ArticleToCBookmark from './ArticleToCBookmark'

const ArticleToC = ({
  memoid='',
  layers=[],
  paragraphs=[],
  headingsPositions=[],
  binderUrl=null,
  width=100
}) => {
  const { t } = useTranslation()
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
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerCellTopQueryParam]: 100
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
      <p className="text-dark py-2 mb-0 me-5" style={{ fontSize: '10px'}} dangerouslySetInnerHTML={{
        __html: binderUrl ? t('actions.gotoBinder', { binderUrl }) : t('errors.binderUrlNotAvailable')
      }}/>
    </div>
    <div className="flex-grow-1 ps-2 pt-2 pb-2 mb-3" style={{ overflow: "scroll"}}>
      {steps.map((step, i) => {
        const showBookmark = i < steps.length - 1
          ? selectedCellIdx >= step.cell.idx && selectedCellIdx < steps[i+1].cell.idx
          : false
        return (
          <div className="position-relative" key={i}>
          {showBookmark ? (
            <ArticleToCBookmark
              onClick={onBookmarkClickHandler}
              style={{
                top: selectedCellIdx > step.cell.idx
                  ? '100%'
                : (selectedCellIdx < step.cell.idx ? 0 : '50%')
              }}
            />
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
