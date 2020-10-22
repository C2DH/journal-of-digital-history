import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row, Jumbotron,Badge } from 'react-bootstrap'
import { useStore } from '../store'
import FormGroupWrapper from '../components/Forms/FormGroupWrapper'
import FormAuthorsList from '../components/Forms/FormAuthorsList'
import FormAuthorContact from '../components/Forms/FormAuthorContact'
import FormAbstractDataset from '../components/Forms/FormAbstractDataset'

const AbstractSubmissionPreview = ({ results }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('pages.abstractSubmission.preview')}</h3>
      <div className="p-3 border rounded shadow" style={{
        backgroundColor: 'var(--gray-100)',
        maxHeight: '50vh',
        overflow: 'scroll'
      }}>
      {results.map(({ value, isValid=false, label }) => (
        <div >
          <Badge variant={ isValid ? 'success': 'transparent' } pill>{t(label)}</Badge>
          <p style={{
            height: '25px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{value}</p>
        </div>
      ))}
      </div>
    </div>
  )
}

export default function AbstractSubmission(props) {
  const { t } = useTranslation()
  const [ results, setResults ] = useState([
    { id: 'title', value: null, label: 'pages.abstractSubmission.articleTitle' },
    { id: 'abstract', value: null, label: 'pages.abstractSubmission.articleAbstract' },
    { id: 'contact', value: null, label: 'pages.abstractSubmission.articleContact' },
  ])

  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--light)' });
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.info('handleSubmit', results)
  }

  console.info('changed', props)
  const handleChange = ({ id, value, isValid }) => {
    console.info(id, value, isValid)
    setResults(results.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    }))
  }
  return (
    <Container className="page mb-5">
      <h1>{t('pages.abstractSubmission.title')}</h1>
      <hr />
      <Jumbotron className="pt-4 pb-2 px-4">
        <h3>Call for paper: <b>The Digital Dilemma under the lens of history and historians</b></h3>
        <p>
        This is a simple hero unit, a simple jumbotron-style component for calling
          extra attention to featured content or information.
          <br />
          <Badge pill variant="secondary">Due date: Dec. 2020</Badge>
        </p>
      </Jumbotron>
      <hr />
      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <h3>A title and an abstract</h3>
            <FormGroupWrapper id='title' as='textarea' schemaId='#/properties/title' rows={3} 
              label='pages.abstractSubmission.articleTitle'
              ignoreWhenLengthIslessThan={1}
              onChange={handleChange}
            />
            <FormGroupWrapper id='abstract' as='textarea' schemaId='#/properties/abstract' rows={5}
              label='pages.abstractSubmission.articleAbstract'
              ignoreWhenLengthIslessThan={1} 
              onChange={handleChange}
            />
            <hr/>
            <h3>{t('pages.abstractSubmission.ContactPointSectionTitle')}</h3>
            <FormAuthorContact groupId='contact' onChange={handleChange} />
            <hr />
            <h2>{t('pages.abstractSubmission.AuthorsSectionTitle')}</h2>
            <FormAuthorsList />
            <hr />
            <h2>{t('pages.abstractSubmission.DataSectionTitle')}</h2>
            <FormAbstractDataset />
            <hr />
          </Col>
          <Col md={4}>
            <div style={{
              position: 'sticky',
              top: '120px'
            }}>
            <AbstractSubmissionPreview results={results} /> 
            </div>
          </Col>
        </Row>
        
        <Button variant="primary" size="lg" className="px-4" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  )
}
