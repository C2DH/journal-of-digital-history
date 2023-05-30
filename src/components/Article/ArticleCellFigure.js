import React, { useMemo } from 'react'
import ArticleCellOutputs from './ArticleCellOutputs'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'
import { BootstrapColumLayout } from '../../constants'
import { Container, Row, Col } from 'react-bootstrap'
import '../../styles/components/Article/ArticleCellFigure.scss'
// import LazyFigure from '../LazyFigure'
// const ArticleCellFigure = ({ outputs }) => {
//   return (
//     <Container fluid className="article-cell-figure">
//       <pre>{JSON.stringify(outputs, null, 2)}</pre>
//     </Container>
//   )
// }

const ArticleCellFigure = ({
  figure,
  metadata = {},
  outputs = [],
  sourceCode,
  isJavascriptTrusted,
  figureColumnLayout,
  children,
  containerClassName,
  windowHeight = 100,
  isMagic = false,
  isolationMode = false,
  // lazy = false,
  // withTransition = false,
  active = false,
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
  let figureHeight = figure.isCover
    ? windowHeight * 0.8
    : tags.reduce((acc, tag) => {
        const m = tag.match(/^h-(\d+)px$/) // h-100px
        if (!m) {
          return acc
        }
        return m[1]
      }, Math.max(200, windowHeight * 0.5))

  const { captions, pictures, otherOutputs } = useMemo(
    () =>
      outputs.reduce(
        (acc, output = {}) => {
          if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
            // look for catpions in the outputs metadata
            acc.captions.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
          }
          const mimetypes = Object.keys(output.data ?? {})
          const mimetype = mimetypes.find((d) => d.indexOf('image/') === 0)
          if (mimetype) {
            acc.pictures.push({
              // ...output,
              src: output.metadata?.jdh?.object?.src,
              base64: `data:${mimetype};base64,${output.data[mimetype]}`,
            })
          } else {
            acc.otherOutputs.push(output)
          }
          return acc
        },
        { captions: [], pictures: [], otherOutputs: [] },
      ),
    [figure.idx],
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

  console.debug(
    '[ArticleCellFigure] \n - idx:',
    figure.idx,
    '\n - aspectRatio:',
    aspectRatio,
    '\n - tags:',
    tags,
    '\n - n.pictures:',
    pictures.length,
    '\n - active:',
    active,
  )

  return (
    <div className={`ArticleCellFigure ${active ? 'active' : ''}`}>
      <Container className={containerClassName} fluid={isFluidContainer}>
        <Row>
          <Col {...columnLayout}>
            {otherOutputs.length > 0 && (
              <figure>
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
              </figure>
            )}
            {pictures.map(({ base64 }, i) => (
              <figure
                key={i}
                style={
                  !isNaN(aspectRatio)
                    ? {
                        paddingTop: `${aspectRatio * 100}%`,
                        position: 'relative',
                      }
                    : {
                        height: parseInt(figureHeight),
                      }
                }
              >
                <div
                  className={`ArticleCellFigure_picture ${figure.isCover ? 'with-cover' : ''} ${
                    !isNaN(aspectRatio) ? 'with-aspect-ratio' : ''
                  }`}
                  style={{
                    backgroundImage: `url(${base64.replace(/\n/g, '')})`,
                  }}
                />
              </figure>
            ))}
            {/* {pictures.length > 0 && lazy ? (
              pictures.map(({ src, base64 }, i) => (
                <LazyFigure
                  aspectRatio={aspectRatio}
                  height={figureHeight}
                  key={i}
                  src={src}
                  base64={base64}
                  withTransition={withTransition}
                />
              )) */}
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
