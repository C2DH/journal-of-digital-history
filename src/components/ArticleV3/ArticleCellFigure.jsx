import React, { useRef } from 'react'

import { useContainerWidth, useExtractOutputs, useFigureHeight } from '../../hooks/ipynbV3'
import { getDataTablePageSize, getFigureRatio } from '../../logic/ipynbV3'
import { CellTypeMarkdown, DataTableRefPrefix } from '../../constants/globalConstants'
import { useWindowSize } from '../../hooks/windowSize'
import ArticleCellOutputs from '../Article/ArticleCellOutputs'
import ArticleCellDataTable from '../Article/ArticleCellDataTable'
import ArticleFigureCaption from '../Article/ArticleFigureCaption'

import '../../styles/components/ArticleV3/ArticleCellFigure.scss'

const getPictureStyle = (aspectRatio, figureHeight, shouldUseFixedHeight) =>
  shouldUseFixedHeight
    ? { height: parseInt(figureHeight) }
    : { paddingTop: `${aspectRatio * 100}%` }

/**
 * Component to display figure outputs
 * Picture are displayed in 2 modes:
 *    - Fixed height defined in tags. If the picture is wider than the bootstrap column width, a scrollbar is used
 *    - Aspect-ratio defined in tags. The width is 100%. The height depends on the width with the aspect-ratio.
 *
 * Difference with V1:
 *    - The Bootstrap layout is managed by the parent component ArticleCell
 *    - Source code is displayed by the parent component Articlecell
 *    - Picure are displayed on img tag instead of div background
 *    - The height tag has the priority on the aspect-ratio tag.
 *      If the figure has the cover tag, the aspect-ratio has the priority.
 */
const ArticleCellFigure = ({
  figure,
  metadata = [],
  outputs = [],
  cellType = CellTypeMarkdown,
  active = false,
  isJavascriptTrusted = false,
  isMagic = false,
  isolationMode = false,
  children,
}) => {
  const { captions, pictures, otherOutputs, htmlOutputs } = useExtractOutputs(
    figure.idx,
    metadata,
    outputs,
  )

  const pictureRef = useRef()
  const tags = Array.isArray(metadata.tags) ? metadata.tags : []
  const aspectRatio = getFigureRatio(tags)
  const figureHeight = useFigureHeight(tags, !aspectRatio, figure.isCover)
  const containerWidth = useContainerWidth(pictureRef)
  const shouldUseFixedHeight =
    figureHeight &&
    (!figure.isCover || !aspectRatio) &&
    (!aspectRatio || figureHeight / aspectRatio <= containerWidth)

  const { height: windowHeight } = useWindowSize()

  //  Data table
  const isDataTable = tags.includes('data-table') || figure.refPrefix === DataTableRefPrefix

  const dataTableContent =
    isDataTable && htmlOutputs.length > 0
      ? Array.isArray(htmlOutputs[0].data['text/html'])
        ? htmlOutputs[0].data['text/html'].join('\n')
        : htmlOutputs[0].data['text/html'] || ''
      : children?.props?.content

  return (
    <figure className={`ArticleCellFigure ${active ? 'active' : ''} ${figure.getPrefix()}`}>
      {/* Other outputs */}
      {!isDataTable && otherOutputs.length > 0 && (
        <>
          <div className="anchor" id={figure.ref} />
          <ArticleCellOutputs
            isMagic={isMagic}
            isolationMode={isolationMode}
            hideLabel
            isJavascriptTrusted={isJavascriptTrusted}
            cellIdx={figure.idx}
            outputs={otherOutputs}
            windowHeight={windowHeight}
            height={parseInt(figureHeight)}
          />
        </>
      )}

      {/* Pictures */}
      {pictures.map(({ base64 }, i) => (
        <div
          key={i}
          className={`picture ${!shouldUseFixedHeight ? 'with-aspect-ratio' : ''}`}
          style={getPictureStyle(aspectRatio, figureHeight, shouldUseFixedHeight)}
          ref={pictureRef}
        >
          <img src={base64} alt="display_data output" />
        </div>
      ))}

      {/* Data table */}
      {isDataTable ? (
        <ArticleCellDataTable
          cellType={cellType}
          cellIdx={figure.idx}
          htmlContent={dataTableContent}
          initialPageSize={getDataTablePageSize(tags)}
        />
      ) : (
        children
      )}

      {/* Caption */}
      {!figure.isCover && (
        <ArticleFigureCaption figure={figure} className="small">
          <div
            dangerouslySetInnerHTML={{
              __html: captions
                .join('<br />')
                .replace(/(Fig.|figure|table)\s+[\da-z-]+\s*:\s+/i, ''),
            }}
          />
        </ArticleFigureCaption>
      )}
    </figure>
  )
}

export default ArticleCellFigure
