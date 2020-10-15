import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row } from "react-bootstrap"
import { useStore } from '../store'

export default function AbstractSubmission() {
  const { t } = useTranslation()
  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--light)' });
  });
  return (
    <Container className="page">
      <h1>{t('pages.abstractSubmission.title')}</h1>
      <h2 className="mb-5">{t('pages.abstractSubmission.subheading')}</h2>
      <Form>
        <Row>
          <Col md={6}>
          <Form.Group controlId="formEmail">
            <Form.Label>{t('pages.abstractSubmission.articleDataset')}</Form.Label>
            <Form.Control type="url" placeholder="dataverse public url" />
            <Form.Text className="text-muted">
              Please check our <a href="#guidelines">guidelines</a>
            </Form.Text>
          </Form.Group>
            <Form.Group controlId="formArticleTitle">
              <Form.Label>{t('pages.abstractSubmission.articleTitle')}</Form.Label>
              <Form.Control as="textarea" placeholder="Title" />
              <Form.Text className="text-muted">
                max 200 characters  <code>;)</code>
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formArticleAbstract">
              <Form.Label>{t('pages.abstractSubmission.articleAbstract')}</Form.Label>
              <Form.Control as="textarea" placeholder="Title" rows="10"/>
              <Form.Text className="text-muted">
                max 1000 chars
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>{t('pages.abstractSubmission.authorEmail')}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>{t('pages.abstractSubmission.authorUsername')}</Form.Label>
              <Form.Control type="email" placeholder="Enter username" />
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
  )
}
