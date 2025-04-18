import React from 'react'
import { useTranslation } from 'react-i18next'
// import { useToCStore } from './store'
import ArticleToCSteps from './ArticleToCSteps'
import { useWindowStore } from '../../store'
import {
  DisplayLayerCellIdxQueryParam,
  DisplayLayerSectionBibliography,
  DisplayLayerSectionParam,
} from '../../constants/globalConstants'
import { NumberParam, useQueryParams, withDefault } from 'use-query-params'
import './ArticleToC.css'
import ArticleThebeSession from './ArticleThebeSession'
import ArticleToCTitle from './ArticleToCTitle'
import PropTypes from 'prop-types'
import { asEnumParam } from '../../logic/params'

const getToCSteps = ({
  headingsPositions,
  cellsIndex,
  hideFigures = false,
  has_bibliography = false,
}) => {
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
  if (has_bibliography) {
    // add bibliography pseudocell
    groups.push([
      {
        isSectionEnd: true,
        isSectionStart: true,
        cell: {
          idx: DisplayLayerSectionBibliography,
          level: 'H2',
          isHeading: true,
          heading: {
            level: 2,
            tag: 'h2',
            content: 'Bibliography',
          },
        },
      },
    ])
  }
  console.debug('[ArticleToC] @getToCSteps \n - groups:', groups)
  return groups
}
// this is a refactoring of v2 ToC when the layut is flattened down.
const ArticleToC = ({
  plainTitle = '',
  headingsPositions = [],
  paragraphs = [],
  headerHeight = 100,
  kernelName = '-',
  hasBibliography = false,
}) => {
  const { t } = useTranslation()
  const height = useWindowStore((state) => state.windowHeight)
  const width = useWindowStore((state) => state.windowWidth)
  const [{ [DisplayLayerCellIdxQueryParam]: selectedCellIdx }, setQuery] = useQueryParams({
    [DisplayLayerCellIdxQueryParam]: withDefault(NumberParam, -1),
    [DisplayLayerSectionParam]: asEnumParam([DisplayLayerSectionBibliography]),
  })

  // const visibleCellsIdx = useToCStore((store) => store.visibleCellsIdx)
  const cellsIndex = paragraphs.reduce((acc, cell) => {
    acc[cell.idx] = cell
    return acc
  }, {})
  const toCHeight = height - headerHeight //hasBibliography ? height - 150 : height - 100
  const steps = getToCSteps({
    headingsPositions,
    cellsIndex,
    hideFigures: false,
    has_bibliography: hasBibliography,
  })

  const onStepClickHandler = (e, { id, label, layer }) => {
    console.debug(
      '[ArticleToC] @onClickHandler \n - cell id (or idx): ',
      id,
      '\n - label:',
      label,
      '\n - layer:',
      layer,
    )
    if (isNaN(id)) {
      setQuery({
        // uncomment next line to go directly to the desired layer.
        // [DisplayLayerQueryParam]: layer,
        [DisplayLayerCellIdxQueryParam]: undefined,
        [DisplayLayerSectionParam]: id,
      })
    } else {
      setQuery({
        // uncomment next line to go directly to the desired layer.
        // [DisplayLayerQueryParam]: layer,
        [DisplayLayerCellIdxQueryParam]: id,
        [DisplayLayerSectionParam]: undefined,
      })
    }
  }

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
      <ArticleToCTitle plainTitle={plainTitle}></ArticleToCTitle>

      <span className="d-none">{t('table of contents')}</span>
      <ArticleToCSteps
        width={width * 0.16}
        steps={steps}
        selectedCellIdx={selectedCellIdx}
        style={{ height: plainTitle.length ? toCHeight - 130 : toCHeight }}
        onClick={onStepClickHandler}
      ></ArticleToCSteps>

      {/* <ul>
        {visibleCellsIdx.map((idx) => (
          <li key={idx}>{idx}</li>
        ))}
      </ul> */}
    </aside>
  )
}

ArticleToC.propTypes = {
  // plainTitle = '',
  // headingsPositions = [],
  // paragraphs = [],
  // headerHeight = 100,
  // kernelName = '-',
  // hasBibliography = false,
  plainTitle: PropTypes.string,
  headingsPositions: PropTypes.array,
  paragraphs: PropTypes.array,
  headerHeight: PropTypes.number,
  kernelName: PropTypes.string,
  hasBibliography: PropTypes.bool,
}

export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  if (prevProps.kernelName !== nextProps.kernelName) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
