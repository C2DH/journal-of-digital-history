import React from 'react'
import ArticleCellOutputs from './ArticleCellOutputs'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'
import { BootstrapColumLayout } from '../../constants'
import { Container, Row, Col } from 'react-bootstrap'

const ArticleCellFigure = ({
  figure,
  metadata = {},
  outputs = [],
  sourceCode,
  isJavascriptTrusted,
  figureColumnLayout,
  children,
  containerClassName,
  active,
  windowHeight = 100,
}) => {
  const tags = Array.isArray(metadata.tags) ? metadata.tags : []
  const isFluidContainer = figure.isCover || tags.includes('full-width')
  // calculate optimal figure height and allow special h-tags. Default is windowHeight * .5
  let figureHeight = tags.reduce((acc, tag) => {
    const m = tag.match(/^h-(\d+)(px)?$/) // h-50 h-100 or h-100px
    if (!m) {
      return acc
    }
    if (m[2]) {
      // e.g `h-500px`
      return [m[1], m[2]].join('')
    }
    // e.g `h-50` `h-100` or `h-25` or `h-200`
    return Math.max(200, (windowHeight * m[1]) / 100)
  }, windowHeight * 0.5)
  figureHeight = Math.max(200, figureHeight)

  const captions = outputs.reduce((acc, output) => {
    if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
      acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
    }
    return acc
  }, [])

  if (Array.isArray(metadata.jdh?.object?.source)) {
    captions.push(markdownParser.render(metadata.jdh.object.source.join('\n')))
  }

  let columnLayout =
    figureColumnLayout ??
    outputs.reduce((acc, output) => {
      if (output.metadata && output.metadata.jdh?.object?.bootstrapColumLayout) {
        acc = { acc, ...output.metadata.jdh?.object?.bootstrapColumLayout }
      }
      return acc
    }, BootstrapColumLayout)

  if (metadata.jdh?.object?.bootstrapColumLayout) {
    figureColumnLayout = {
      ...figureColumnLayout,
      ...metadata.jdh?.object?.bootstrapColumLayout,
    }
  }

  console.debug('[ArticleCellFigure] active, idx:', figure.idx, active)

  return (
    <div className="ArticleCellFigure">
      <Container className={containerClassName} fluid={isFluidContainer}>
        <Row>
          <Col {...columnLayout}>
            <div>
              <div className="anchor" id={figure.ref} />
              <ArticleCellOutputs
                hideLabel
                isJavascriptTrusted={isJavascriptTrusted}
                cellIdx={figure.idx}
                outputs={outputs}
                height={figureHeight}
              />
            </div>
            {children}
          </Col>
        </Row>
      </Container>
      {figure.isCover ? null : (
        <Container>
          <Row className="small">
            <Col {...BootstrapColumLayout}>
              {sourceCode}
              <ArticleFigure figure={figure}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: captions
                      .join('<br />')
                      .replace(/(Fig.|figure|table)\s+[\da-z-]+\s*:\s+/i, ''),
                  }}
                />
              </ArticleFigure>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default ArticleCellFigure
