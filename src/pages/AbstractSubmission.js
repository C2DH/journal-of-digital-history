import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row } from "react-bootstrap"
import { useStore } from '../store'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'

const FormGroup = ({ schemaId, as, type, placeholder, label, children, ignoreWhenLengthIslessThan, setFormErrors }) => {
  const { t } = useTranslation()
  const [isValid, setIsValid] = useState(null);
  const [errors, setErrors] = useState([]);
  if (setFormErrors) {
    setFormErrors({ schemaId, label, pristine: true, errors: []})
  }
  
  const setPristine = () => {
    if (setFormErrors) {
      setFormErrors({ schemaId, label, pristine: true, errors: []})
    }
    setIsValid(null)
    setErrors([])
  }

  const handleChange = (event) => {
    if (!isNaN(ignoreWhenLengthIslessThan) && event.target.value.length < ignoreWhenLengthIslessThan) {
      setPristine()
      return
    }
    const result = getValidatorResultWithAbstractSchema({
      value: event.target.value,
      property: schemaId
    })
    if (setFormErrors) {
      setFormErrors({ schemaId, label, errors: result.errors })
    }
    setIsValid(result.valid)
    setErrors(result.errors)
  }
  return (
    <Form.Group controlId={schemaId}>
      <Form.Label>{t(label)}</Form.Label>
      <Form.Control as={as} type={type} placeholder={placeholder}
        onChange={handleChange}
        isInvalid={isValid === false}
        isValid={isValid === true} 
      />
      { children }
      {errors.map((error, i) => (
        <Form.Text key={i}>{error.name} {error.argument}</Form.Text>
      ))}
    </Form.Group>
  )
}

export default function AbstractSubmission() {
  const { t } = useTranslation()
  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--light)' });
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.info('handleSubmit')
  }
  const handleErrors = (event) => {
    console.warn(event)
  }
  return (
    <Container className="page">
      <h1>{t('pages.abstractSubmission.title')}</h1>
      <h2 className="mb-5">{t('pages.abstractSubmission.subheading')}</h2>
      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup schemaId='articleDatasetUrl' label='pages.abstractSubmission.articleDataset' ignoreWhenLengthIslessThan={10}>
              <Form.Text className="text-muted">
                Please check our <a href="#guidelines">guidelines</a>
              </Form.Text>
            </FormGroup>
          <Form.Group controlId="formEmail">
            <Form.Label>{t('pages.abstractSubmission.articleDataset')}</Form.Label>
            <Form.Control type="url" placeholder="dataverse public url" />
            <Form.Text className="text-muted">
              Please check our <a href="#guidelines">guidelines</a>
            </Form.Text>
          </Form.Group>
            <Form.Group controlId="formArticleTitle">
              <Form.Label>{t('pages.abstractSubmission.articleTitle')}</Form.Label>
              <Form.Control as="textarea" placeholder="Title" isValid={false}/>
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
            <FormGroup placeholder='' type='email' schemaId='authorEmail' 
              label='pages.abstractSubmission.authorEmail' ignoreWhenLengthIslessThan={5}
              setFormErrors={handleErrors}
            >
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </FormGroup>
            <FormGroup placeholder='' type='text' schemaId='authorEmail' label='pages.abstractSubmission.authorUsername' ignoreWhenLengthIslessThan={5}>
              <Form.Text className="text-muted">
                use a-z characters only, e.g. <code>bobsinclair</code>
              </Form.Text>
            </FormGroup>
          </Col>
        </Row>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
