import React from 'react'
import ArticleToC from './ArticleToC'
import ArticleStream from './ArticleStream'
import SwitchLayer from '../SwitchLayer'
import { useBoundingClientRect } from '../../hooks/graphics'
import { IsMobile } from '../../constants'

const ArticleText = ({
  memoid,
  paragraphs,
  headingsPositions,
  onDataHrefClick,
  className='mt-5',
  anchorPrefix='',
  height=0,
  tocOffset=99,
  disableSwitchLayer,
  hasBibliography,
  binderUrl,
  emailAddress
}) => {
  const [bbox, ref] = useBoundingClientRect()
  console.info('ArticleText bbox', bbox)
  return (
    <div className={`${className} ArticleText`}>
      {!IsMobile
        ? (
          <div className='ArticleText_toc d-flex border-top border-dark flex-column' style={{
            top: tocOffset,
            height: height - tocOffset
          }}>
            {!disableSwitchLayer && <SwitchLayer binderUrl={binderUrl} emailAddress={emailAddress} className="flex-shrink-1 py-3 mb-0"/>}
            {/* <div className="rounded border border-dark">N</div>*/}

              <div className="flex-grow-1 border-bottom mb-3 border-dark" ref={ref}>
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
        )
        : null
      }
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
