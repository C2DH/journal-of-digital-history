import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'


const FingerprintExplained = () => {
  return (
    <Container className="FingerprintExplained page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1>Release notes.</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default FingerprintExplained
