import React from 'react'
import ArticleToC from './ArticleToC'
import ArticleStream from './ArticleStream'
import SwitchLayer from '../SwitchLayer'
import { useBoundingClientRect } from '../../hooks/graphics'


const ArticleText = ({
  memoid,
  paragraphs,
  headingsPositions,
  onDataHrefClick,
  className='mt-5',
  anchorPrefix='',
  height=0,
  tocOffset=100,
  disableSwitchLayer,
  hasBibliography
}) => {
  const [bbox, ref] = useBoundingClientRect()
  console.info('ArticleText bbox', bbox)
  return (
    <div className={`${className} ArticleText`}>
      <div className='ArticleText_toc d-flex flex-column' style={{
        top: tocOffset,
        height: height - tocOffset
      }}>
        {!disableSwitchLayer && <SwitchLayer className="flex-shrink-1"/>}
        {/* <div className="rounded border border-dark">N</div>*/}
        <div className="flex-grow-1 border-top border-dark border-bottom mb-3" ref={ref}>
          <ArticleToC
            height={bbox.height}
            width={bbox.width}
            paragraphs={paragraphs}
            headingsPositions={headingsPositions}
            active
            hasBibliograhy={hasBibliography}
          />
        </div>
      </div>
      <ArticleStream
        memoid={memoid}
        cells={paragraphs}
        onDataHrefClick={onDataHrefClick}
        anchorPrefix={anchorPrefix}
      />
    </div>
  )
}

export default ArticleText;
