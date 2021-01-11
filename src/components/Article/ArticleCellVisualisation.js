import React, { useMemo } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Streamgraph from '../Module/Streamgraph'
import { markdownParser } from '../../logic/ipynb'

const ArticleCellVisualisation = ({ metadata, progress, active, className }) => {
  const steps = useMemo(() => (metadata.jdh.steps ?? []).map(step => ({
    ...step,
    content: markdownParser.render(step.source.join('\n'))
  })), [metadata])
  const height = window.innerHeight
  const progressWeighted = active
    ? progress * (steps.length + 1)
    : 0
  const ratio = 1 / (steps.length + 1)
  const activeStep = Math.floor(progressWeighted)
  const stepProgress = ((progress - activeStep * ratio) / ratio)
  // const currentStep = / steps.length
  // first blank step for presentation.
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
            style={{top:80, zIndex: -1}}/>
        </div>
      </div>
      {steps.map((step, i) => (
        <Row className="text-primary" key={i} style={{ height }}>
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
