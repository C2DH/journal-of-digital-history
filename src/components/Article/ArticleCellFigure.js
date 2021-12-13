import React from 'react'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'
import { useInjectTrustedJavascript } from '../../hooks/graphics'
import {BootstrapColumLayout} from '../../constants'
import { Container, Row, Col} from 'react-bootstrap'

const ArticleCellFigure = ({ figure, metadata={}, outputs=[], sourceCode, figureColumnLayout, children }) => {
  const isFluidContainer = figure.isCover || (metadata.tags && metadata.tags.includes('full-width'))
  const captions = outputs.reduce((acc, output) => {
    if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
      acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
    }
    return acc
  }, [])

  if (Array.isArray(metadata.jdh?.object?.source)) {
    captions.push(markdownParser.render(metadata.jdh.object.source.join('\n')))
  }

  let columnLayout = figureColumnLayout ?? outputs.reduce((acc, output) => {
    if (output.metadata && output.metadata.jdh?.object?.bootstrapColumLayout) {
      acc = { acc, ...output.metadata.jdh?.object?.bootstrapColumLayout }
    }
    return acc
  }, BootstrapColumLayout)

  if (metadata.jdh?.object?.bootstrapColumLayout) {
    figureColumnLayout = { ...figureColumnLayout, ...metadata.jdh?.object?.bootstrapColumLayout }
  }

  // use scripts if there areany
  const trustedScripts = outputs.reduce((acc, output) => {
    if (typeof output.data === 'object') {
      if (Array.isArray(output.data['application/javascript'])) {
        return acc.concat(output.data['application/javascript'])
      }
    }
    return acc
  }, [])

  const refTrustedJavascript = useInjectTrustedJavascript({
    id: `trusted-script-for-${figure.ref}`,
    contents: trustedScripts
  })

  return (
    <div className="ArticleCellFigure" ref={refTrustedJavascript}>
    <Container fluid={isFluidContainer}>
      <Row>
        <Col {...columnLayout}>
          <div >
            <div className="anchor" id={figure.ref} />
          {!outputs.length ? (
            <div className="ArticleCellFigure_no_output">
            </div>
          ): null}
          {outputs.map((output,i) => (
            <ArticleCellOutput hideLabel output={output} key={i} />
          ))}
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
          <ArticleFigure figure={figure}><p dangerouslySetInnerHTML={{
            __html: captions.join('<br />').replace(/(Fig.|figure|table)\s+[\da-z-]+\s*:\s+/i, ''),
          }} /></ArticleFigure>
          </Col>
        </Row>
      </Container>
    )}
    </div>
  )
}

export default ArticleCellFigure
