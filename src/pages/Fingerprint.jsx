import React, { useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useBoundingClientRect } from '../hooks/graphics'
import ArticleFingerprint from '../components/Article/ArticleFingerprint'
import MockData from '../data/mock-ipynb-stats.json'

const Fingerprint = () => {
  const [{ width: size }, ref] = useBoundingClientRect()
  const [data, setData] = useState(MockData)
  const [isValid, setIsValid] = useState(null)

  const changeHandler = (e) => {
    try {
      const d = JSON.parse(e.target.value)
      if (Array.isArray(d.cells) && typeof d.stats === 'object') {
        setData(d)
        setIsValid(true)
      }
    } catch {
      setIsValid(false)
    }
  }
  return (
    <Container className="page">
      <Row>
        <Col lg={{ offset: 1, span: 5 }}>
          <label className="monospace">Example textarea (size: {size})</label>
        </Col>
      </Row>
      <Row>
        <Col lg={{ offset: 1, span: 5 }}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control
                className="monospace"
                isValid={isValid}
                style={{ minHeight: size, fontSize: '0.7em' }}
                as="textarea"
                rows={3}
                onChange={changeHandler}
                defaultValue={JSON.stringify(data, null, 2)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col lg={{ span: 5 }} style={{ minHeight: size }}>
          <div ref={ref}>
            <ArticleFingerprint
              debug={false}
              stats={data.stats}
              cells={data.cells}
              size={size}
              margin={20}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Fingerprint
