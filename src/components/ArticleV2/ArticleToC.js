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
  DisplayLayerSectionParam,
  DisplayLayerSectionBibliography,
} from '../../constants'
import ArticleToCStep from './ArticleToCStep'
import ArticleToCBookmark from './ArticleToCBookmark'

const ArticleToC = ({
  memoid = '',
  layers = [],
  paragraphs = [],
  headingsPositions = [],
  binderUrl = null,
  ignoreBinder = false,
  width = 100,
  height = 100,
  hideFigures = false,
  hasBibliography = false,
}) => {
  const { t } = useTranslation()
  const visibleCellsIdx = useArticleToCStore((state) => state.visibleCellsIdx)
  const setVisibleCellsIdx = useArticleToCStore((state) => state.setVisibleCellsIdx)
  const [
    { [DisplayLayerQueryParam]: selectedLayer, [DisplayLayerCellIdxQueryParam]: selectedCellIdx },
    setQuery,
  ] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    [DisplayLayerCellTopQueryParam]: withDefault(NumberParam, 100),
    [DisplayLayerSectionParam]: StringParam,
  })

  let count = 0
  const cellIndex = React.useMemo(
    () =>
      paragraphs.reduce((acc, cell) => {
        acc[cell.idx] = cell
        return acc
      }, {}),
    [memoid],
  )

  const steps = React.useMemo(
    () =>
      headingsPositions.reduce((acc, idx, i) => {
        const cell = cellIndex[idx]
        if (!cell) {
          // is possible that there are headingPositions outside of the
          // articleTree.paragraphs list (e.g in the metadata section).
          // In this case, we just skip.
          return acc
        }
        if (cell.hidden) {
          // is possible that there are headingPositions within hidden cells.
          // In this case, we just skip.
          return acc
        }
        if (cell.figure && hideFigures) {
          return acc
        }
        const nextCell =
          i < headingsPositions.length - 1 ? cellIndex[headingsPositions[i + 1]] : null
        let isSectionStart = false
        let isSectionEnd = false
        if (cell.isHeading && cell.heading.level === 2) {
          isSectionStart = true
        }
        if (count === 0) {
          isSectionEnd = true
          isSectionStart = true
        }
        if (nextCell && nextCell.isHeading && nextCell.heading.level === 2) {
          isSectionEnd = true
        }
        if (!nextCell) {
          isSectionEnd = true
        }

        count++
        // is last only if next heading is higher than this one, or it is a hermeneutic
        const isHermeneutics = cell.layer === LayerHermeneutics
        return acc.concat([
          {
            isSectionStart,
            isSectionEnd,
            isHermeneutics,
            cell,
            count,
          },
        ])
      }, []),
    [memoid, hideFigures],
  )

  const firstVisibleCellIdx = visibleCellsIdx.length ? visibleCellsIdx[0] : -1
  const lastVisibleCellIdx = visibleCellsIdx.length
    ? visibleCellsIdx[visibleCellsIdx.length - 1]
    : -1

  const { previousHeadingIdx } = React.useMemo(() => {
    let previousHeadingIdx = -1
    let nextHeadingIdx = -1
    for (let i = 0; i < headingsPositions.length; i++) {
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
      nextHeadingIdx,
    }
  }, [firstVisibleCellIdx, lastVisibleCellIdx])

  const onStepClickHandler = (step) => {
    console.debug('[ArticleToC] @onClickHandler step:', step, selectedLayer)
    // go to the cell
    setQuery({
      [DisplayLayerCellIdxQueryParam]: step.cell.idx,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerSectionParam]: undefined,
    })
  }

  const onBookmarkClickHandler = () => {
    setQuery({
      [DisplayLayerCellIdxQueryParam]: selectedCellIdx,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerCellTopQueryParam]: 100,
      [DisplayLayerSectionParam]: undefined,
    })
  }

  // this listens to click on Bibliography or other extra section (author bio?)
  const onSectionClickHandler = (e, section) => {
    setQuery({
      [DisplayLayerCellIdxQueryParam]: undefined,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerSectionParam]: section,
    })
  }

  React.useEffect(() => {
    console.debug('[ArticleToC] @useEffect', visibleCellsIdx)
    let timer = null

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      console.debug('[ArticleToC] @useEffect @timeout!')
      let visibilityChanged = false
      const updatedVisibleCellsIdx = []
      for (let i = 0, l = visibleCellsIdx.length; i < l; i++) {
        const el = document.getElementById(selectedLayer + visibleCellsIdx[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top < 0 || rect.top > height) {
            console.debug(
              '[ArticleToC]',
              visibleCellsIdx[i],
              'is not visible anymore',
              rect.top,
              height,
            )
            visibilityChanged = true
          } else {
            updatedVisibleCellsIdx.push(visibleCellsIdx[i])
          }
        }
      }
      if (visibilityChanged) {
        console.debug(
          '[ArticleToC] visibilityChanged from',
          visibleCellsIdx,
          'to',
          updatedVisibleCellsIdx,
        )
        setVisibleCellsIdx(updatedVisibleCellsIdx)
      }
    }, 100)
    // delay and double check if cell idx are still visible.
    return function cleanup() {
      clearTimeout(timer)
    }
  }, [visibleCellsIdx, selectedLayer])
  return (
    <>
      <div className="flex-shrink-1 py-3 mb-0 pointer-events-auto text-end">
        {layers.length > 1 &&
          layers.map((d, i) => (
            <div
              className={`me-5 ArticleToC_layerSelector ${selectedLayer === d ? 'active' : ''}`}
              key={i}
              onClick={() => setQuery({ [DisplayLayerQueryParam]: d })}
            >
              {d}
            </div>
          ))}
        {!ignoreBinder && (
          <p
            className="text-dark py-2 mb-0 me-5"
            style={{ fontSize: '10px' }}
            dangerouslySetInnerHTML={{
              __html: binderUrl
                ? t('actions.gotoBinder', { binderUrl })
                : t('errors.binderUrlNotAvailable'),
            }}
          />
        )}
      </div>
      <div
        className="flex-grow-1 ps-2 pt-2 pb-2 mb-2 border-bottom border-top border-dark"
        style={{ overflow: 'scroll' }}
      >
        {steps.map((step, i) => {
          const showBookmark =
            i < steps.length - 1
              ? selectedCellIdx >= step.cell.idx && selectedCellIdx < steps[i + 1].cell.idx
              : false
          return (
            <div className="position-relative" key={i}>
              {showBookmark ? (
                <ArticleToCBookmark
                  onClick={onBookmarkClickHandler}
                  style={{
                    top:
                      selectedCellIdx > step.cell.idx
                        ? '100%'
                        : selectedCellIdx < step.cell.idx
                        ? 0
                        : '50%',
                  }}
                />
              ) : null}
              <ArticleToCStep
                width={width * 0.16}
                cell={step.cell}
                isSectionStart={step.isSectionStart}
                isSectionEnd={step.isSectionEnd}
                isHermeneutics={step.isHermeneutics}
                onStepClick={onStepClickHandler}
                selected={step.cell.idx === selectedCellIdx}
                active={step.cell.idx >= previousHeadingIdx && step.cell.idx <= lastVisibleCellIdx}
                className={step.isHermeneutics ? 'hermeneutics' : ''}
              >
                {step.cell.isHeading
                  ? step.cell.heading.content
                  : step.cell.isFigure
                  ? t(step.cell.figure.tNLabel, { n: step.cell.figure.tNum })
                  : '(na)'}
              </ArticleToCStep>
            </div>
          )
        })}
      </div>
      {hasBibliography && (
        <div className="flex-shrink-1 ps-2 mb-3">
          <ArticleToCStep
            cell={{
              level: 'H2',
            }}
            width={width * 0.16}
            isSectionStart
            isSectionEnd
            selected
            active={false}
            className=""
            onStepClick={(e) => onSectionClickHandler(e, DisplayLayerSectionBibliography)}
          >
            {t('bibliography')}
          </ArticleToCStep>
        </div>
      )}
    </>
  )
}
export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
