import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button } from "react-bootstrap"


export default function AbstractSubmission(){
  const { t } = useTranslation()
  return (
    <Container>
      <h1>{t('pages.abstractSubmission.title')}</h1>
      <h2>{t('start')}</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
