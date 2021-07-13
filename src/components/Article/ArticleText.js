import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleToC from './ArticleToC'
import ArticleStream from './ArticleStream'
import { LayerHermeneuticsStep, LayerHermeneutics } from '../../constants'


const ArticleText = ({
  memoid,
  paragraphs, paragraphsPositions, headingsPositions,
  onDataHrefClick,
  className='mt-5'
}) => {
  const [currentStep, setCurrentStep] = useState({idx: -1, direction: 'down'})
  // get
  return (
    <div className={`${className} ArticleText`}>
      <div className='ArticleText_toc' style={{
        position: 'fixed',
        top: 160,
        right: 70
      }}>
        <Container fluid style={{position: 'absolute'}}>
          <Row>
            <Col {...{
              md: { offset: 10, span: 2}
            }}>
              <div className="d-flex flex-row-reverse">
                <div className="mr-3">
                  {/* <div className="rounded border border-dark">N</div>*/}
                  <ArticleToC
                    headingsPositions={headingsPositions}
                    steps={paragraphs} active
                    step={paragraphsPositions[currentStep.idx]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ArticleStream
        memoid={memoid}
        cells={paragraphs}
        shadowLayers={[LayerHermeneuticsStep, LayerHermeneutics]}
        onDataHrefClick={onDataHrefClick}
        onStepChange={(step) => setCurrentStep(step)}
      />
    </div>
  )
}

export default ArticleText;
