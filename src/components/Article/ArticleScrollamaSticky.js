import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleFigure from './ArticleFigure'
import ArticleCellOutput from './ArticleCellOutput'
import {
  BootstrapNarrativeStepFigureColumnLayout,
  BootstrapNarrativeStepCaptionColumnLayout
} from '../../constants'
import { markdownParser } from '../../logic/ipynb'
import { useCurrentWindowDimensions, useBoundingClientRect } from '../../hooks/graphics'

/**
 * ArticleScrollamaSticky
 * Component wrapper for ArticleCell that stays sticky on the page.
 * @param  cell - the cell to display in the sticky
 * @returns  a sticky div adjusted using current window boundaries
 */
const ArticleScrollamaSticky = ({
  cell,
  currentStep,
  marginTop=100,
  marginBottom=50,
  // marginRight=100,
  // marginLeft=50
}) => {
  // get window height
  const { height } = useCurrentWindowDimensions()
  // get available space dimension
  const [bbox, ref] = useBoundingClientRect()

  const captions = cell.outputs.reduce((acc, output) => {
    if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
      acc.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
    }
    return acc
  }, [])
  console.info('ArticleScrollamaSticky currentStep:', currentStep)
  return (
    <div className="ArticleScrollamaSticky" style={{
      position: 'sticky',
      top: 100,
      height: height - marginTop - marginBottom
    }}>
      <a className='anchor' id={`C-${cell.idx}`} />
      <a className="anchor" id={cell.figure.ref} />
      <Container className=" d-flex flex-column" style={{
        height: height - marginTop - marginBottom
      }}>
        <Row className="flex-grow-1">
          <Col className="h-100 position-relative"  ref={ref} {...BootstrapNarrativeStepFigureColumnLayout}>
            <div className="position-absolute h-100 w-100" style={{overflow: 'hidden'}}>
              {!cell.outputs.length ? (
                <div className="ArticleCellFigure_no_output">
                </div>
              ): null}
              {cell.outputs.map((output,i) => (
                <ArticleCellOutput hideLabel height={bbox.height} width={bbox.width} output={output} key={i} />
              ))}
            </div>
          </Col>
        </Row>
        <Row className="flex-shrink-1">
          <Col {...BootstrapNarrativeStepCaptionColumnLayout}>
            <ArticleFigure figure={cell.figure}><p dangerouslySetInnerHTML={{
              __html: captions.join('<br />'),
            }} /></ArticleFigure>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ArticleScrollamaSticky
