import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToCStore } from './store'
import ArticleToCSteps from './ArticleToCSteps'
import { useWindowStore } from '../../store'
import { DisplayLayerCellIdxQueryParam } from '../../constants'
import { NumberParam, useQueryParams, withDefault } from 'use-query-params'
import './ArticleToC.css'
import ArticleThebeSession from './ArticleThebeSession'

const getToCSteps = ({ headingsPositions, cellsIndex, hideFigures = false }) => {
  const { groups } = headingsPositions
    .reduce((acc, idx, i) => {
      const cell = cellsIndex[idx]
      if (!cell || cell.hidden || (cell.figure && hideFigures)) {
        // Note on `!cell`: it is possible that there are headingPositions outside of the
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
        // console.debug('[ArticleToC] @render reduce \n - cell:', d.isSectionStart, d.isSectionEnd)
        // // whenever section start, create a new group
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
  return groups
}
// this is a refactoring of v2 ToC when the layut is flattened down.
const ArticleToC = ({
  headingsPositions = [],
  paragraphs = [],
  headerHeight = 140,
  kernelName = '-',
}) => {
  const { t } = useTranslation()
  const height = useWindowStore((state) => state.windowHeight)
  const width = useWindowStore((state) => state.windowWidth)
  const [{ [DisplayLayerCellIdxQueryParam]: selectedCellIdx }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
  })

  const visibleCellsIdx = useToCStore((store) => store.visibleCellsIdx)
  const cellsIndex = paragraphs.reduce((acc, cell) => {
    acc[cell.idx] = cell
    return acc
  }, {})
  const toCHeight = height - headerHeight //hasBibliography ? height - 150 : height - 100
  const steps = getToCSteps({ headingsPositions, cellsIndex, hideFigures: false })

  const onStepClickHandler = (e, { id, label, layer }) => {
    console.debug(
      '[ArticleToC] @onClickHandler \n - cell idx: ',
      id,
      '\n - label:',
      label,
      '\n - layer:',
      layer,
    )
    setQuery({
      // uncomment next line to go directly to the desired layer.
      // [DisplayLayerQueryParam]: layer,
      [DisplayLayerCellIdxQueryParam]: id,
    })
  }

  useEffect(() => {
    // scroll to the correct id
    const element = document.querySelector("[data-cell-idx='" + selectedCellIdx + "']")
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedCellIdx])

  console.debug('[ArticleToC] @render \n - size: ', width, 'x', height, 'px', steps)

  return (
    <aside
      className="ArticleToC ArticleToCV3 col-4"
      style={{
        top: headerHeight,
        width: width * 0.16,
      }}
    >
      <ArticleThebeSession kernelName={kernelName} />
      <span className="d-none">{t('table of contents')}</span>
      <ArticleToCSteps
        width={width * 0.16}
        steps={steps}
        selectedCellIdx={selectedCellIdx}
        style={{ height: toCHeight }}
        onClick={onStepClickHandler}
      />
      <ul>
        {visibleCellsIdx.map((idx) => (
          <li key={idx}>{idx}</li>
        ))}
      </ul>
    </aside>
  )
}

export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
