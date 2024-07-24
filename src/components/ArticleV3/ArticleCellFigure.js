import React from 'react';

import { useExtractOutputs, useFigureHeight } from '../../hooks/ipynbV3';
import { getDataTablePageSize, getFigureRatio } from '../../logic/ipynbV3';
import { CellTypeMarkdown, DataTableRefPrefix } from '../../constants';
import { useWindowSize } from '../../hooks/windowSize';
import ArticleCellOutputs from '../Article/ArticleCellOutputs';
import ArticleCellDataTable from '../Article/ArticleCellDataTable';
import ArticleFigureCaption from '../Article/ArticleFigureCaption';

import '../../styles/components/ArticleV3/ArticleCellFigure.scss';


const getPictureStyle = (aspectRatio, figureHeight, useFixedHeight) =>
  useFixedHeight
    ? { height: parseInt(figureHeight) }
    : { paddingTop: `${aspectRatio * 100}%` };
    

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
  metadata            = [],
  outputs             = [],
  cellType            = CellTypeMarkdown,
  active              = false,
  isJavascriptTrusted = false,
  isMagic             = false,
  isolationMode       = false,
  children
}) => {
 
  const {
    captions,
    pictures,
    otherOutputs,
    htmlOutputs
  } = useExtractOutputs(figure.idx, metadata, outputs);

  const tags                      = Array.isArray(metadata.tags) ? metadata.tags : [];
  const aspectRatio               = getFigureRatio(tags);
  const figureHeight              = useFigureHeight(tags, isNaN(aspectRatio), figure.isCover); 
  const useFixedHeight            = figureHeight && (!figure.isCover || isNaN(aspectRatio));
  const { height: windowHeight }  = useWindowSize();

  //  Data table
  const isDataTable               =
    (tags.includes('data-table') || figure.refPrefix === DataTableRefPrefix) &&
    cellType === CellTypeMarkdown;

  const dataTableContent         = 
    isDataTable && htmlOutputs.length > 0
      ? htmlOutputs[0].data['text/html'].join('\n')
      : children?.props?.content
  
  return (
    <figure className={`ArticleCellFigure ${active ? 'active' : ''} ${figure.getPrefix()}`}>

      {/* Other outputs */}
      {!isDataTable && otherOutputs.length > 0 && (
        <>
          <div className="anchor" id={figure.ref} />
          <ArticleCellOutputs
            isMagic             = {isMagic}
            isolationMode       = {isolationMode}
            hideLabel
            isJavascriptTrusted = {isJavascriptTrusted}
            cellIdx             = {figure.idx}
            outputs             = {otherOutputs}
            windowHeight        = {windowHeight}
            height              = {parseInt(figureHeight)}
            />
        </>
      )}

      {/* Pictures */}
      {pictures.map(({ base64 }, i) => (
        <div
          key       = {i}
          className = {`picture ${!useFixedHeight ? 'with-aspect-ratio' : ''}`}
          style     = {getPictureStyle(aspectRatio, figureHeight, useFixedHeight)}
        >
          <img src={base64} alt="display_data output" />
        </div>
      ))}

      {/* Data table */}
      {isDataTable ? (
        <ArticleCellDataTable
          cellType        = {cellType}
          cellIdx         = {figure.idx}
          htmlContent     = {dataTableContent}
          initialPageSize = {getDataTablePageSize(tags)}
        />
      ) : (
        children
      )}

      {/* Caption */}
      {!figure.isCover &&
        <ArticleFigureCaption figure={figure} className="small">
          <div
            dangerouslySetInnerHTML={{
              __html: captions
                .join('<br />')
                .replace(/(Fig.|figure|table)\s+[\da-z-]+\s*:\s+/i, ''),
            }}
          />
        </ArticleFigureCaption>
      }

    </figure>
  )
}

export default ArticleCellFigure;