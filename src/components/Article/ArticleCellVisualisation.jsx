import React, { useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Streamgraph from '../Module/Streamgraph'
import { getStepsFromMetadata } from '../../logic/ipynb'
import { getNarrativeProgress } from '../../logic/narrative'


const ArticleCellVisualisation = ({ metadata, progress, active, className='' }) => {
  const steps = useMemo(() => getStepsFromMetadata({ metadata }), [metadata])
  const { stepProgress, activeStep } = getNarrativeProgress({ steps, progress })
  const height = window.innerHeight

  return (
    <Container fluid
      className={`${className} ArticleCellVisualisation`}
      style={{
        opacity: active ? 1 : 0.5
      }}
    >
      <div className="ArticleCellVisualisation_stickyWrapper" style={{
        position: 'sticky',
        zIndex: -1,
        top:0,
        height,
      }}>
        <div className="h-100 w-100">
          overall progress: {progress}
          <br/>step {activeStep} - step progress: {stepProgress}
          <br/>stackOffset: {steps[activeStep -1]?.stackOffset ?? 'wiggle'}
          <Streamgraph className="position-absolute border-top border-dark"
            stackOffset={steps[activeStep - 1]?.stackOffset ?? 'wiggle'}
            focus={steps[activeStep]?.focus}
            data={metadata.jdh?.data}
            encoding={metadata.jdh?.encoding}
            style={{top:80, zIndex: 0}}/>
        </div>
      </div>
      {steps.map((step, i) => (
        <Row className="text-primary pointer-events-none" key={i} style={{ height }}>
          <Col {...step.bootstrapColumLayout}>
          <div className={`d-flex justify-content-${step.justifyContent ?? 'center'} align-items-${step.alignItems ?? 'center'} h-100`}>
            <div
              className={`bg-white px-3 pt-3 pb-1 ArticleCellVisualisation_step ${ activeStep === i+1 ? 'active' : '' }`}
              dangerouslySetInnerHTML={{__html: step.content}}></div>
          </div>
          </Col>
        </Row>
      ))}
    </Container>
  )
}

export default ArticleCellVisualisation
