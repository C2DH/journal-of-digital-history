import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams, withDefault, NumberParam, StringParam } from 'use-query-params'
// import { useArticleToCStore } from '../../store'
import {
  // LayerHermeneutics,
  LayerNarrative,
  DisplayLayerQueryParam,
  DisplayLayerCellIdxQueryParam,
  // DisplayLayerCellTopQueryParam,
  DisplayPreviousLayerQueryParam,
  DisplayLayerSectionParam,
  DisplayLayerSectionBibliography,
  DisplayLayerCellTopQueryParam,
} from '../../constants'
import ToCStep from '../ToCStep'
// import ArticleToCBookmark from './ArticleToCBookmark'
// import ToC from '../ToC'
// import { useBoundingClientRect } from '../../hooks/graphics'
import ArticleLayerSwitch from './ArticleLayerSwitch'
import ArticleDataModal from '../Article/ArticleDataModal'
import ArticleToCTitle from './ArticleToCTitle'
import ArticleToCSteps from './ArticleToCSteps'

const ArticleToC = ({
  memoid = '',
  // available layers for the article, would result in a layer switch between the layer options. Possible value are in constants module.
  layers = [],
  paragraphs = [],
  headingsPositions = [],
  plainTitle = null,
  binderUrl = null,
  repositoryUrl = null,
  showData = false,
  hasBibliography = false,
  // force hiding of figures in the ToC
  hideFigures = false,
  width = 100,
  height = 100,
}) => {
  const { t } = useTranslation()
  const [{ [DisplayLayerCellIdxQueryParam]: selectedCellIdx }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerQueryParam]: withDefault(StringParam, LayerNarrative),
    [DisplayPreviousLayerQueryParam]: withDefault(NumberParam, 100),
    [DisplayLayerSectionParam]: StringParam,
  })
  const onSectionClickHandler = (e, section) => {
    setQuery({
      [DisplayLayerCellIdxQueryParam]: undefined,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerSectionParam]: section,
    })
  }
  const onStepClickHandler = (e, { id, label, layer }) => {
    console.debug(
      '[ArticleToC] @onClickHandler \n - cell idx: ',
      id,
      '\n - label:',
      label,
      '\n - layer:',
      layer,
    )
    // go to the cell
    setQuery({
      // uncomment next line to go directly to the desired layer.
      // [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellTopQueryParam]: undefined,
      [DisplayLayerCellIdxQueryParam]: id,
      [DisplayPreviousLayerQueryParam]: undefined,
      [DisplayLayerSectionParam]: undefined,
    })
  }
  // availble height for the toc
  const toCHeight = height - 200
  // mapping of cells using cell index
  const cellsIndex = paragraphs.reduce((acc, cell) => {
    acc[cell.idx] = cell
    return acc
  }, {})

  const { groups: steps } = headingsPositions
    .reduce((acc, idx, i) => {
      const cell = cellsIndex[idx]
      if (!cell || cell.hidden || (cell.figure && hideFigures)) {
        // it is possible that there are headingPositions outside of the
        // articleTree.paragraphs list (e.g in the metadata section). In this case, we just skip.
        return acc
      }
      const nextCell =
        i < headingsPositions.length - 1 ? cellsIndex[headingsPositions[i + 1]] : null
      let isSectionStart = acc.length === 0
      let isSectionEnd = false
      if (cell.isHeading && cell.heading.level === 2) {
        isSectionStart = true
      }
      if (nextCell?.isHeading && nextCell.heading.level === 2) {
        isSectionEnd = true
      }
      if (!nextCell) {
        isSectionEnd = true
      }
      // is last only if next heading is higher than this one, or it is a hermeneutic
      acc.push({
        cell,
        isSectionStart,
        isSectionEnd,
      })
      return acc
    }, [])
    .reduce(
      (acc, d) => {
        console.debug('[ArticleToC] @render reduce \n - cell:', d.isSectionStart, d.isSectionEnd)
        // whenever section start, create a new group
        if (d.isSectionStart) {
          acc.buffer = []
        }
        // always add to the current group
        acc.buffer.push(d)
        // whenever section end, add the group to the list of groups
        if (d.isSectionEnd) {
          acc.groups.push(acc.buffer)
        }
        return acc
      },
      { buffer: [], groups: [] },
    )

  console.debug('[ArticleToC] @render \n - memoid:', memoid)

  return (
    <aside className="ArticleToC">
      <ArticleToCTitle plainTitle={plainTitle}>
        {showData ? (
          <div className="me-3 text-end">
            <ArticleDataModal binderUrl={binderUrl} repositoryUrl={repositoryUrl} />
          </div>
        ) : null}
      </ArticleToCTitle>
      <div className="pb-3 me-3 text-end pointer-events-auto">
        <ArticleLayerSwitch layers={layers} />
      </div>
      <ArticleToCSteps
        width={width * 0.16}
        steps={steps}
        selectedCellIdx={selectedCellIdx}
        style={{ height: toCHeight, borderRight: '3px solid' }}
        onClick={onStepClickHandler}
      />
      {hasBibliography && (
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
      )}
    </aside>
  )
}

export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
