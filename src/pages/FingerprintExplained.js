import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'


const FingerprintExplained = () => {
  return (
    <Container className="FingerprintExplained page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Fingerprint, explained</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default FingerprintExplained
