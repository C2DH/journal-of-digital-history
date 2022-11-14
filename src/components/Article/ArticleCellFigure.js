import React, { useMemo } from 'react'
import ArticleCellOutputs from './ArticleCellOutputs'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'
import { BootstrapColumLayout } from '../../constants'
import { Container, Row, Col } from 'react-bootstrap'
import '../../styles/components/Article/ArticleCellFigure.scss'

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
  // retrieve aspectRatio
  // From https://css-tricks.com/aspect-ratio-boxes/
  // Even when that is a little unintuitive, like for vertical padding.
  // This isn’t a hack, but it is weird: padding-top and padding-bottom is based on the parent element’s width.
  // So if you had an element that is 500px wide, and padding-top of 100%, the padding-top would be 500px.
  const aspectRatio = tags.reduce((acc, tag) => {
    const ratio = tag.match(/^aspect-ratio-(\d+)-(\d+)$/) // e.g. aspect-ratio-16-9 w/h
    if (!ratio) {
      return acc
    }
    return ratio[2] / (ratio[1] || 1)
  }, undefined)
  // get figure height if any has been specified with the tags. Otherwise default is windowHeight * .5
  let figureHeight = tags.reduce((acc, tag) => {
    const m = tag.match(/^h-(\d+)px$/) // h-100px
    if (!m) {
      return acc
    }
    return m[1]
  }, Math.max(200, windowHeight * 0.5))

  const captions = useMemo(
    () =>
      outputs.reduce((acc, output) => {
        if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
          acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
        }
        return acc
      }, []),
    outputs,
  )

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
    <div className={`ArticleCellFigure ${aspectRatio ? 'with-aspect-ratio' : ''}`}>
      <Container className={containerClassName} fluid={isFluidContainer}>
        <Row>
          <Col {...columnLayout}>
            <figure
              style={
                !isNaN(aspectRatio)
                  ? {
                      paddingTop: `${aspectRatio * 100}%`,
                    }
                  : {
                      minHeight: figureHeight,
                    }
              }
            >
              <div className="anchor" id={figure.ref} />
              <ArticleCellOutputs
                hideLabel
                isJavascriptTrusted={isJavascriptTrusted}
                cellIdx={figure.idx}
                outputs={outputs}
                height={figureHeight}
              />
            </figure>
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
