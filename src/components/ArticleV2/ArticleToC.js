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
import ToCStep from '../ToCStep'
// import ArticleToCBookmark from './ArticleToCBookmark'
import ToC from '../ToC'
import { useBoundingClientRect } from '../../hooks/graphics'
import ArticleLayerSwitch from './ArticleLayerSwitch'
import ArticleDataModal from '../Article/ArticleDataModal'
import ArticleToCTitle from './ArticleToCTitle'

const ArticleToC = ({
  memoid = '',
  layers = [],
  paragraphs = [],
  headingsPositions = [],
  binderUrl = null,
  repositoryUrl = null,
  width = 100,
  height = 100,
  hideFigures = false,
  hasBibliography = false,
  plainTitle = null,
  showData = false,
}) => {
  const { t } = useTranslation()
  const [{ height: toCHeight }, toCref] = useBoundingClientRect()
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
        return acc.concat([
          {
            id: cell.idx,
            label: cell.isHeading
              ? cell.heading.content
              : cell.isFigure
              ? t(cell.figure.tNLabel, { n: cell.figure.tNum })
              : '(na)',
            figureRefPrefix: cell.isFigure ? cell.figure.refPrefix : null,
            isFigure: cell.isFigure,
            isTable: cell.isTable,
            isHermeneutics: cell.layer === LayerHermeneutics,
            level: cell.level,
            isSectionStart,
            isSectionEnd,
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

  const onStepClickHandler = (e, { id, label }) => {
    console.debug('[ArticleToC] @onClickHandler step:', id, label, selectedLayer)
    // go to the cell
    setQuery({
      [DisplayLayerCellIdxQueryParam]: id,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerSectionParam]: undefined,
    })
  }

  // const onBookmarkClickHandler = () => {
  //   setQuery({
  //     [DisplayLayerCellIdxQueryParam]: selectedCellIdx,
  //     [DisplayPreviousLayerQueryParam]: undefined,
  //     [DisplayLayerCellTopQueryParam]: 100,
  //     [DisplayLayerSectionParam]: undefined,
  //   })
  // }

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

  console.debug(
    '[ArticleToC]',
    '\n - visibleCellsIdx',
    visibleCellsIdx,
    firstVisibleCellIdx,
    lastVisibleCellIdx,
    '\n - selectedCellIdx:',
    selectedCellIdx,
    steps,
  )
  return (
    <>
      {/* ArticleToCTitle would open / collapse and push the fixed height Toc to the bottom */}
      <ArticleToCTitle plainTitle={plainTitle}>
        {showData ? (
          <div className="me-3 text-end">
            <ArticleDataModal binderUrl={binderUrl} repositoryUrl={repositoryUrl} />
          </div>
        ) : null}
      </ArticleToCTitle>
      <div style={{ height: 500 }} className="d-flex flex-column position-relative">
        <div className="flex-shrink-1 pb-3 pointer-events-auto text-end">
          <div className="me-3">
            <ArticleLayerSwitch layers={layers} />
          </div>
        </div>
        <div
          ref={toCref}
          className="flex-grow-1 pointer-events-auto border-bottom border-top border-dark"
        >
          <ToC
            className="position-absolute w-100"
            visibleHeight={toCHeight - 2}
            selectedId={selectedCellIdx}
            steps={steps.map((step) => {
              if (step.id === selectedCellIdx) {
                step.isSelected = true
              }
              step.active = step.id >= previousHeadingIdx && step.id <= lastVisibleCellIdx
              return step
            })}
            width={width * 0.16}
            onClick={onStepClickHandler}
          />
        </div>
        {hasBibliography && (
          <div className="flex-shrink-1 ps-2 mb-3">
            <ToCStep
              level="H2"
              label={t('bibliography')}
              width={width * 0.16}
              isSectionStart
              isSectionEnd
              selected
              active={false}
              className=""
              onClick={(e) => onSectionClickHandler(e, DisplayLayerSectionBibliography)}
            ></ToCStep>
          </div>
        )}
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
