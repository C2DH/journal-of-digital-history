import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../constants'


const Faq = () => {
  return (
    <Container className="Faq page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1 className="my-5">Faq</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default Faq
