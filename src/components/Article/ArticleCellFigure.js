import React from 'react'
import ArticleCellOutput from './ArticleCellOutput'
import ArticleFigure from './ArticleFigure'
import { markdownParser } from '../../logic/ipynb'
import {BootstrapColumLayout} from '../../constants'
import { Container, Row, Col} from 'react-bootstrap'

const ArticleCellFigure = ({ figure, metadata={}, outputs=[], sourceCode, children }) => {
  const captions = outputs.reduce((acc, output) => {

    if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
      acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
    }
    return acc
  }, [])

  if (Array.isArray(metadata.jdh?.object?.source)) {
    captions.push(markdownParser.render(metadata.jdh.object.source.join('\n')))
  }

  let figureColumnLayout = outputs.reduce((acc, output) => {
    if (output.metadata && output.metadata.jdh?.object?.bootstrapColumLayout) {
      acc = { acc, ...output.metadata.jdh?.object?.bootstrapColumLayout }
    }
    return acc
  }, BootstrapColumLayout)

  if (metadata.jdh?.object?.bootstrapColumLayout) {
    figureColumnLayout = { ...figureColumnLayout, ...metadata.jdh?.object?.bootstrapColumLayout }
  }
  return (
    <div className="ArticleCellFigure">
    <Container fluid={metadata.tags && metadata.tags.includes('full-width')}>
      <Row>
        <Col {...figureColumnLayout}>
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
    <Container>
      <Row className="small">
        <Col {...BootstrapColumLayout}>
        {sourceCode}
        <ArticleFigure figure={figure}><p dangerouslySetInnerHTML={{
          __html: captions.join('<br />'),
        }} /></ArticleFigure>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default ArticleCellFigure
