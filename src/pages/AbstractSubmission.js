import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row } from "react-bootstrap"


export default function AbstractSubmission(){
  const { t } = useTranslation()
  return (
    <Container>
      <h1>{t('pages.abstractSubmission.title')}</h1>
      <h2>{t('start')}</h2>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{t('pages.abstractSubmission.email')}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{t('pages.abstractSubmission.username')}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                use a-z characters only, e.g. <code>bobsinclair</code>
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
